-- AlterTable
ALTER TABLE "annual_report_filings" ADD COLUMN     "external_payment_method" TEXT,
ADD COLUMN     "payment_source" TEXT DEFAULT 'stripe';

-- AlterTable
ALTER TABLE "prefill_tokens" ADD COLUMN     "external_payment_method" TEXT,
ADD COLUMN     "external_payment_notes" TEXT,
ADD COLUMN     "payment_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "payment_confirmed_by" TEXT;
