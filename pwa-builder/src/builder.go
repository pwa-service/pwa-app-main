package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/pkg/errors"
)

func runBuild(reactAppPath string, appName string, appID string) (string, error) {
	log.Printf("BUILDER: Starting npm install for App ID: %s at %s", appID, reactAppPath)

	installCmd := exec.Command("npm", "i", "--prefix", reactAppPath)
	installCmd.Dir = "."
	installOutput, err := installCmd.CombinedOutput()
	if err != nil {
		log.Printf("NPM INSTALL FAILED for %s: %s\nOutput:\n%s", appID, err.Error(), string(installOutput))
		return "", errors.Wrapf(err, "npm install failed for %s", appID)
	}
	log.Printf("NPM INSTALL SUCCESS for %s.", appID)
	log.Printf("BUILDER: Starting npm build for App ID: %s", appID)

	localBuildDir := fmt.Sprintf("../pwa-builder/builds/%s_%s", appName, appID)
	absLocalBuildDir, err := filepath.Abs(localBuildDir)
	if err != nil {
		return "", errors.Wrap(err, "failed to get absolute path for build dir")
	}

	if err := os.MkdirAll(absLocalBuildDir, 0755); err != nil {
		return "", errors.Wrapf(err, "failed to create build output dir: %s", absLocalBuildDir)
	}

	cmd := exec.Command("npm", "run", "build", "--prefix", reactAppPath, "--", "--outDir", absLocalBuildDir)
	cmd.Dir = "."

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("BUILD FAILED for %s: %s\nOutput:\n%s", appID, err.Error(), string(output))
		return "", errors.Wrapf(err, "build failed for %s", appID)
	}
	log.Printf("BUILD SUCCESS for %s. Output dir: %s", appID, absLocalBuildDir)

	return absLocalBuildDir, nil
}
