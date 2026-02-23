/*
  Warnings:

  - You are about to drop the column `download_size` on the `pwa_apps` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `pwa_apps` table. All the data in the column will be lost.
  - The `install_count` column on the `pwa_apps` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "pwa_apps" DROP COLUMN "download_size",
DROP COLUMN "reviews",
ADD COLUMN     "ads_text" TEXT,
ADD COLUMN     "age_limit" INTEGER,
ADD COLUMN     "age_limit_label" TEXT,
ADD COLUMN     "app_size" DOUBLE PRECISION,
ADD COLUMN     "app_size_label" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "category_subtitle" TEXT,
ADD COLUMN     "gallery_urls" TEXT[],
ADD COLUMN     "icon_url" TEXT,
ADD COLUMN     "install_count_label" TEXT,
ADD COLUMN     "reviews_count" INTEGER,
ADD COLUMN     "reviews_count_label" TEXT,
DROP COLUMN "install_count",
ADD COLUMN     "install_count" INTEGER;
