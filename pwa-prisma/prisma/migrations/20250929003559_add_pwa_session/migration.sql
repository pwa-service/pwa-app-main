-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('admin', 'buyer');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('viewcontent', 'pageview', 'lead', 'completeregistration', 'purchase', 'subscribe');

-- CreateEnum
CREATE TYPE "public"."LogStatus" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'buyer',
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pixel_tokens" (
    "id" SERIAL NOT NULL,
    "pixel_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'active',

    CONSTRAINT "pixel_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "pixel_id" TEXT NOT NULL,
    "event_type" "public"."EventType" NOT NULL,
    "event_id" TEXT NOT NULL,
    "revenue" DECIMAL(18,8),
    "country" TEXT,
    "ip_address" TEXT,
    "response_data" TEXT,
    "status" "public"."LogStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pwa_sessions" (
    "user_id" TEXT NOT NULL,
    "pwa_domain" TEXT NOT NULL,
    "landing_url" TEXT,
    "query_string_raw" TEXT,
    "pixel_id" TEXT NOT NULL,
    "fbclid" TEXT,
    "offer_id" TEXT,
    "utm_source" TEXT,
    "sub1" TEXT,
    "final_url" TEXT,
    "first_open_at" TIMESTAMP(3),
    "first_open_event_id" TEXT,
    "first_open_fb_status" "public"."LogStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pwa_sessions_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pixel_tokens_pixel_id_key" ON "public"."pixel_tokens"("pixel_id");

-- CreateIndex
CREATE INDEX "idx_pixelTokens_userId" ON "public"."pixel_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_eventLogs_userId" ON "public"."event_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_eventLogs_pixelId" ON "public"."event_logs"("pixel_id");

-- CreateIndex
CREATE INDEX "idx_eventLogs_eventType" ON "public"."event_logs"("event_type");

-- CreateIndex
CREATE INDEX "idx_eventLogs_createdAt" ON "public"."event_logs"("created_at");

-- AddForeignKey
ALTER TABLE "public"."pixel_tokens" ADD CONSTRAINT "pixel_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
