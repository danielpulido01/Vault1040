-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "document_number" TEXT,
    "fein" TEXT,
    "user_id" TEXT,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_sunbiz_data" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "report_year" INTEGER NOT NULL,
    "document_number" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "fein" TEXT NOT NULL,
    "principal_office" JSONB NOT NULL,
    "mailing_address" JSONB NOT NULL,
    "registered_agent" JSONB NOT NULL,
    "officers" JSONB DEFAULT '[]',
    "llc_members" JSONB DEFAULT '[]',
    "lp_partners" JSONB DEFAULT '[]',
    "entered_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_sunbiz_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prefill_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "report_year" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "email_sent_at" TIMESTAMP(3),
    "email_id" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "prefill_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_document_number_key" ON "clients"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "clients_user_id_key" ON "clients"("user_id");

-- CreateIndex
CREATE INDEX "clients_contact_email_idx" ON "clients"("contact_email");

-- CreateIndex
CREATE INDEX "clients_company_name_idx" ON "clients"("company_name");

-- CreateIndex
CREATE INDEX "client_sunbiz_data_report_year_idx" ON "client_sunbiz_data"("report_year");

-- CreateIndex
CREATE UNIQUE INDEX "client_sunbiz_data_client_id_report_year_key" ON "client_sunbiz_data"("client_id", "report_year");

-- CreateIndex
CREATE UNIQUE INDEX "prefill_tokens_token_key" ON "prefill_tokens"("token");

-- CreateIndex
CREATE INDEX "prefill_tokens_token_idx" ON "prefill_tokens"("token");

-- CreateIndex
CREATE INDEX "prefill_tokens_client_id_idx" ON "prefill_tokens"("client_id");

-- CreateIndex
CREATE INDEX "prefill_tokens_expires_at_idx" ON "prefill_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_sunbiz_data" ADD CONSTRAINT "client_sunbiz_data_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prefill_tokens" ADD CONSTRAINT "prefill_tokens_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
