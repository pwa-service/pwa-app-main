/*
  Warnings:

  - You are about to drop the column `user_id` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `pixel_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `pwa_sessions` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `event_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."pixel_tokens" DROP CONSTRAINT "pixel_tokens_user_id_fkey";

-- DropIndex
DROP INDEX "public"."idx_eventLogs_userId";

-- DropIndex
DROP INDEX "public"."idx_pixelTokens_userId";

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "user_id",
ADD COLUMN     "session_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pixel_tokens" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "pwa_sessions" DROP COLUMN "user_id";

-- CreateIndex
CREATE INDEX "idx_eventLogs_sessionId" ON "event_logs"("session_id");
