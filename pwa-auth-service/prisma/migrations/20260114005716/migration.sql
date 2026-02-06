/*
  Warnings:

  - You are about to drop the column `first_open_event_log_id` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "pwa_sessions" DROP CONSTRAINT "pwa_sessions_first_open_event_log_id_fkey";

-- DropIndex
DROP INDEX "pwa_sessions_first_open_event_log_id_key";

-- AlterTable
ALTER TABLE "pwa_sessions" DROP COLUMN "first_open_event_log_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'inactive';
