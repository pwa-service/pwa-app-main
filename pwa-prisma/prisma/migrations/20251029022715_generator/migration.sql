-- CreateTable
CREATE TABLE "pwa_apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT,
    "templateId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_by_user_id" TEXT NOT NULL,

    CONSTRAINT "pwa_apps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pwa_apps_name_key" ON "pwa_apps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pwa_apps_domain_key" ON "pwa_apps"("domain");

-- AddForeignKey
ALTER TABLE "pwa_apps" ADD CONSTRAINT "pwa_apps_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
