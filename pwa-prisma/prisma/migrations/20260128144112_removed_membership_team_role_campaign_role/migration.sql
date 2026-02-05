/*
  Warnings:

  - You are about to drop the `global_access_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shares_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_campaign_memberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_team_memberships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "global_access_role" DROP CONSTRAINT "global_access_role_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "global_access_role" DROP CONSTRAINT "global_access_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "global_access_user" DROP CONSTRAINT "global_access_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_role" DROP CONSTRAINT "shares_role_access_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_role" DROP CONSTRAINT "shares_role_created_by_fkey";

-- DropForeignKey
ALTER TABLE "shares_role" DROP CONSTRAINT "shares_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_role" DROP CONSTRAINT "shares_role_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shares_user" DROP CONSTRAINT "shares_user_working_object_id_fkey";

-- DropForeignKey
ALTER TABLE "user_campaign_memberships" DROP CONSTRAINT "user_campaign_memberships_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "user_campaign_memberships" DROP CONSTRAINT "user_campaign_memberships_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_campaign_memberships" DROP CONSTRAINT "user_campaign_memberships_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team_memberships" DROP CONSTRAINT "user_team_memberships_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team_memberships" DROP CONSTRAINT "user_team_memberships_team_id_fkey";

-- DropForeignKey
ALTER TABLE "user_team_memberships" DROP CONSTRAINT "user_team_memberships_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "campaign_role_id" INTEGER,
ADD COLUMN     "system_role_id" INTEGER,
ADD COLUMN     "team_id" TEXT,
ADD COLUMN     "team_role_id" INTEGER;

-- DropTable
DROP TABLE "global_access_role";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "shares_role";

-- DropTable
DROP TABLE "user_campaign_memberships";

-- DropTable
DROP TABLE "user_team_memberships";

-- CreateTable
CREATE TABLE "system_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,

    CONSTRAINT "system_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "campaign_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "team_id" TEXT NOT NULL,

    CONSTRAINT "team_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_access" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_role_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_role_access" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_role_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_role_access" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_role_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares_campaign_role" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_campaign_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shares_team_role" (
    "id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "working_object_id" TEXT NOT NULL,
    "access_profile_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_team_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_roles_name_key" ON "system_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_roles_name_campaign_id_key" ON "campaign_roles"("name", "campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_roles_name_team_id_key" ON "team_roles"("name", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_access_role_id_key" ON "system_role_access"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_access_access_profile_id_key" ON "system_role_access"("access_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_role_access_role_id_key" ON "campaign_role_access"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_role_access_role_id_key" ON "team_role_access"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "shares_campaign_role_role_id_working_object_id_access_profi_key" ON "shares_campaign_role"("role_id", "working_object_id", "access_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "shares_team_role_role_id_working_object_id_access_profile_i_key" ON "shares_team_role"("role_id", "working_object_id", "access_profile_id");

-- AddForeignKey
ALTER TABLE "campaign_roles" ADD CONSTRAINT "campaign_roles_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_roles" ADD CONSTRAINT "team_roles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_system_role_id_fkey" FOREIGN KEY ("system_role_id") REFERENCES "system_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_campaign_role_id_fkey" FOREIGN KEY ("campaign_role_id") REFERENCES "campaign_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_role_id_fkey" FOREIGN KEY ("team_role_id") REFERENCES "team_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_access" ADD CONSTRAINT "system_role_access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_access" ADD CONSTRAINT "system_role_access_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_role_access" ADD CONSTRAINT "campaign_role_access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "campaign_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_role_access" ADD CONSTRAINT "campaign_role_access_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role_access" ADD CONSTRAINT "team_role_access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "team_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role_access" ADD CONSTRAINT "team_role_access_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_access_user" ADD CONSTRAINT "global_access_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_campaign_role" ADD CONSTRAINT "shares_campaign_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "campaign_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_campaign_role" ADD CONSTRAINT "shares_campaign_role_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_campaign_role" ADD CONSTRAINT "shares_campaign_role_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_campaign_role" ADD CONSTRAINT "shares_campaign_role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_team_role" ADD CONSTRAINT "shares_team_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "team_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_team_role" ADD CONSTRAINT "shares_team_role_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_team_role" ADD CONSTRAINT "shares_team_role_access_profile_id_fkey" FOREIGN KEY ("access_profile_id") REFERENCES "access_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_team_role" ADD CONSTRAINT "shares_team_role_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares_user" ADD CONSTRAINT "shares_user_working_object_id_fkey" FOREIGN KEY ("working_object_id") REFERENCES "working_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
