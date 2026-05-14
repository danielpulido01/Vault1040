-- CreateEnum
CREATE TYPE "LLCFormationStatus" AS ENUM ('PENDING', 'PAYMENT_RECEIVED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ManagementType" AS ENUM ('MEMBER_MANAGED', 'MANAGER_MANAGED');

-- CreateTable
CREATE TABLE "llc_formations" (
    "id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "user_id" TEXT,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "llc_name" TEXT NOT NULL,
    "fein" TEXT,
    "effective_date" TIMESTAMP(3),
    "principal_office" JSONB NOT NULL,
    "same_as_principal" BOOLEAN NOT NULL DEFAULT true,
    "mailing_address" JSONB,
    "registered_agent" JSONB NOT NULL,
    "management_type" "ManagementType" NOT NULL DEFAULT 'MEMBER_MANAGED',
    "members_managers" JSONB NOT NULL DEFAULT '[]',
    "state_fee" DECIMAL(10,2) NOT NULL,
    "service_fee" DECIMAL(10,2) NOT NULL,
    "total_fee" DECIMAL(10,2) NOT NULL,
    "stripe_payment_intent_id" TEXT,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "payment_method" TEXT,
    "payment_last4" TEXT,
    "status" "LLCFormationStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "processed_at" TIMESTAMP(3),
    "processed_by" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llc_formations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "llc_formations_reference_number_key" ON "llc_formations"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "llc_formations_stripe_payment_intent_id_key" ON "llc_formations"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "llc_formations_user_id_idx" ON "llc_formations"("user_id");

-- CreateIndex
CREATE INDEX "llc_formations_status_idx" ON "llc_formations"("status");

-- CreateIndex
CREATE INDEX "llc_formations_created_at_idx" ON "llc_formations"("created_at");

-- AddForeignKey
ALTER TABLE "llc_formations" ADD CONSTRAINT "llc_formations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
