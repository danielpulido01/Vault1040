-- CreateEnum
CREATE TYPE "FilingStatus" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "annual_report_filings" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "user_id" TEXT,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
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
    "state_fee" DECIMAL(10,2) NOT NULL,
    "service_fee" DECIMAL(10,2) NOT NULL,
    "late_fee" DECIMAL(10,2) NOT NULL,
    "total_fee" DECIMAL(10,2) NOT NULL,
    "status" "FilingStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "processed_at" TIMESTAMP(3),
    "processed_by" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_report_filings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_report_filings_reference_number_key" ON "annual_report_filings"("reference_number");

-- CreateIndex
CREATE INDEX "annual_report_filings_user_id_idx" ON "annual_report_filings"("user_id");

-- CreateIndex
CREATE INDEX "annual_report_filings_status_idx" ON "annual_report_filings"("status");

-- CreateIndex
CREATE INDEX "annual_report_filings_document_number_idx" ON "annual_report_filings"("document_number");

-- CreateIndex
CREATE INDEX "annual_report_filings_created_at_idx" ON "annual_report_filings"("created_at");

-- AddForeignKey
ALTER TABLE "annual_report_filings" ADD CONSTRAINT "annual_report_filings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
