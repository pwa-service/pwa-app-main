/*
  Warnings:

  - The primary key for the `pixel_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "pwa_sessions" DROP CONSTRAINT "pwa_sessions_pixel_id_fkey";

-- AlterTable
ALTER TABLE "pixel_tokens" DROP CONSTRAINT "pixel_tokens_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pixel_tokens_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pixel_tokens_id_seq";

-- AlterTable
ALTER TABLE "pwa_sessions" ALTER COLUMN "pixel_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "pwa_sessions" ADD CONSTRAINT "pwa_sessions_pixel_id_fkey" FOREIGN KEY ("pixel_id") REFERENCES "pixel_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
