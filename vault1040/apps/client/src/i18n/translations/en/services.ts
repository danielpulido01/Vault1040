import type { ServicesTranslations } from '../../types';

export const services: ServicesTranslations = {
  pageTitle: 'Our Services',
  pageSubtitle:
    'Comprehensive financial solutions tailored to your individual and business needs.',
  ctaButton: 'Get FREE Consultation',
  bottomCta: {
    title: 'Ready to Get Started?',
    description:
      'Schedule your free consultation and let us help you achieve your financial goals.',
  },
  items: [
    {
      id: 'tax-preparation',
      name: 'Tax Return Preparation',
      slug: 'tax-preparation',
      shortDescription:
        'Maximize your refunds and stay IRS-compliant — stress-free. Forget audits and penalties.',
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
      shortDescription:
        'Always know where your money is. Real-time financial clarity for your business.',
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
      shortDescription:
        'Avoid costly mistakes when forming your business. We choose the right structure and handle everything.',
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
    {
      id: 'llc-formation',
      name: 'Florida LLC Formation',
      slug: 'llc-formation',
      shortDescription:
        'Start your Florida LLC today — we handle the paperwork.',
      description:
        'We file your Florida LLC Articles of Organization with the Division of Corporations. Includes registered agent designation, management structure setup, and confirmation once filed with Sunbiz.',
      features: [
        'Articles of Organization filing ($125 state fee included)',
        'Registered agent designation',
        'Member or manager-managed structure',
        'Operating agreement template',
        'EIN application guidance',
        'Confirmation once filed with Sunbiz',
      ],
    },
  ],
};
