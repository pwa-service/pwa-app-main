/*
  Warnings:

  - A unique constraint covering the columns `[name,campaign_id]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "roles_name_key";

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "is_system" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 100;

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_campaign_id_key" ON "roles"("name", "campaign_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
