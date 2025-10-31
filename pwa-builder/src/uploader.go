package main

import (
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"path"
	"path/filepath"
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

func NewSftpUploader(creds SftpCredentials, localDir, remoteDir string) (*SftpUploader, error) {
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
		localBaseDir:  localDir,
		remoteBaseDir: remoteDir,
	}, nil
}

func (u *SftpUploader) Upload() error {
	if u.client == nil {
		return errors.New("SFTP client is nil. Cannot upload.")
	}
	log.Printf("SFTP: Starting recursive upload from %s to %s", u.localBaseDir, u.remoteBaseDir)

	walkFn := func(localPath string, info os.FileInfo, err error) error {
		if err != nil {
			return errors.Wrap(err, "error during file walk")
		}

		if info.IsDir() {
			return nil
		}

		relativePath, err := filepath.Rel(u.localBaseDir, localPath)
		if err != nil {
			return errors.Wrap(err, "failed to get relative path")
		}

		remotePath := path.Join(u.remoteBaseDir, filepath.ToSlash(relativePath))
		remoteDir := path.Dir(remotePath)

		if err := u.client.MkdirAll(remoteDir); err != nil {
			return errors.Wrapf(err, "failed to create remote directory %s", remoteDir)
		}

		localFile, err := os.Open(localPath)
		if err != nil {
			return errors.Wrapf(err, "failed to open local file %s", localPath)
		}

		defer localFile.Close()

		remoteFile, err := u.client.Create(remotePath)
		if err != nil {
			return errors.Wrapf(err, "failed to create remote file %s", remotePath)
		}
		defer remoteFile.Close()

		_, err = io.Copy(remoteFile, localFile)
		if err != nil {
			return errors.Wrapf(err, "failed to copy data to %s", remotePath)
		}

		log.Printf("SFTP: Uploaded %s", remotePath)
		return nil
	}

	return filepath.Walk(u.localBaseDir, walkFn)
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
	return nil
}
