package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path"
	"sync"
	"syscall"
	"time"

	"github.com/caarlos0/env"
	_ "github.com/pkg/errors"
	"github.com/redis/go-redis/v9"
)

const BUILD_STATUS_NEW = "BUILD_PWA_CHANNEL:CREATE_APP_EVENT"
const BUILD_STATUS_FINISHED = "BUILD_PWA_CHANNEL:BUILD_FINISHED_EVENT"
const DELETE_STATUS_NEW = "BUILD_PWA_CHANNEL:DELETE_APP_EVENT"
const DELETE_STATUS_FINISHED = "BUILD_PWA_CHANNEL:DELETE_FINISHED_EVENT"

type Config struct {
	ReactAppPath      string `env:"REACT_APP_PATH" envDefault:"../pwa_vite"`
	TraeficConfPath   string `env:"TRAEFIC_CONF_PATH" envDefault:"docker/docker-compose.yaml"`
	WorkerConcurrency int    `env:"WORKER_CONCURRENCY" envDefault:"10"`
	RedisHost         string `env:"REDIS_HOST" envDefault:"localhost"`
	RedisPort         string `env:"REDIS_PORT" envDefault:"6379"`
	RedisPassword     string `env:"REDIS_PASSWORD" envDefault:""`
	SftpHost          string `env:"SFTP_HOST" envDefault:"72.60.247.106"`
	SftpUser          string `env:"SFTP_USER" envDefault:"eliot"`
	SftpPassword      string `env:"SFTP_PASSWORD" envDefault:"Eliot_Password"`
	RemoteBaseDir     string `env:"REMOTE_BASE_DIR" envDefault:"/home/eliot/websites/apps"`
}

type CreateAppJob struct {
	Domain string     `json:"domain"`
	AppID  string     `json:"appId"`
	Config *AppConfig `json:"config,omitempty"`
}

type DeleteAppJob struct {
	Domain   string `json:"domain"`
	AppID    string `json:"appId"`
	DomainID string `json:"domainId,omitempty"`
}

type BuildStatusUpdate struct {
	AppID  string `json:"appId"`
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
}

type DeleteStatusUpdate struct {
	AppID    string `json:"appId"`
	Domain   string `json:"domain"`
	DomainID string `json:"domainId,omitempty"`
	Status   string `json:"status"`
	Error    string `json:"error,omitempty"`
}

func keepAlivePinger(ctx context.Context, rdb *redis.Client) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	log.Println("KeepAlive Pinger: Started.")

	for {
		select {
		case <-ticker.C:
			if err := rdb.Ping(ctx).Err(); err != nil {
				log.Printf("KeepAlive Pinger: Failed to ping Redis: %v", err)
				return
			}
			log.Println("KeepAlive Pinger: PING sent.")

		case <-ctx.Done():
			log.Println("KeepAlive Pinger: Stopping.")
			return
		}
	}
}

