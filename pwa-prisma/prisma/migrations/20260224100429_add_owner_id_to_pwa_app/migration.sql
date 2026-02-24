-- AlterTable
ALTER TABLE "pwa_apps" ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
