-- CreateEnum
CREATE TYPE "ErrorLevel" AS ENUM ('info', 'warn', 'error', 'fatal');

-- CreateTable
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "level" "ErrorLevel" NOT NULL DEFAULT 'error',
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "service" TEXT,
    "context" JSONB,
    "path" TEXT,
    "method" TEXT,
    "user_id" TEXT,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "error_logs_level_idx" ON "error_logs"("level");

-- CreateIndex
CREATE INDEX "error_logs_service_idx" ON "error_logs"("service");

-- CreateIndex
CREATE INDEX "error_logs_created_at_idx" ON "error_logs"("created_at");

-- CreateIndex
CREATE INDEX "error_logs_user_id_idx" ON "error_logs"("user_id");

-- CreateIndex
CREATE INDEX "error_logs_session_id_idx" ON "error_logs"("session_id");

-- CreateIndex
CREATE INDEX "error_logs_path_idx" ON "error_logs"("path");

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "pwa_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
