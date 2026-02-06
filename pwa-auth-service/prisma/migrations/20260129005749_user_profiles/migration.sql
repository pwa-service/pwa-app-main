/*
  Warnings:

  - You are about to drop the column `user_id` on the `campaign_users` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `owner_user_id` on the `flows` table. All the data in the column will be lost.
  - You are about to drop the column `owner_user_id` on the `pwa_apps` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `system_users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `team_users` table. All the data in the column will be lost.
  - You are about to drop the `shares_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_profile_id]` on the table `campaign_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_profile_id]` on the table `system_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_profile_id]` on the table `team_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_profile_id` to the `campaign_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_profile_id` to the `system_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_profile_id` to the `team_users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('SYSTEM', 'CAMPAIGN', 'TEAM');

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_users" DROP CONSTRAINT "campaign_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "error_logs" DROP CONSTRAINT "error_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_countryId_fkey";

-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "flow_versions" DROP CONSTRAINT "flow_versions_created_by_fkey";

-- DropForeignKey
ALTER TABLE "flows" DROP CONSTRAINT "flows_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "global_access_user" DROP CONSTRAINT "global_access_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pixel-token-manager" DROP CONSTRAINT "pixel-token-manager_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "pwa_apps" DROP CONSTRAINT "pwa_apps_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pwa_sessions" DROP CONSTRAINT "pwa_sessions_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pwa_versions" DROP CONSTRAINT "pwa_versions_changed_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_campaign_role" DROP CONSTRAINT "shares_campaign_role_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_team_role" DROP CONSTRAINT "shares_team_role_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "system_users" DROP CONSTRAINT "system_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "team_users" DROP CONSTRAINT "team_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_team_lead_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_user" DROP CONSTRAINT "working_object_user_user_id_fkey";

-- DropIndex
DROP INDEX "campaign_users_user_id_key";

-- DropIndex
DROP INDEX "system_users_user_id_key";

-- DropIndex
DROP INDEX "team_users_user_id_key";

-- AlterTable
ALTER TABLE "campaign_users" DROP COLUMN "user_id",
ADD COLUMN     "user_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "owner_id",
ADD COLUMN     "legal_owner_id" TEXT;

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "countryId",
ADD COLUMN     "country_id" TEXT;

-- AlterTable
ALTER TABLE "flows" DROP COLUMN "owner_user_id",
ADD COLUMN     "created_by_campaign_user_id" TEXT,
ADD COLUMN     "created_by_team_user_id" TEXT;

-- AlterTable
ALTER TABLE "pwa_apps" DROP COLUMN "owner_user_id",
ADD COLUMN     "created_by_campaign_user_id" TEXT,
ADD COLUMN     "created_by_team_user_id" TEXT;

-- AlterTable
ALTER TABLE "system_users" DROP COLUMN "user_id",
ADD COLUMN     "user_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team_users" DROP COLUMN "user_id",
ADD COLUMN     "user_profile_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "shares_user";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT,
    "email" TEXT,
    "status" "Status" NOT NULL DEFAULT 'inactive',
    "scope" "ScopeType" NOT NULL,
    "tgId" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares_user_profile" (
    "id" TEXT NOT NULL,
    "user_profile_id" TEXT NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_username_key" ON "user_profiles"("username");

-- CreateIndex
CREATE UNIQUE INDEX "shares_user_profile_user_profile_id_working_object_id_acces_key" ON "shares_user_profile"("user_profile_id", "working_object_id", "access_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_users_user_profile_id_key" ON "campaign_users"("user_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_users_user_profile_id_key" ON "system_users"("user_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_users_user_profile_id_key" ON "team_users"("user_profile_id");

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_users" ADD CONSTRAINT "campaign_users_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_legal_owner_id_fkey" FOREIGN KEY ("legal_owner_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_team_lead_id_fkey" FOREIGN KEY ("team_lead_id") REFERENCES "team_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "campaign_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pixel-token-manager" ADD CONSTRAINT "pixel-token-manager_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_created_by_campaign_user_id_fkey" FOREIGN KEY ("created_by_campaign_user_id") REFERENCES "campaign_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_created_by_team_user_id_fkey" FOREIGN KEY ("created_by_team_user_id") REFERENCES "team_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_versions" ADD CONSTRAINT "pwa_versions_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_created_by_campaign_user_id_fkey" FOREIGN KEY ("created_by_campaign_user_id") REFERENCES "campaign_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flows" ADD CONSTRAINT "flows_created_by_team_user_id_fkey" FOREIGN KEY ("created_by_team_user_id") REFERENCES "team_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_user" ADD CONSTRAINT "working_object_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "team_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_campaign_role" ADD CONSTRAINT "shares_campaign_role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "campaign_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_team_role" ADD CONSTRAINT "shares_team_role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "team_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user_profile" ADD CONSTRAINT "shares_user_profile_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user_profile" ADD CONSTRAINT "shares_user_profile_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user_profile" ADD CONSTRAINT "shares_user_profile_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user_profile" ADD CONSTRAINT "shares_user_profile_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_user" ADD CONSTRAINT "global_access_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
