-- DropForeignKey
ALTER TABLE "domains" DROP CONSTRAINT "domains_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
