/*
  Warnings:

  - You are about to drop the `campaign_role_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `campaign_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shares_campaign_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shares_team_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_role_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `system_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_role_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `working_object_user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[campaign_id]` on the table `working_object_campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id]` on the table `working_object_team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WorkingObjectType" ADD VALUE 'TEAM';
ALTER TYPE "WorkingObjectType" ADD VALUE 'CAMPAIGN';

-- DropForeignKey
ALTER TABLE "campaign_role_access" DROP CONSTRAINT "campaign_role_access_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_role_access" DROP CONSTRAINT "campaign_role_access_role_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_roles" DROP CONSTRAINT "campaign_roles_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "campaign_users" DROP CONSTRAINT "campaign_users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_campaign_role" DROP CONSTRAINT "shares_campaign_role_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_campaign_role" DROP CONSTRAINT "shares_campaign_role_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_campaign_role" DROP CONSTRAINT "shares_campaign_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_campaign_role" DROP CONSTRAINT "shares_campaign_role_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_team_role" DROP CONSTRAINT "shares_team_role_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_team_role" DROP CONSTRAINT "shares_team_role_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_team_role" DROP CONSTRAINT "shares_team_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_team_role" DROP CONSTRAINT "shares_team_role_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "system_role_access" DROP CONSTRAINT "system_role_access_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "system_role_access" DROP CONSTRAINT "system_role_access_role_id_fkey";

-- DropForeignKey
ALTER TABLE "system_users" DROP CONSTRAINT "system_users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "team_role_access" DROP CONSTRAINT "team_role_access_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "team_role_access" DROP CONSTRAINT "team_role_access_role_id_fkey";

-- DropForeignKey
ALTER TABLE "team_roles" DROP CONSTRAINT "team_roles_team_id_fkey";

-- DropForeignKey
ALTER TABLE "team_users" DROP CONSTRAINT "team_users_role_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_campaign" DROP CONSTRAINT "working_object_campaign_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_campaign" DROP CONSTRAINT "working_object_campaign_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_flow" DROP CONSTRAINT "working_object_flow_flow_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_flow" DROP CONSTRAINT "working_object_flow_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_pixel_token" DROP CONSTRAINT "working_object_pixel_token_pixel_token_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_pixel_token" DROP CONSTRAINT "working_object_pixel_token_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_pwa" DROP CONSTRAINT "working_object_pwa_pwa_app_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_pwa" DROP CONSTRAINT "working_object_pwa_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_team" DROP CONSTRAINT "working_object_team_team_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_team" DROP CONSTRAINT "working_object_team_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_user" DROP CONSTRAINT "working_object_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_user" DROP CONSTRAINT "working_object_user_working_object_id_fkey";

-- DropIndex
DROP INDEX "working_object_campaign_campaign_id_idx";

-- DropIndex
DROP INDEX "working_object_team_team_id_idx";

-- DropIndex
DROP INDEX "working_object_team_working_object_id_team_id_key";

-- AlterTable
ALTER TABLE "working_object_team" ADD CONSTRAINT "working_object_team_pkey" PRIMARY KEY ("working_object_id");

-- DropTable
DROP TABLE "campaign_role_access";

-- DropTable
DROP TABLE "campaign_roles";

-- DropTable
DROP TABLE "shares_campaign_role";

-- DropTable
DROP TABLE "shares_team_role";

-- DropTable
DROP TABLE "system_role_access";

-- DropTable
DROP TABLE "system_roles";

-- DropTable
DROP TABLE "team_role_access";

-- DropTable
DROP TABLE "team_roles";

-- DropTable
DROP TABLE "working_object_user";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "scope" "ScopeType" NOT NULL,
    "campaign_id" TEXT,
    "team_id" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_access" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_object_team_user" (
    "working_object_id" TEXT NOT NULL,
    "team_user_id" TEXT NOT NULL,
    "relation" "WorkingObjectUserRelation" NOT NULL DEFAULT 'Owner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "shares_role" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by_campaign_user_id" TEXT,
    "created_by_team_user_id" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_campaign_id_team_id_key" ON "roles"("name", "campaign_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_access_role_id_key" ON "role_access"("role_id");

-- CreateIndex
CREATE INDEX "working_object_team_user_team_user_id_idx" ON "working_object_team_user"("team_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_team_user_working_object_id_team_user_id_rel_key" ON "working_object_team_user"("working_object_id", "team_user_id", "relation");

-- CreateIndex
CREATE UNIQUE INDEX "shares_role_role_id_working_object_id_access_profile_id_key" ON "shares_role"("role_id", "working_object_id", "access_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_campaign_campaign_id_key" ON "working_object_campaign"("campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "working_object_team_team_id_key" ON "working_object_team"("team_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_access" ADD CONSTRAINT "role_access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_access" ADD CONSTRAINT "role_access_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_users" ADD CONSTRAINT "campaign_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pwa" ADD CONSTRAINT "working_object_pwa_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pwa" ADD CONSTRAINT "working_object_pwa_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_flow" ADD CONSTRAINT "working_object_flow_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_flow" ADD CONSTRAINT "working_object_flow_flow_id_fkey" FOREIGN KEY ("flow_id") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pixel_token" ADD CONSTRAINT "working_object_pixel_token_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pixel_token" ADD CONSTRAINT "working_object_pixel_token_pixel_token_id_fkey" FOREIGN KEY ("pixel_token_id") REFERENCES "pixel-token-manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_campaign" ADD CONSTRAINT "working_object_campaign_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_campaign" ADD CONSTRAINT "working_object_campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team" ADD CONSTRAINT "working_object_team_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team" ADD CONSTRAINT "working_object_team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team_user" ADD CONSTRAINT "working_object_team_user_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_team_user" ADD CONSTRAINT "working_object_team_user_team_user_id_fkey" FOREIGN KEY ("team_user_id") REFERENCES "team_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_created_by_campaign_user_id_fkey" FOREIGN KEY ("created_by_campaign_user_id") REFERENCES "campaign_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_role" ADD CONSTRAINT "shares_role_created_by_team_user_id_fkey" FOREIGN KEY ("created_by_team_user_id") REFERENCES "team_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
