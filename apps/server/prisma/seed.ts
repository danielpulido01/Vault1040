import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create services
  const services = [
    {
      name: 'Tax Return Preparation',
      slug: 'tax-preparation',
      description: 'Focus on running your business while we maximize your profits! We will carefully file your federal and state tax returns electronically, minimizing your tax liability.',
      duration: 60,
      price: 150.00,
      sortOrder: 1,
    },
    {
      name: 'Bookkeeping',
      slug: 'bookkeeping',
      description: 'We maintain accurate financial records to support informed business decisions and facilitate information sharing with investors and banks for proper income reporting during tax periods.',
      duration: 45,
      price: 100.00,
      sortOrder: 2,
    },
    {
      name: 'Corporate Setup',
      slug: 'corporate-setup',
      description: 'Assistance with business formation, including entity type selection, name searches, and registration requirements to launch new ventures.',
      duration: 90,
      price: 250.00,
      sortOrder: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log('Created services');

  // Create availability schedule (Monday-Friday, 9am-5pm)
  const businessDays = [1, 2, 3, 4, 5]; // Monday to Friday

  for (const dayOfWeek of businessDays) {
    await prisma.availabilitySchedule.upsert({
      where: {
        dayOfWeek_startTime: {
          dayOfWeek,
          startTime: '09:00',
        },
      },
      update: {
        endTime: '17:00',
        isActive: true,
      },
      create: {
        dayOfWeek,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      },
    });
  }

  console.log('Created availability schedule');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
