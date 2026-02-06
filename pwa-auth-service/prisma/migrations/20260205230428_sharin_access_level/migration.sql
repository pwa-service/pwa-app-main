/*
  Warnings:

  - The `sharing_access` column on the `global_access_rules` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "global_access_rules" DROP COLUMN "sharing_access",
ADD COLUMN     "sharing_access" "AccessLevel" NOT NULL DEFAULT 'View';
