import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log('Seeding database...');

  // Create users
  const users = [
    {
      email: 'admin@vault1040.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      isEmailVerified: true,
    },
    {
      email: 'staff@vault1040.com',
      password: 'Staff123!',
      firstName: 'Staff',
      lastName: 'Member',
      role: 'STAFF' as const,
      isEmailVerified: true,
    },
    {
      email: 'client@example.com',
      password: 'Client123!',
      firstName: 'Test',
      lastName: 'Client',
      role: 'CLIENT' as const,
      isEmailVerified: true,
    },
  ];

  for (const user of users) {
    const passwordHash = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      create: {
        email: user.email,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  }

  console.log('Created users');

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
    {
      name: 'Florida LLC Formation',
      slug: 'llc-formation',
      description: 'We file your Florida LLC Articles of Organization with the Division of Corporations. Includes registered agent designation and confirmation once filed with Sunbiz.',
      duration: 0,
      price: 175.00,
      sortOrder: 4,
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
