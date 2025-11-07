package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path"
	"syscall"
	"time"

	"github.com/caarlos0/env"
	"github.com/pkg/errors"
	"github.com/redis/go-redis/v9"
	"go.codycody31.dev/gobullmq"
	"go.codycody31.dev/gobullmq/types"
)

const CREATE_APP_QUEUE = "CREATE_APP_QUEUE"

type Config struct {
	QueueName         string `env:"QUEUE_NAME" envDefault:"BUILD_QUEUE"`
	ReactAppPath      string `env:"REACT_APP_PATH" envDefault:"../../pwa_vite"`
	QueuePrefix       string `env:"QUEUE_PREFIX" envDefault:"pwa"`
	WorkerConcurrency int    `env:"WORKER_CONCURRENCY" envDefault:"10"`
	RedisHost         string `env:"REDIS_HOST" envDefault:"localhost"`
	RedisPort         string `env:"REDIS_PORT" envDefault:"6379"`
	RedisPassword     string `env:"REDIS_PASSWORD" envDefault:""`
	SftpHost          string `env:"SFTP_USER" envDefault:"72.60.247.106"`
	SftpUser          string `env:"SFTP_USER" envDefault:"eliot"`
	SftpPassword      string `env:"SFTP_PASSWORD" envDefault:"Eliot_Password"`
	RemoteBaseDir     string `env:"REMOTE_BASE_DIR" envDefault:"/home/eliot/websites/apps"`
}

type CreateAppJob struct {
	Domain string `json:"Domain"`
	AppID  string `json:"appId"`
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

	rdb := redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password:     cfg.RedisPassword,
		DB:           0,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	res, err := rdb.Ping(ctx).Result()
	fmt.Println(res, err)
	if err != nil {
		log.Fatalf("Failed to connect to Redis Standalone: %v", err)
	}
	fmt.Println("Connected to Redis Standalone")

	queue, err := gobullmq.NewQueue(ctx, CREATE_APP_QUEUE, rdb,
		gobullmq.WithKeyPrefix("pwa"),
	)
	if err != nil {
		log.Fatalf("Failed to create queue: %v", err)
	}

	workerProcess := func(ctx context.Context, job *types.Job, api gobullmq.WorkerProcessAPI) (interface{}, error) {
		fmt.Printf("WORKER: Processing job %s. Data type: %T\n", job.Id, job.Data)
		fmt.Println(job.ToJsonData())

		dataString, ok := job.Data.(string)
		if !ok {
			log.Printf("Failed to assert job.Data to string. Type is: %T", job.Data)
			return nil, errors.New("job data is not a string")
		}

		var jobData CreateAppJob
		pingerCtx, cancelPinger := context.WithCancel(context.Background())
		go keepAlivePinger(pingerCtx, rdb)
		defer cancelPinger()

		if err := json.Unmarshal([]byte(dataString), &jobData); err != nil {
			log.Printf("Go Worker: Failed to unmarshal job JSON: %v. Data: %s", err, dataString)
			return nil, errors.New("cannot unmarshal job JSON")
		}

		fmt.Printf("Processing job %s for App ID: %s\n", job.Id, jobData.AppID)

		localBuildDir, buildErr := runBuild(cfg.ReactAppPath, jobData.Domain)
		localBuildDirToRemove := localBuildDir
		localBuildDir = path.Join(localBuildDir, "dist")
		if buildErr != nil {
			log.Printf("Job %s FAILED build: %v", job.Id, buildErr)
			return nil, errors.Wrapf(buildErr, "Build process failed")
		}

		defer func() {
			log.Printf("Cleaning up local build directory: %s", localBuildDirToRemove)
			if err := os.RemoveAll(localBuildDirToRemove); err != nil {
				log.Printf("Warning: Failed to remove local build directory %s: %v", localBuildDirToRemove, err)
			} else {
				log.Printf("Build %s has been cleaned out successfully", localBuildDirToRemove)
			}
		}()

		log.Println("SFTP: Initializing transporter...")
		sftpCreds := SftpCredentials{
			User:     cfg.SftpUser,
			Password: cfg.SftpPassword,
			Host:     cfg.SftpHost,
		}
		remoteUploadPath := path.Join(cfg.RemoteBaseDir, jobData.Domain)

		transporter, err := NewSftpUploader(sftpCreds, remoteUploadPath)
		if err != nil {
			return nil, errors.Wrap(err, "SFTP connection failed")
		}
		defer transporter.Close()
		if err := transporter.Upload(localBuildDir); err != nil {
			log.Printf("SFTP upload failed for %s: %v", jobData.AppID, err)
			return nil, errors.Wrap(err, "SFTP upload failed")
		}

		log.Printf("Job %s for App %s completed successfully.", job.Id, jobData.AppID)

		queue.Add(ctx, "APP_CREATED", jobData)
		return "Build and SFTP upload complete", nil
	}

	worker, err := gobullmq.NewWorker(ctx, cfg.QueueName, gobullmq.WorkerOptions{
		Concurrency:     cfg.WorkerConcurrency,
		StalledInterval: 30000,
		Prefix:          cfg.QueuePrefix,
		LockDuration:    3000000,
	}, rdb, workerProcess)

	if err != nil {
		log.Fatalf("Failed to create worker: %v", err)
	}

	fmt.Println("Starting gobullmq worker with concurrency 10...")
	fmt.Printf("Waiting for 'job' tasks in queue %s...", cfg.QueueName)

	worker.On("error", func(args ...interface{}) {
		fmt.Printf("Worker error: %v\n", args)
	})

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	go func() {
		if err := worker.Run(); err != nil {
			log.Printf("Worker error: %v", err)
		}
	}()
	<-c

	fmt.Println("\nShutting down worker...")
	worker.Close()
	err = rdb.Close()
	if err != nil {
		return
	}
	fmt.Println("Worker shut down gracefully")
}
