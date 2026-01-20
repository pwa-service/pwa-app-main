package main

import (
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"path"
	"path/filepath"
	"sync"
	"time"

	"github.com/pkg/errors"
	"github.com/pkg/sftp"
	"golang.org/x/crypto/ssh"
)

type SftpCredentials struct {
	User     string
	Host     string
	Password string
}

type SftpUploader struct {
	client        *sftp.Client
	sshConn       *ssh.Client
	localBaseDir  string
	remoteBaseDir string
}

const numUploadWorkers = 10

type uploadJob struct {
	localPath  string
	remotePath string
}

func NewSftpUploader(creds SftpCredentials, remoteDir string) (*SftpUploader, error) {
	if creds.Host == "" || creds.User == "" || creds.Password == "" {
		return nil, errors.New("SFTP_HOST, SFTP_USER, or SFTP_PASSWORD env vars not set")
	}

	config := &ssh.ClientConfig{
		User: creds.User,
		Auth: []ssh.AuthMethod{
			ssh.Password(creds.Password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         10 * time.Second,
	}

	addr := creds.Host
	if _, _, err := net.SplitHostPort(addr); err != nil {
		addr = fmt.Sprintf("%s:22", addr)
	}

	conn, err := ssh.Dial("tcp", addr, config)
	if err != nil {
		return nil, errors.Wrap(err, "failed to dial SSH")
	}

	client, err := sftp.NewClient(conn)
	if err != nil {
		_ = conn.Close()
		return nil, errors.Wrap(err, "failed to create SFTP client")
	}

	log.Println("SFTP: Connection established successfully.")
	return &SftpUploader{
		client:        client,
		sshConn:       conn,
		remoteBaseDir: remoteDir,
	}, nil
}

func (u *SftpUploader) Upload(localBaseDir string) error {
	if u.client == nil {
		return errors.New("SFTP client is nil. Cannot upload.")
	}
	log.Printf("SFTP: Starting parallel upload from %s to %s", localBaseDir, u.remoteBaseDir)

	jobs := make(chan uploadJob, numUploadWorkers)
	errChan := make(chan error, numUploadWorkers)
	var wg sync.WaitGroup

	for i := 0; i < numUploadWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for job := range jobs {
				if err := u.uploadFile(job.localPath, job.remotePath); err != nil {
					errChan <- err
				}
			}
		}()
	}

	walkErrCh := make(chan error, 1)

	go func() {
		defer close(jobs)

		walkFn := func(localPath string, info os.FileInfo, err error) error {
			if err != nil {
				return errors.Wrap(err, "error during file walk")
			}
			if info.IsDir() {
				return nil
			}

			relativePath, err := filepath.Rel(localBaseDir, localPath)
			if err != nil {
				return errors.Wrap(err, "failed to get relative path")
			}

			remotePath := path.Join(u.remoteBaseDir, filepath.ToSlash(relativePath))
			jobs <- uploadJob{localPath: localPath, remotePath: remotePath}
			return nil
		}

		if err := filepath.Walk(localBaseDir, walkFn); err != nil {
			walkErrCh <- err
		}
		close(walkErrCh)
	}()

	go func() {
		wg.Wait()
		close(errChan)
	}()

	if err := <-walkErrCh; err != nil {
		return errors.Wrap(err, "SFTP Uploader: File scan failed")
	}

	var firstError error
	for err := range errChan {
		if err != nil {
			log.Printf("SFTP: Upload worker failed: %v", err)
			if firstError == nil {
				firstError = err
			}
		}
	}

	if firstError != nil {
		return errors.Wrap(firstError, "SFTP UPLOAD FAILED")
	}

	log.Printf("SFTP: All files uploaded successfully to %s", u.remoteBaseDir)
	return nil
}

func (u *SftpUploader) uploadFile(localPath, remotePath string) error {
	localFile, err := os.Open(localPath)
	if err != nil {
		return errors.Wrapf(err, "failed to open local file %s", localPath)
	}
	defer localFile.Close()

	remoteDir := path.Dir(remotePath)
	if err := u.client.MkdirAll(remoteDir); err != nil {
		return errors.Wrapf(err, "failed to create remote directory %s", remoteDir)
	}

	remoteFile, err := u.client.Create(remotePath)
	if err != nil {
		return errors.Wrapf(err, "failed to create remote file %s", remotePath)
	}
	defer remoteFile.Close()

	_, err = io.Copy(remoteFile, localFile)
	if err != nil {
		return errors.Wrapf(err, "failed to copy data to %s", remotePath)
	}

	return nil
}

func (u *SftpUploader) Close() error {
	log.Println("SFTP: Closing connection...")

	if u.client == nil && u.sshConn == nil {
		log.Println("SFTP: Connection already closed or was never initialized.")
		return nil
	}

	if u.client != nil {
		if err := u.client.Close(); err != nil {
			_ = u.sshConn.Close()
			return errors.Wrap(err, "failed to close SFTP client")
		}
	}

	if u.sshConn != nil {
		if err := u.sshConn.Close(); err != nil {
			return errors.Wrap(err, "failed to close SSH connection")
		}
	}

	log.Println("SFTP: Connection closed successfully.")
	return nil
}

func (u *SftpUploader) RunDockerCompose(remoteDir string) error {
	if u.sshConn == nil {
		return errors.New("SSH connection is nil. Cannot run commands.")
	}

	session, err := u.sshConn.NewSession()
	if err != nil {
		return errors.Wrap(err, "failed to create SSH session")
	}
	defer session.Close()

	session.Stdout = os.Stdout
	session.Stderr = os.Stderr
	cmd := fmt.Sprintf("cd %s && docker compose down -v --remove-orphans --rmi local && docker compose up -d --build --force-recreate", remoteDir)

	log.Printf("SSH: Executing clean redeploy command: %s", cmd)

	if err := session.Run(cmd); err != nil {
		return errors.Wrapf(err, "failed to run docker compose cleanup and start in %s", remoteDir)
	}

	log.Println("SSH: Docker compose redeploy executed successfully.")
	return nil
}
