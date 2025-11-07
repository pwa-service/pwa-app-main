FROM golang:1.23.4-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git ca-certificates

COPY pwa-builder/go.mod pwa-builder/go.sum ./

RUN go mod download
COPY src/ ./src/

RUN cd src && go build -o /app/worker .
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssh-client libc6-compat
COPY --from=builder /app/worker .

COPY pwa_vite ./pwa_vite
RUN npm install --prefix ./pwa_vite
CMD ["./worker"]