/*
  Warnings:

  - You are about to drop the column `crud_access` on the `access_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `fin_access` on the `access_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `log_access` on the `access_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `sharing_access` on the `access_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `stat_access` on the `access_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "access_profiles" DROP COLUMN "crud_access",
DROP COLUMN "fin_access",
DROP COLUMN "log_access",
DROP COLUMN "sharing_access",
DROP COLUMN "stat_access",
ADD COLUMN     "crud_rules_id" TEXT,
ADD COLUMN     "global_rules_id" TEXT;

-- CreateTable
CREATE TABLE "global_access_rules" (
    "id" TEXT NOT NULL,
    "stat_access" "AccessLevel" NOT NULL DEFAULT 'View',
    "fin_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "log_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "users_access" "AccessLevel" NOT NULL DEFAULT 'None',
    "sharing_access" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_access_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crud_access_rules" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT true,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crud_access_rules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "access_profiles" ADD CONSTRAINT "access_profiles_global_rules_id_fkey" FOREIGN KEY ("global_rules_id") REFERENCES "global_access_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_profiles" ADD CONSTRAINT "access_profiles_crud_rules_id_fkey" FOREIGN KEY ("crud_rules_id") REFERENCES "crud_access_rules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
