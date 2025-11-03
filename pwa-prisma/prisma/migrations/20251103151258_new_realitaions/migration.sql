/*
  Warnings:

  - You are about to drop the column `pixel_id` on the `event_logs` table. All the data in the column will be lost.
  - Added the required column `token` to the `pixel_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."idx_eventLogs_pixelId";

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "pixel_id";

-- AlterTable
ALTER TABLE "pixel_tokens" ADD COLUMN     "token" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "pwa_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
