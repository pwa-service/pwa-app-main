/*
  Warnings:

  - The primary key for the `pixel_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pixel_id` on the `pixel_tokens` table. All the data in the column will be lost.
  - The `id` column on the `pixel_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `pixel_id` on the `pwa_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."pwa_sessions" DROP CONSTRAINT "pwa_sessions_pixel_id_fkey";

-- DropIndex
DROP INDEX "public"."pixel_tokens_pixel_id_key";

-- AlterTable
ALTER TABLE "pixel_tokens" DROP CONSTRAINT "pixel_tokens_pkey",
DROP COLUMN "pixel_id",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "pixel_tokens_pkey" PRIMARY KEY ("id");

TRUNCATE TABLE "public"."pwa_sessions" CASCADE;
-- AlterTable
ALTER TABLE "pwa_sessions" DROP COLUMN "pixel_id",
ADD COLUMN     "pixel_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
