/*
  Warnings:

  - You are about to drop the column `comments` on the `pwa_contents` table. All the data in the column will be lost.
  - You are about to drop the column `privacy_policy` on the `pwa_details` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `pwa_details` table. All the data in the column will be lost.
  - You are about to drop the column `terms_of_service` on the `pwa_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pwa_apps" ADD COLUMN     "main_locale" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "pwa_contents" DROP COLUMN "comments";

-- AlterTable
ALTER TABLE "pwa_details" DROP COLUMN "privacy_policy",
DROP COLUMN "tags",
DROP COLUMN "terms_of_service";

-- CreateTable
CREATE TABLE "pwa_tags" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,

    CONSTRAINT "pwa_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_terms" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,

    CONSTRAINT "pwa_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_comments" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,

    CONSTRAINT "pwa_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pwa_events_profile" (
    "id" TEXT NOT NULL,
    "pwa_app_id" TEXT NOT NULL,
    "view_content" BOOLEAN NOT NULL DEFAULT false,
    "first_open" BOOLEAN NOT NULL DEFAULT false,
    "reg" BOOLEAN NOT NULL DEFAULT false,
    "sub" BOOLEAN NOT NULL DEFAULT false,
    "dep" BOOLEAN NOT NULL DEFAULT false,
    "redep" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pwa_events_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pwa_events_profile_pwa_app_id_key" ON "pwa_events_profile"("pwa_app_id");

-- AddForeignKey
ALTER TABLE "pwa_tags" ADD CONSTRAINT "pwa_tags_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_terms" ADD CONSTRAINT "pwa_terms_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_comments" ADD CONSTRAINT "pwa_comments_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pwa_events_profile" ADD CONSTRAINT "pwa_events_profile_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
