/*
  Warnings:

  - A unique constraint covering the columns `[stripe_payment_intent_id]` on the table `annual_report_filings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "annual_report_filings" ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "payment_last4" TEXT,
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "stripe_payment_intent_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "annual_report_filings_stripe_payment_intent_id_key" ON "annual_report_filings"("stripe_payment_intent_id");
