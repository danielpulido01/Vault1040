-- AlterEnum
ALTER TYPE "FilingStatus" ADD VALUE 'LINK_SENT' BEFORE 'PENDING';

-- AlterTable: add prefill_token_id
ALTER TABLE "annual_report_filings" ADD COLUMN "prefill_token_id" TEXT;

-- CreateIndex: unique constraint on prefill_token_id
ALTER TABLE "annual_report_filings" ADD CONSTRAINT "annual_report_filings_prefill_token_id_key" UNIQUE ("prefill_token_id");

-- AddForeignKey
ALTER TABLE "annual_report_filings" ADD CONSTRAINT "annual_report_filings_prefill_token_id_fkey" FOREIGN KEY ("prefill_token_id") REFERENCES "prefill_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
