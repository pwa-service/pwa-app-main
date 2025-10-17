/*
  Warnings:

  - You are about to drop the column `access_token` on the `pixel_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_logs" ADD COLUMN     "user_agent" TEXT;

-- AlterTable
ALTER TABLE "pixel_tokens" DROP COLUMN "access_token";
