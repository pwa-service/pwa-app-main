/*
  Warnings:

  - The values [viewcontent,pageview,lead,completeregistration,purchase,subscribe] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `event_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pixel_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pwa_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `pwa_sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('ViewContent', 'PageView', 'Lead', 'CompleteRegistration', 'Purchase', 'Subscribe');
ALTER TABLE "event_logs" ALTER COLUMN "event_type" TYPE "EventType_new" USING ("event_type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."pixel_tokens" DROP CONSTRAINT "pixel_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "event_logs_id_seq";

-- AlterTable
ALTER TABLE "pixel_tokens" DROP CONSTRAINT "pixel_tokens_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pixel_tokens_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pixel_tokens_id_seq";

-- AlterTable
ALTER TABLE "pwa_sessions" DROP CONSTRAINT "pwa_sessions_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "pwa_sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_user_id_key" ON "pwa_sessions"("user_id");

-- AddForeignKey
ALTER TABLE "pixel_tokens" ADD CONSTRAINT "pixel_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
