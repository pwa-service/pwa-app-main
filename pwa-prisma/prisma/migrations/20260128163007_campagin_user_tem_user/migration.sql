/*
  Warnings:

  - You are about to drop the column `campaign_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `campaign_role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `system_role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `team_role_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_campaign_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_system_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_team_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_team_role_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "campaign_id",
DROP COLUMN "campaign_role_id",
DROP COLUMN "system_role_id",
DROP COLUMN "team_id",
DROP COLUMN "team_role_id";

-- CreateTable
CREATE TABLE "system_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_users_user_id_key" ON "system_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_users_user_id_key" ON "campaign_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_users_user_id_key" ON "team_users"("user_id");

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_users" ADD CONSTRAINT "system_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_users" ADD CONSTRAINT "campaign_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_users" ADD CONSTRAINT "campaign_users_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_users" ADD CONSTRAINT "campaign_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "campaign_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "team_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
