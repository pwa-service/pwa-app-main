-- DropIndex
DROP INDEX "pwa_apps_name_key";

-- AlterTable
ALTER TABLE "pixel-token-manager" ADD COLUMN     "campaign_id" TEXT,
ADD COLUMN     "team_id" TEXT;

-- AlterTable
ALTER TABLE "pwa_apps" ADD COLUMN     "author" TEXT,
ADD COLUMN     "download_size" TEXT,
ADD COLUMN     "install_count" TEXT,
ADD COLUMN     "rating" TEXT,
ADD COLUMN     "reviews" TEXT;

-- AddForeignKey
ALTER TABLE "pixel-token-manager" ADD CONSTRAINT "pixel-token-manager_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pixel-token-manager" ADD CONSTRAINT "pixel-token-manager_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
