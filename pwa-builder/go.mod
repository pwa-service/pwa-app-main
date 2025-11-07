module pwa-builder

go 1.23.4

require (
	github.com/caarlos0/env v3.5.0+incompatible
	github.com/pkg/errors v0.9.1
	github.com/pkg/sftp v1.13.10
	github.com/redis/go-redis/v9 v9.12.0
	go.codycody31.dev/gobullmq v1.0.3
	golang.org/x/crypto v0.41.0

)

require (
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/gorhill/cronexpr v0.0.0-20180427100037-88b0669f7d75 // indirect
	github.com/kr/fs v0.1.0 // indirect
	github.com/robfig/cron/v3 v3.0.1 // indirect
	github.com/vmihailenco/msgpack/v5 v5.4.1 // indirect
	github.com/vmihailenco/tagparser/v2 v2.0.0 // indirect
	golang.org/x/sys v0.35.0 // indirect

)

replace go.codycody31.dev/gobullmq => github.com/eliot-hash/gobullmq v0.0.0-20251030044644-074e134da1b0
