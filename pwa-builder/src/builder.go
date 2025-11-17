package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"
	"sync"

	"github.com/pkg/errors"
)

const numCopyWorkers = 10
const nginxConfSrc = "../nginx/nginx.conf"
const pwaDataSrc = "src/pwa-data.json"
const productUrl = "https://beton.win"

type copyJob struct {
	srcPath string
	dstPath string
}

func copyDir(src string, dst string) error {
	srcInfo, err := os.Stat(src)
	if err != nil {
		return errors.Wrap(err, "failed to stat source dir")
	}

	if err := os.MkdirAll(dst, srcInfo.Mode()); err != nil {
		return errors.Wrap(err, "failed to create dest dir")
	}

	jobs := make(chan copyJob, numCopyWorkers)
	errChan := make(chan error, numCopyWorkers)
	var wg sync.WaitGroup
	for i := 0; i < numCopyWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobs {
				if err := copyFile(job.srcPath, job.dstPath, srcInfo.Mode()); err != nil {
					errChan <- err
				}
			}
		}()
	}

	go func() {
		defer close(jobs)

		err := filepath.Walk(src, func(path string, info os.FileInfo, walkErr error) error {
			if walkErr != nil {
				return walkErr
			}

			relPath, err := filepath.Rel(src, path)
			if err != nil {
				return errors.Wrap(err, "failed to get relative path")
			}

			dstPath := filepath.Join(dst, relPath)
			if info.IsDir() && (info.Name() == "node_modules" || info.Name() == "dist" || info.Name() == ".git") {
				return filepath.SkipDir
			}

			if info.IsDir() {
				return nil
			}

			jobs <- copyJob{srcPath: path, dstPath: dstPath}
			return nil
		})

		if err != nil {
			errChan <- err
		}
	}()

	go func() {
		wg.Wait()
		close(errChan)
	}()

	var firstError error
	for err := range errChan {
		if err != nil {
			log.Printf("ERROR during parallel copy: %v", err)
			if firstError == nil {
				firstError = err
			}
		}
	}

	return firstError
}

func copyFile(srcPath, dstPath string, baseMode os.FileMode) error {
	if err := os.MkdirAll(filepath.Dir(dstPath), baseMode); err != nil {
		return errors.Wrap(err, "failed to create dest dir")
	}

	srcFile, err := os.Open(srcPath)
	if err != nil {
		return errors.Wrapf(err, "failed to open source file %s", srcPath)
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dstPath)
	if err != nil {
		return errors.Wrapf(err, "failed to create dest file %s", dstPath)
	}
	defer dstFile.Close()

	if _, err := io.Copy(dstFile, srcFile); err != nil {
		return errors.Wrapf(err, "failed to copy file content to %s", dstPath)
	}
	return nil
}

func updateDestinationURL(filePath string, newURL string) error {
	log.Printf("Reading: %s", filePath)
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("failed to read file %s: %w", filePath, err)
	}

	info, err := os.Stat(filePath)
	if err != nil {
		return fmt.Errorf("failed to get file permissions (stat): %w", err)
	}
	fileMode := info.Mode()

	var configData map[string]interface{}
	if err := json.Unmarshal(data, &configData); err != nil {
		return fmt.Errorf("failed to parse JSON (check syntax): %w", err)
	}

	log.Printf("Setting pwa data variables...")
	configData["destination_url"] = newURL
	configData["product_url"] = productUrl

	updatedData, err := json.MarshalIndent(configData, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON back: %w", err)
	}

	if err := os.WriteFile(filePath, updatedData, fileMode); err != nil {
		return fmt.Errorf("failed to overwrite file: %w", err)
	}

	log.Printf("File %s updated successfully.", filePath)
	return nil
}

func updateNginxConfig(filePath string, domain string) error {
	info, err := os.Stat(filePath)
	if err != nil {
		return errors.Wrap(err, "failed to stat config file")
	}
	fileMode := info.Mode()
	content, err := os.ReadFile(filePath)
	if err != nil {
		return errors.Wrap(err, "failed to read config file")
	}

	configString := string(content)
	newConfigString := strings.Replace(configString, "%s", domain, 2)

	err = os.WriteFile(filePath, []byte(newConfigString), fileMode)
	if err != nil {
		return errors.Wrap(err, "failed to write updated config file")
	}

	log.Printf("Successfully updated %s with domain %s", filePath, domain)
	return nil
}

func runBuild(reactAppPath string, domain string) (string, error) {
	localBuildDir := fmt.Sprintf("../builds/pwa_vite_%s", domain)
	err := copyDir(reactAppPath, localBuildDir)
	if err != nil {
		return "", errors.Wrapf(err, "Error during creating copy of directory %s", localBuildDir)
	}
	log.Printf("BUILDER: Starting npm install for App: %s at %s", domain, localBuildDir)

	absLocalBuildDir, err := filepath.Abs(localBuildDir)
	if err != nil {
		return "", errors.Wrap(err, "failed to get absolute path for build dir")
	}
	err = updateDestinationURL(path.Join(absLocalBuildDir, pwaDataSrc), fmt.Sprintf("https://%s", "domforpwaalfatest.com/Z2zSjt"))
	if err != nil {
		return "", err
	}
	log.Printf("pwa-data.json updated successfully.")

	installCmd := exec.Command("npm", "i", "--prefix", localBuildDir)
	installCmd.Dir = "."
	installOutput, err := installCmd.CombinedOutput()
	if err != nil {
		log.Printf("NPM INSTALL FAILED for %s \nOutput:%s", err.Error(), string(installOutput))
		return "", errors.Wrapf(err, "npm install failed for %s", domain)
	}
	log.Printf("NPM INSTALL SUCCESS for %s", domain)
	log.Printf("BUILDER: Starting npm build for App: %s", domain)

	cmd := exec.Command("npm", "run", "build", "--prefix", localBuildDir)
	cmd.Dir = "."

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("BUILD FAILED for %s: %s\nOutput:\n%s", domain, err.Error(), string(output))
		return "", errors.Wrapf(err, "build failed for %s", domain)
	}

	if err := os.MkdirAll(absLocalBuildDir, 0755); err != nil {
		return "", errors.Wrapf(err, "failed to create build output dir: %s", absLocalBuildDir)
	}

	nginxConfDest := path.Join(absLocalBuildDir, "dist/nginx.conf")
	log.Printf("Copying nginx config to %s", absLocalBuildDir)

	srcInfo, err := os.Stat(nginxConfSrc)
	if err != nil {
		return "", errors.Wrap(err, "failed to stat nginxConfSrc for permissions")
	}

	if err := copyFile(nginxConfSrc, nginxConfDest, srcInfo.Mode()); err != nil {
		return "", errors.Wrapf(err, "failed to copy nginx.conf")
	}

	err = updateNginxConfig(nginxConfDest, domain)
	if err != nil {
		return "", err
	}
	log.Printf("Nginx config copied successfully.")

	log.Printf("BUILD SUCCESS.Output dir: %s", absLocalBuildDir)
	return absLocalBuildDir, nil
}
