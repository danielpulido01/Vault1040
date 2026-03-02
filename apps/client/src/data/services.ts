import { FileText, Calculator, Building2 } from 'lucide-react';

// Icons for services (used with translations)
export const serviceIcons = {
  'tax-preparation': FileText,
  'bookkeeping': Calculator,
  'corporate-setup': Building2,
} as const;

// Legacy export - use translations (t.services.items) instead
export const services = [
  {
    id: 'tax-preparation',
    name: 'Tax Return Preparation',
    slug: 'tax-preparation',
    icon: FileText,
    shortDescription: 'Focus on running your business while we maximize your profits!',
    description:
      'We will carefully file your federal and state tax returns electronically, minimizing your tax liability. Our experienced team ensures accuracy and compliance with all tax regulations.',
    features: [
      'Federal and state tax return filing',
      'Electronic filing for faster refunds',
      'Tax liability minimization strategies',
      'Year-round tax planning support',
      'IRS correspondence handling',
    ],
  },
  {
    id: 'bookkeeping',
    name: 'Bookkeeping',
    slug: 'bookkeeping',
    icon: Calculator,
    shortDescription: 'Accurate financial records for informed business decisions.',
    description:
      'We maintain accurate financial records to support informed business decisions and facilitate information sharing with investors and banks for proper income reporting during tax periods.',
    features: [
      'Monthly financial statement preparation',
      'Bank reconciliation',
      'Accounts payable and receivable',
      'Payroll processing',
      'Financial reporting',
    ],
  },
  {
    id: 'corporate-setup',
    name: 'Corporate Setup',
    slug: 'corporate-setup',
    icon: Building2,
    shortDescription: 'Start your business the right way with expert guidance.',
    description:
      'Assistance with business formation, including entity type selection, name searches, and registration requirements to launch new ventures successfully.',
    features: [
      'Entity type selection (LLC, S-Corp, C-Corp)',
      'Business name search and registration',
      'EIN application',
      'State registration and compliance',
      'Operating agreement preparation',
    ],
  },
];
