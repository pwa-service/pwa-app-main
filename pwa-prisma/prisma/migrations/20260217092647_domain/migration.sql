-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_pwa_app_id_fkey";

-- AlterTable
ALTER TABLE "domains" ALTER COLUMN "pwa_app_id" DROP NOT NULL,
ALTER COLUMN "owner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_pwa_app_id_fkey" FOREIGN KEY ("pwa_app_id") REFERENCES "pwa_apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "campaign_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
