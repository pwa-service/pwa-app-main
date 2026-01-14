/*
  Warnings:

  - You are about to drop the column `fbclid` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `final_url` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `first_open_at` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `first_open_event_id` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `first_open_fb_status` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `landing_url` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `offer_id` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `pwa_domain` on the `pwa_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `utm_source` on the `pwa_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pwa_sessions" DROP COLUMN "fbclid",
DROP COLUMN "final_url",
DROP COLUMN "first_open_at",
DROP COLUMN "first_open_event_id",
DROP COLUMN "first_open_fb_status",
DROP COLUMN "landing_url",
DROP COLUMN "offer_id",
DROP COLUMN "pwa_domain",
DROP COLUMN "utm_source";
