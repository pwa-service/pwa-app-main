/*
  Warnings:

  - A unique constraint covering the columns `[view_content_log_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pwa_sessions" ADD COLUMN     "view_content_log_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_view_content_log_id_key" ON "pwa_sessions"("view_content_log_id");
