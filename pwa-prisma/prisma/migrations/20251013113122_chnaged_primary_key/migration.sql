/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `pwa_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."pwa_sessions_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "pwa_sessions_id_key" ON "pwa_sessions"("id");
