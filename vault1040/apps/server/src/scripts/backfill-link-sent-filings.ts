import { PrismaClient, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const STATE_FEES: Record<string, number> = {
  'profit-corp': 150.0,
  'non-profit-corp': 61.25,
  'llc': 138.75,
  'lp': 500.0,
  'lllp': 500.0,
};
const SERVICE_FEE = 50.0;
const LATE_FEE = 400.0;

function isAfterMay1(): boolean {
  const now = new Date();
  return now > new Date(now.getFullYear(), 4, 1);
}

function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AR-${timestamp}-${random}`;
}

async function getUniqueReferenceNumber(): Promise<string> {
  let ref = generateReferenceNumber();
  for (let i = 0; i < 5; i++) {
    const existing = await prisma.annualReportFiling.findUnique({ where: { referenceNumber: ref } });
    if (!existing) return ref;
    ref = generateReferenceNumber();
    await new Promise(r => setTimeout(r, 10));
  }
  return ref;
}

async function main() {
  // Find all tokens that have no associated filing and were never submitted
  const orphanTokens = await prisma.prefillToken.findMany({
    where: {
      submittedAt: null,
      filing: null,
    },
    include: {
      client: true,
    },
  });

  console.log(`Found ${orphanTokens.length} token(s) without a filing.`);

  let created = 0;
  let skipped = 0;

  for (const token of orphanTokens) {
    const sunbizData = await prisma.clientSunbizData.findUnique({
      where: {
        clientId_reportYear: {
          clientId: token.clientId,
          reportYear: token.reportYear,
        },
      },
    });

    if (!sunbizData) {
      console.log(`  SKIP token ${token.id} — no Sunbiz data for year ${token.reportYear}`);
      skipped++;
      continue;
    }

    const stateFee = STATE_FEES[sunbizData.entityType] || 0;
    const lateFee = isAfterMay1() && sunbizData.entityType !== 'non-profit-corp' ? LATE_FEE : 0;
    const totalFee = stateFee + SERVICE_FEE + lateFee;
    const referenceNumber = await getUniqueReferenceNumber();

    await prisma.annualReportFiling.create({
      data: {
        referenceNumber,
        contactEmail: token.client.contactEmail,
        contactPhone: token.client.contactPhone ?? null,
        documentNumber: sunbizData.documentNumber,
        entityType: sunbizData.entityType,
        businessName: sunbizData.businessName,
        fein: sunbizData.fein,
        principalOffice: sunbizData.principalOffice as Prisma.InputJsonValue,
        mailingAddress: sunbizData.mailingAddress as Prisma.InputJsonValue,
        registeredAgent: sunbizData.registeredAgent as Prisma.InputJsonValue,
        officers: (sunbizData.officers ?? []) as Prisma.InputJsonValue,
        llcMembers: (sunbizData.llcMembers ?? []) as Prisma.InputJsonValue,
        lpPartners: (sunbizData.lpPartners ?? []) as Prisma.InputJsonValue,
        stateFee: new Decimal(stateFee),
        serviceFee: new Decimal(SERVICE_FEE),
        lateFee: new Decimal(lateFee),
        totalFee: new Decimal(totalFee),
        status: 'LINK_SENT',
        paymentStatus: 'PENDING',
        prefillTokenId: token.id,
      },
    });

    console.log(`  CREATED filing ${referenceNumber} for ${sunbizData.businessName} (token ${token.id})`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
