import { Heart, Clock, GraduationCap, Users } from 'lucide-react';

// Icons for company values (used with translations)
export const valueIcons = {
  'service': Heart,
  'accessibility': Clock,
  'expertise': GraduationCap,
  'dedication': Users,
} as const;

// Legacy export - use translations (t.about.values) instead
export const companyValues = [
  {
    id: 'service',
    title: 'Service Vocation',
    description:
      'We are committed to delivering positive experiences and building lasting relationships with every client we serve.',
    icon: Heart,
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    description:
      'Available 24/7, 365 days a year. We are always here when you need us, providing responsive support and guidance.',
    icon: Clock,
  },
  {
    id: 'expertise',
    title: 'Expertise',
    description:
      'Our team continuously improves through ongoing training and education to provide you with the best possible service.',
    icon: GraduationCap,
  },
  {
    id: 'dedication',
    title: 'Dedication',
    description:
      'Empathy and dedication are at the core of every client interaction. Your success is our success.',
    icon: Users,
  },
];

export const teamMembers = [
  {
    id: '1',
    name: 'Daniel',
    role: 'Founder & Tax Expert',
    bio: 'With over 15 years of experience in tax preparation and financial planning, Daniel founded Vault1040 to provide accessible, professional tax services to the Miami community.',
  },
  {
    id: '2',
    name: 'Scarlett',
    role: 'Senior Accountant',
    bio: 'Scarlett specializes in small business accounting and bookkeeping, helping entrepreneurs maintain accurate financial records and make informed decisions.',
  },
  {
    id: '3',
    name: 'Genesis',
    role: 'Corporate Services Manager',
    bio: 'Genesis leads our corporate setup division, guiding clients through business formation and ensuring compliance with all regulatory requirements.',
  },
];
