/*
  Warnings:

  - You are about to drop the column `context` on the `error_logs` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `error_logs` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `error_logs` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `pixel_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_user_id` on the `pwa_apps` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `pwa_apps` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `pwa_apps` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `pwa_apps` table. All the data in the column will be lost.
  - The `status` column on the `pwa_apps` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sub1` on the `pwa_sessions` table. All the data in the column will be lost.
  - The `first_open_fb_status` column on the `pwa_sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[pixel_id,event_id]` on the table `event_logs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `pixel_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[first_open_event_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lead_event_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reg_event_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sub_event_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[first_dep_event_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `pixel_id` on table `event_logs` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `campaign_id` to the `pwa_apps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain_id` to the `pwa_apps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_user_id` to the `pwa_apps` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PwaStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('open', 'in_progress', 'closed');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('info', 'warn', 'error', 'fatal');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('None', 'View', 'Edit', 'Manage');

-- CreateEnum
CREATE TYPE "WorkingObjectType" AS ENUM ('PWA', 'FLOW', 'PIXEL_TOKEN');

-- CreateEnum
CREATE TYPE "ObjectRelationType" AS ENUM ('DependsOn', 'Owns', 'Uses');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "DeviceOs" AS ENUM ('Linux', 'Windows', 'MacOS', 'Android', 'IOS');

-- CreateEnum
CREATE TYPE "WorkingObjectUserRelation" AS ENUM ('Owner', 'Editor', 'Viewer');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ErrorLevel" ADD VALUE 'Anomaly';
ALTER TYPE "ErrorLevel" ADD VALUE 'TechError';
ALTER TYPE "ErrorLevel" ADD VALUE 'TokenExpirity';
ALTER TYPE "ErrorLevel" ADD VALUE 'TrashholdReached';

-- DropForeignKey
ALTER TABLE "pwa_apps" DROP CONSTRAINT "pwa_apps_created_by_user_id_fkey";

-- DropIndex
DROP INDEX "error_logs_created_at_idx";

-- DropIndex
DROP INDEX "error_logs_level_idx";

-- DropIndex
DROP INDEX "error_logs_path_idx";

-- DropIndex
DROP INDEX "error_logs_service_idx";

-- DropIndex
DROP INDEX "error_logs_session_id_idx";

-- DropIndex
DROP INDEX "error_logs_user_id_idx";

-- DropIndex
DROP INDEX "event_logs_country_idx";

-- DropIndex
DROP INDEX "event_logs_event_id_idx";

-- DropIndex
DROP INDEX "event_logs_pixel_id_idx";

-- DropIndex
DROP INDEX "event_logs_status_idx";

-- DropIndex
DROP INDEX "idx_eventLogs_createdAt";

-- DropIndex
DROP INDEX "idx_eventLogs_eventType";

-- DropIndex
DROP INDEX "idx_eventLogs_sessionId";

-- DropIndex
DROP INDEX "pixel_tokens_created_at_idx";

-- DropIndex
DROP INDEX "pixel_tokens_status_idx";

-- DropIndex
DROP INDEX "pixel_tokens_token_idx";

-- DropIndex
DROP INDEX "pwa_apps_created_at_idx";

-- DropIndex
DROP INDEX "pwa_apps_created_by_user_id_idx";

-- DropIndex
DROP INDEX "pwa_apps_domain_key";

-- DropIndex
DROP INDEX "pwa_apps_status_idx";

-- DropIndex
DROP INDEX "pwa_apps_templateId_idx";

-- DropIndex
DROP INDEX "pwa_sessions_created_at_idx";

-- DropIndex
DROP INDEX "pwa_sessions_fbclid_idx";

-- DropIndex
DROP INDEX "pwa_sessions_id_key";

-- DropIndex
DROP INDEX "pwa_sessions_offer_id_idx";

-- DropIndex
DROP INDEX "pwa_sessions_pixel_id_idx";

-- DropIndex
DROP INDEX "pwa_sessions_pwa_domain_idx";

-- DropIndex
DROP INDEX "pwa_sessions_sub1_idx";

-- DropIndex
DROP INDEX "pwa_sessions_utm_source_idx";

-- DropIndex
DROP INDEX "users_created_at_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- DropIndex
DROP INDEX "users_role_idx";

-- DropIndex
DROP INDEX "users_status_idx";

-- AlterTable
ALTER TABLE "error_logs" DROP COLUMN "context",
DROP COLUMN "method",
DROP COLUMN "path",
ALTER COLUMN "level" SET DEFAULT 'info';

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "country",
DROP COLUMN "revenue",
ADD COLUMN     "browser" TEXT,
ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "country_id" TEXT,
ADD COLUMN     "device_type" "DeviceType",
ADD COLUMN     "domain_id" TEXT,
ADD COLUMN     "fbclid" TEXT,
ADD COLUMN     "flow_id" TEXT,
ADD COLUMN     "install_id" TEXT,
ADD COLUMN     "is_whitepage" BOOLEAN DEFAULT false,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "os" "DeviceOs",
ADD COLUMN     "owner_user_id" TEXT,
ADD COLUMN     "pwa_app_id" TEXT,
ADD COLUMN     "raw_query" TEXT,
ADD COLUMN     "region_id" TEXT,
ADD COLUMN     "team_id" TEXT,
ALTER COLUMN "pixel_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "pixel_tokens" DROP COLUMN "name",
ADD COLUMN     "owner_id" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pwa_apps" DROP COLUMN "created_by_user_id",
DROP COLUMN "description",
DROP COLUMN "domain",
DROP COLUMN "templateId",
ADD COLUMN     "campaign_id" TEXT NOT NULL,
ADD COLUMN     "domain_id" TEXT NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner_user_id" TEXT NOT NULL,
ADD COLUMN     "pixel_token_id" TEXT,
ADD COLUMN     "team_id" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PwaStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "pwa_sessions" DROP COLUMN "sub1",
ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "first_dep_event_log_id" TEXT,
ADD COLUMN     "first_open_event_log_id" TEXT,
ADD COLUMN     "lead_event_log_id" TEXT,
ADD COLUMN     "owner_user_id" TEXT,
ADD COLUMN     "pwa_app_id" TEXT,
ADD COLUMN     "reg_event_log_id" TEXT,
ADD COLUMN     "sub_event_log_id" TEXT,
ADD COLUMN     "team_id" TEXT,
ALTER COLUMN "pwa_domain" DROP NOT NULL,
DROP COLUMN "first_open_fb_status",
ADD COLUMN     "first_open_fb_status" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_hash" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "team_lead_id" TEXT,
    "share_pwa_within_team" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_campaign_memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_campaign_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_team_memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_team_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stat_access" "AccessLevel" NOT NULL DEFAULT 'View',
    "fin_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "log_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "crud_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "sharing_access" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_access_role" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_access_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_access_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_access_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domains" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "pwa_app_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_details" (
    "id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,
    "public_name" TEXT,
    "icon_url" TEXT,
    "logo_url" TEXT,
    "theme_color" TEXT,
    "screenshots" JSONB,
    "privacy_policy" TEXT,
    "terms_of_service" TEXT,
    "tags" TEXT,

    CONSTRAINT "pwa_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_contents" (
    "id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,
    "locale" TEXT,
    "title" TEXT,
    "description" TEXT,
    "comments" JSONB,

    CONSTRAINT "pwa_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_events_config" (
    "id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,
    "event_type" "EventType",
    "destination" TEXT,

    CONSTRAINT "pwa_events_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_versions" (
    "id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,
    "version_number" INTEGER,
    "changed_by" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pwa_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "FlowStatus" NOT NULL DEFAULT 'draft',
    "campaign_id" TEXT NOT NULL,
    "team_id" TEXT,
    "owner_user_id" TEXT NOT NULL,
    "pwa_app_id" TEXT,
    "active_version_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flow_versions" (
    "id" TEXT NOT NULL,
    "flow_id" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "status" "FlowStatus" NOT NULL DEFAULT 'published',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_objects" (
    "id" TEXT NOT NULL,
    "type" "WorkingObjectType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_object_pwa" (
    "working_object_id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,

    CONSTRAINT "working_object_pwa_pkey" PRIMARY KEY ("working_object_id")
);

-- CreateTable
CREATE TABLE "working_object_flow" (
    "working_object_id" TEXT NOT NULL,
    "flow_id" TEXT NOT NULL,

    CONSTRAINT "working_object_flow_pkey" PRIMARY KEY ("working_object_id")
);

-- CreateTable
CREATE TABLE "working_object_pixel_token" (
    "working_object_id" TEXT NOT NULL,
    "pixel_token_id" TEXT NOT NULL,

    CONSTRAINT "working_object_pixel_token_pkey" PRIMARY KEY ("working_object_id")
);

-- CreateTable
CREATE TABLE "working_object_campaign" (
    "working_object_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "working_object_campaign_pkey" PRIMARY KEY ("working_object_id")
);

-- CreateTable
CREATE TABLE "working_object_team" (
    "working_object_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "working_object_user" (
    "working_object_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "relation" "WorkingObjectUserRelation" NOT NULL DEFAULT 'Owner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "shares_role" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_deposits" (
    "id" TEXT NOT NULL,
    "event_log_id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "deposited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "code" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financials" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "spend" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "payouts" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "profit" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "transaction_date" DATE NOT NULL,

    CONSTRAINT "financials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT,
    "type" "AlertType",
    "message" TEXT,
    "severity" "ErrorLevel",
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT,
    "user_id" TEXT,
    "title" TEXT,
    "status" "TaskStatus",
    "priority" TEXT,
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_name_key" ON "campaigns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_campaign_memberships_user_id_campaign_id_key" ON "user_campaign_memberships"("user_id", "campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_team_memberships_user_id_team_id_key" ON "user_team_memberships"("user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "access_profiles_name_key" ON "access_profiles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "global_access_role_role_id_key" ON "global_access_role"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "global_access_user_user_id_key" ON "global_access_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "domains_hostname_key" ON "domains"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_details_pwa_app_id_key" ON "pwa_details"("pwa_app_id");

-- CreateIndex
CREATE INDEX "flows_campaign_id_team_id_idx" ON "flows"("campaign_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "flow_versions_flow_id_version_number_key" ON "flow_versions"("flow_id", "version_number");

-- CreateIndex
CREATE INDEX "working_objects_type_idx" ON "working_objects"("type");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_pwa_pwa_app_id_key" ON "working_object_pwa"("pwa_app_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_flow_flow_id_key" ON "working_object_flow"("flow_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_pixel_token_pixel_token_id_key" ON "working_object_pixel_token"("pixel_token_id");

-- CreateIndex
CREATE INDEX "working_object_campaign_campaign_id_idx" ON "working_object_campaign"("campaign_id");

-- CreateIndex
CREATE INDEX "working_object_team_team_id_idx" ON "working_object_team"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_team_working_object_id_team_id_key" ON "working_object_team"("working_object_id", "team_id");

-- CreateIndex
CREATE INDEX "working_object_user_user_id_idx" ON "working_object_user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_user_working_object_id_user_id_relation_key" ON "working_object_user"("working_object_id", "user_id", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "shares_role_role_id_working_object_id_access_profile_id_key" ON "shares_role"("role_id", "working_object_id", "access_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "shares_user_user_id_working_object_id_access_profile_id_key" ON "shares_user"("user_id", "working_object_id", "access_profile_id");

-- CreateIndex
CREATE INDEX "session_deposits_deposited_at_idx" ON "session_deposits"("deposited_at");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE INDEX "countries_code_idx" ON "countries"("code");

-- CreateIndex
CREATE INDEX "regions_country_id_name_idx" ON "regions"("country_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "regions_country_id_code_key" ON "regions"("country_id", "code");

-- CreateIndex
CREATE INDEX "financials_campaign_id_transaction_date_idx" ON "financials"("campaign_id", "transaction_date");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE INDEX "event_logs_campaign_id_created_at_idx" ON "event_logs"("campaign_id", "created_at");

-- CreateIndex
CREATE INDEX "event_logs_event_type_created_at_idx" ON "event_logs"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "event_logs_country_id_created_at_idx" ON "event_logs"("country_id", "created_at");

-- CreateIndex
CREATE INDEX "event_logs_region_id_created_at_idx" ON "event_logs"("region_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "event_logs_pixel_id_event_id_key" ON "event_logs"("pixel_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "pixel_tokens_token_key" ON "pixel_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_first_open_event_log_id_key" ON "pwa_sessions"("first_open_event_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_lead_event_log_id_key" ON "pwa_sessions"("lead_event_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_reg_event_log_id_key" ON "pwa_sessions"("reg_event_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_sub_event_log_id_key" ON "pwa_sessions"("sub_event_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_first_dep_event_log_id_key" ON "pwa_sessions"("first_dep_event_log_id");

-- CreateIndex
CREATE INDEX "pwa_sessions_pixel_id_created_at_idx" ON "pwa_sessions"("pixel_id", "created_at");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_lead_id_fkey" FOREIGN KEY ("team_lead_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_campaign_memberships" ADD CONSTRAINT "user_campaign_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_campaign_memberships" ADD CONSTRAINT "user_campaign_memberships_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_campaign_memberships" ADD CONSTRAINT "user_campaign_memberships_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_memberships" ADD CONSTRAINT "user_team_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_memberships" ADD CONSTRAINT "user_team_memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team_memberships" ADD CONSTRAINT "user_team_memberships_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_role" ADD CONSTRAINT "global_access_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_role" ADD CONSTRAINT "global_access_role_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_user" ADD CONSTRAINT "global_access_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_user" ADD CONSTRAINT "global_access_user_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pixel_tokens" ADD CONSTRAINT "pixel_tokens_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_pixel_token_id_fkey" FOREIGN KEY ("pixel_token_id") REFERENCES "pixel_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_details" ADD CONSTRAINT "pwa_details_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_contents" ADD CONSTRAINT "pwa_contents_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_events_config" ADD CONSTRAINT "pwa_events_config_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_versions" ADD CONSTRAINT "pwa_versions_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_versions" ADD CONSTRAINT "pwa_versions_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_active_version_id_fkey" FOREIGN KEY ("active_version_id") REFERENCES "flow_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pwa" ADD CONSTRAINT "working_object_pwa_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pwa" ADD CONSTRAINT "working_object_pwa_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_flow" ADD CONSTRAINT "working_object_flow_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_flow" ADD CONSTRAINT "working_object_flow_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pixel_token" ADD CONSTRAINT "working_object_pixel_token_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pixel_token" ADD CONSTRAINT "working_object_pixel_token_pixel_token_id_fkey" FOREIGN KEY ("pixel_token_id") REFERENCES "pixel_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_campaign" ADD CONSTRAINT "working_object_campaign_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_campaign" ADD CONSTRAINT "working_object_campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team" ADD CONSTRAINT "working_object_team_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team" ADD CONSTRAINT "working_object_team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_user" ADD CONSTRAINT "working_object_user_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_user" ADD CONSTRAINT "working_object_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_first_open_event_log_id_fkey" FOREIGN KEY ("first_open_event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_lead_event_log_id_fkey" FOREIGN KEY ("lead_event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_reg_event_log_id_fkey" FOREIGN KEY ("reg_event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_sub_event_log_id_fkey" FOREIGN KEY ("sub_event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_first_dep_event_log_id_fkey" FOREIGN KEY ("first_dep_event_log_id") REFERENCES "event_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_deposits" ADD CONSTRAINT "session_deposits_event_log_id_fkey" FOREIGN KEY ("event_log_id") REFERENCES "event_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financials" ADD CONSTRAINT "financials_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