func main() {
	ctx := context.Background()
	cfg := Config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatalf("%+v", err)
	}

	rdbClient := redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password:     cfg.RedisPassword,
		DB:           0,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	rdbListener := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPassword,
		DB:       0,
	})

	_, err := rdbClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis Standalone: %v", err)
	}
	fmt.Println("Connected to Redis Standalone")

	pingerCtx, cancelPinger := context.WithCancel(context.Background())
	go keepAlivePinger(pingerCtx, rdbClient)

	pubsub := rdbListener.Subscribe(ctx, BUILD_STATUS_NEW, DELETE_STATUS_NEW)
	defer pubsub.Close()

	_, err = pubsub.Receive(ctx)
	if err != nil {
		log.Fatalf("Failed to subscribe to channels: %v", err)
	}

	ch := pubsub.Channel()
	fmt.Printf("Starting Pub/Sub worker with concurrency limit %d... Waiting for jobs on channels '%s', '%s'\n", cfg.WorkerConcurrency, BUILD_STATUS_NEW, DELETE_STATUS_NEW)

	workerPool := make(chan struct{}, cfg.WorkerConcurrency)
	var wg sync.WaitGroup
	workerCtx, cancelWorkers := context.WithCancel(context.Background())

	go func() {
		for msg := range ch {
			workerPool <- struct{}{}
			wg.Add(1)

			go func(channel string, payload string) {
				defer wg.Done()
				defer func() { <-workerPool }()
				switch channel {
				case BUILD_STATUS_NEW:
					processMessage(workerCtx, rdbClient, cfg, payload)
				case DELETE_STATUS_NEW:
					processDeleteMessage(workerCtx, rdbClient, cfg, payload)
				}
			}(msg.Channel, msg.Payload)
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	fmt.Println("\nShutting down worker... Stopping job intake.")
	pubsub.Close()

	cancelWorkers()
	fmt.Println("Waiting for active jobs to complete...")

	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()

	select {
	case <-done:
		fmt.Println("All jobs completed.")
	case <-time.After(30 * time.Second):
		fmt.Println("Warning: Shutdown timeout reached. Some jobs might be incomplete.")
	}

	cancelPinger()
	rdbClient.Close()
	rdbListener.Close()
	fmt.Println("Worker shut down gracefully")
}

func processMessage(ctx context.Context, rdb *redis.Client, cfg Config, jobJSON string) {
	var jobData CreateAppJob
	if err := json.Unmarshal([]byte(jobJSON), &jobData); err != nil {
		log.Printf("Go Worker: Failed to unmarshal job JSON: %v. Data: %s", err, jobJSON)
		return
	}

	select {
	case <-ctx.Done():
		log.Printf("Job %s skipped due to worker shutdown.", jobData.AppID)
		return
	default:
	}

	fmt.Printf("Processing job for App ID: %s (Domain: %s)\n", jobData.AppID, jobData.Domain)

	publishStatus(ctx, rdb, jobData.AppID, "PENDING", "")

	sftpCreds := SftpCredentials{
		User:     cfg.SftpUser,
		Password: cfg.SftpPassword,
		Host:     cfg.SftpHost,
	}
	transporter, err := NewSftpUploader(sftpCreds, path.Join(cfg.RemoteBaseDir, jobData.Domain))
	if err != nil {
		publishStatus(ctx, rdb, jobData.AppID, "ERROR", fmt.Sprintf("SFTP connection failed: %v", err))
		return
	}
	defer transporter.Close()

	absLocalBuildDir, buildErr := runBuild(cfg.ReactAppPath, cfg.TraeficConfPath, jobData.Domain, jobData.Config)
	localBuildDirToRemove := absLocalBuildDir
	localBuildDir := path.Join(absLocalBuildDir, "dist")

	defer func() {
		if localBuildDirToRemove != "" {
			log.Printf("Cleaning up local build directory: %s", localBuildDirToRemove)
			if err := os.RemoveAll(localBuildDirToRemove); err != nil {
				log.Printf("Warning: Failed to remove local build directory %s: %v", localBuildDirToRemove, err)
			} else {
				log.Printf("Build %s has been cleaned out successfully", localBuildDirToRemove)
			}
		}
	}()

	if buildErr != nil {
		log.Printf("Job %s FAILED build: %v", jobData.AppID, buildErr)
		publishStatus(ctx, rdb, jobData.AppID, "ERROR", fmt.Sprintf("Build process failed: %v", buildErr))
		return
	}

	if err := transporter.Upload(localBuildDir); err != nil {
		log.Printf("SFTP upload failed for %s: %v", jobData.AppID, err)
		publishStatus(ctx, rdb, jobData.AppID, "ERROR", fmt.Sprintf("SFTP upload failed: %v", err))
		return
	}

	if err := transporter.RunDockerCompose(transporter.remoteBaseDir); err != nil {
		log.Printf("SFTP running docker compose failed for %s: %v", jobData.AppID, err)
		publishStatus(ctx, rdb, jobData.AppID, "ERROR", fmt.Sprintf("SFTP running failed: %v", err))
		return
	}

	log.Printf("Job %s for App %s completed successfully.", jobData.AppID, jobData.AppID)
	publishStatus(ctx, rdb, jobData.AppID, "SUCCESS", "")
}

func processDeleteMessage(ctx context.Context, rdb *redis.Client, cfg Config, jobJSON string) {
	var jobData DeleteAppJob
	if err := json.Unmarshal([]byte(jobJSON), &jobData); err != nil {
		log.Printf("Go Worker: Failed to unmarshal delete job JSON: %v. Data: %s", err, jobJSON)
		return
	}

	select {
	case <-ctx.Done():
		log.Printf("Delete job %s skipped due to worker shutdown.", jobData.AppID)
		return
	default:
	}

	fmt.Printf("Processing DELETE job for App ID: %s (Domain: %s)\n", jobData.AppID, jobData.Domain)

	sftpCreds := SftpCredentials{
		User:     cfg.SftpUser,
		Password: cfg.SftpPassword,
		Host:     cfg.SftpHost,
	}

	remoteDir := path.Join(cfg.RemoteBaseDir, jobData.Domain)
	transporter, err := NewSftpUploader(sftpCreds, remoteDir)
	if err != nil {
		publishDeleteStatus(ctx, rdb, jobData, "ERROR", fmt.Sprintf("SFTP connection failed: %v", err))
		return
	}
	defer transporter.Close()

	if err := transporter.DestroyApp(remoteDir); err != nil {
		log.Printf("Delete failed for %s: %v", jobData.AppID, err)
		publishDeleteStatus(ctx, rdb, jobData, "ERROR", fmt.Sprintf("Destroy failed: %v", err))
		return
	}

	log.Printf("Delete job %s for domain %s completed successfully.", jobData.AppID, jobData.Domain)
	publishDeleteStatus(ctx, rdb, jobData, "SUCCESS", "")
}

func publishStatus(ctx context.Context, rdb *redis.Client, appId string, status string, errMsg string) {
	payload := BuildStatusUpdate{
		AppID:  appId,
		Status: status,
		Error:  errMsg,
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal status payload: %v", err)
		return
	}

	if err := rdb.Publish(ctx, BUILD_STATUS_FINISHED, jsonPayload).Err(); err != nil {
		log.Printf("Failed to publish status update to channel %s: %v", BUILD_STATUS_FINISHED, err)
	}
}

func publishDeleteStatus(ctx context.Context, rdb *redis.Client, jobData DeleteAppJob, status string, errMsg string) {
	payload := DeleteStatusUpdate{
		AppID:    jobData.AppID,
		Domain:   jobData.Domain,
		DomainID: jobData.DomainID,
		Status:   status,
		Error:    errMsg,
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal delete status payload: %v", err)
		return
	}

	if err := rdb.Publish(ctx, DELETE_STATUS_FINISHED, jsonPayload).Err(); err != nil {
		log.Printf("Failed to publish delete status to channel %s: %v", DELETE_STATUS_FINISHED, err)
	}
}
