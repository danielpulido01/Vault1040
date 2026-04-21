-- AlterEnum
-- ALTER TYPE ADD VALUE cannot run inside a transaction in PostgreSQL
-- Prisma will skip the transaction for this migration
ALTER TYPE "FilingStatus" ADD VALUE 'LINK_SENT' BEFORE 'PENDING';

-- AlterTable: add prefill_token_id
ALTER TABLE "annual_report_filings" ADD COLUMN IF NOT EXISTS "prefill_token_id" TEXT;

-- CreateIndex: unique constraint on prefill_token_id
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'annual_report_filings_prefill_token_id_key'
  ) THEN
    ALTER TABLE "annual_report_filings" ADD CONSTRAINT "annual_report_filings_prefill_token_id_key" UNIQUE ("prefill_token_id");
  END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'annual_report_filings_prefill_token_id_fkey'
  ) THEN
    ALTER TABLE "annual_report_filings" ADD CONSTRAINT "annual_report_filings_prefill_token_id_fkey" FOREIGN KEY ("prefill_token_id") REFERENCES "prefill_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
