/*
  Warnings:

  - You are about to drop the column `country_id` on the `event_logs` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the `pixel_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_country_id_fkey";

-- DropForeignKey
ALTER TABLE "event_logs" DROP CONSTRAINT "event_logs_pixel_id_fkey";

-- DropForeignKey
ALTER TABLE "pixel_tokens" DROP CONSTRAINT "pixel_tokens_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "pwa_apps" DROP CONSTRAINT "pwa_apps_pixel_token_id_fkey";

-- DropForeignKey
ALTER TABLE "pwa_sessions" DROP CONSTRAINT "pwa_sessions_pixel_id_fkey";

-- DropForeignKey
ALTER TABLE "working_object_pixel_token" DROP CONSTRAINT "working_object_pixel_token_pixel_token_id_fkey";

-- DropIndex
DROP INDEX "event_logs_country_id_created_at_idx";

-- DropIndex
DROP INDEX "regions_country_id_code_key";

-- AlterTable
ALTER TABLE "event_logs" DROP COLUMN "country_id",
ADD COLUMN     "countryId" TEXT;

-- AlterTable
ALTER TABLE "regions" DROP COLUMN "code";

-- DropTable
DROP TABLE "pixel_tokens";

-- CreateTable
CREATE TABLE "pixel-token-manager" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "description" TEXT,
    "owner_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pixel-token-manager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pixel-token-manager_token_key" ON "pixel-token-manager"("token");

-- AddForeignKey
ALTER TABLE "pixel-token-manager" ADD CONSTRAINT "pixel-token-manager_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_pixel_token_id_fkey" FOREIGN KEY ("pixel_token_id") REFERENCES "pixel-token-manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_object_pixel_token" ADD CONSTRAINT "working_object_pixel_token_pixel_token_id_fkey" FOREIGN KEY ("pixel_token_id") REFERENCES "pixel-token-manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel-token-manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel-token-manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_logs" ADD CONSTRAINT "event_logs_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
