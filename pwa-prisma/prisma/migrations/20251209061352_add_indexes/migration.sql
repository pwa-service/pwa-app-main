-- CreateIndex
CREATE INDEX "event_logs_pixel_id_idx" ON "event_logs"("pixel_id");

-- CreateIndex
CREATE INDEX "event_logs_event_id_idx" ON "event_logs"("event_id");

-- CreateIndex
CREATE INDEX "event_logs_status_idx" ON "event_logs"("status");

-- CreateIndex
CREATE INDEX "event_logs_country_idx" ON "event_logs"("country");

-- CreateIndex
CREATE INDEX "pixel_tokens_token_idx" ON "pixel_tokens"("token");

-- CreateIndex
CREATE INDEX "pixel_tokens_status_idx" ON "pixel_tokens"("status");

-- CreateIndex
CREATE INDEX "pixel_tokens_created_at_idx" ON "pixel_tokens"("created_at");

-- CreateIndex
CREATE INDEX "pwa_apps_created_by_user_id_idx" ON "pwa_apps"("created_by_user_id");

-- CreateIndex
CREATE INDEX "pwa_apps_status_idx" ON "pwa_apps"("status");

-- CreateIndex
CREATE INDEX "pwa_apps_templateId_idx" ON "pwa_apps"("templateId");

-- CreateIndex
CREATE INDEX "pwa_apps_created_at_idx" ON "pwa_apps"("created_at");

-- CreateIndex
CREATE INDEX "pwa_sessions_pixel_id_idx" ON "pwa_sessions"("pixel_id");

-- CreateIndex
CREATE INDEX "pwa_sessions_pwa_domain_idx" ON "pwa_sessions"("pwa_domain");

-- CreateIndex
CREATE INDEX "pwa_sessions_fbclid_idx" ON "pwa_sessions"("fbclid");

-- CreateIndex
CREATE INDEX "pwa_sessions_offer_id_idx" ON "pwa_sessions"("offer_id");

-- CreateIndex
CREATE INDEX "pwa_sessions_utm_source_idx" ON "pwa_sessions"("utm_source");

-- CreateIndex
CREATE INDEX "pwa_sessions_sub1_idx" ON "pwa_sessions"("sub1");

-- CreateIndex
CREATE INDEX "pwa_sessions_created_at_idx" ON "pwa_sessions"("created_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");
