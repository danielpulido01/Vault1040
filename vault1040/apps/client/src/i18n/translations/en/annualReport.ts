import type { AnnualReportTranslations } from '../../types';

export const annualReport: AnnualReportTranslations = {
  pageTitle: 'Florida Annual Report Filing',
  pageSubtitle:
    'Let us handle your Florida annual report filing. Complete the form below with your business information.',

  steps: {
    entityInfo: 'Entity Info',
    addresses: 'Addresses',
    officers: 'Officers',
    review: 'Review & Pay',
  },

  entityInfoStep: {
    title: 'Entity Information',
    subtitle: 'Enter your Florida business details as registered with the Division of Corporations.',
    documentNumber: 'Document Number',
    documentNumberHint: 'Your SunBiz document number (e.g., L12345678901)',
    entityType: 'Entity Type',
    entityTypes: {
      'profit-corp': 'Profit Corporation',
      'non-profit-corp': 'Non-Profit Corporation',
      llc: 'Limited Liability Company (LLC)',
      lp: 'Limited Partnership (LP)',
      lllp: 'Limited Liability Limited Partnership (LLLP)',
    },
    businessName: 'Business Name',
    businessNameReadonly: 'Business name cannot be changed via annual report',
    fein: 'Federal Employer Identification Number (FEIN)',
    feinHint: 'Format: XX-XXXXXXX',
  },

  addressesStep: {
    title: 'Business Addresses',
    subtitle: 'Provide your principal office, mailing, and registered agent addresses.',
    principalOffice: {
      title: 'Principal Office Address',
      description: 'The primary business location',
    },
    mailingAddress: {
      title: 'Mailing Address',
      sameAsPrincipal: 'Same as Principal Office',
    },
    registeredAgent: {
      title: 'Registered Agent',
      description: 'Must be a Florida physical address (no P.O. Box)',
      name: 'Registered Agent Name',
      nameHint: 'Individual or business name',
    },
    fields: {
      street: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      country: 'Country',
    },
  },

  officersStep: {
    title: 'Officers & Directors',
    subtitle: 'List all officers, directors, managers, or partners for your entity.',
    corporation: {
      title: 'Officers & Directors',
      addOfficer: 'Add Officer/Director',
      titles: {
        president: 'President',
        'vice-president': 'Vice President',
        secretary: 'Secretary',
        treasurer: 'Treasurer',
        director: 'Director',
      },
      requirements: 'At minimum, a President is required.',
    },
    llc: {
      title: 'Managers & Members',
      addMember: 'Add Manager/Member',
      types: {
        manager: 'Manager',
        member: 'Member',
      },
      requirements: 'At least one manager or member is required.',
    },
    lp: {
      title: 'Partners',
      addPartner: 'Add Partner',
      types: {
        general: 'General Partner',
        limited: 'Limited Partner',
      },
      requirements: 'At least one general partner is required.',
    },
    name: 'Full Name',
    remove: 'Remove',
  },

  reviewStep: {
    title: 'Review & Payment',
    subtitle: 'Review your information and submit your filing request.',
    entitySection: 'Entity Information',
    addressSection: 'Addresses',
    officersSection: 'Officers/Members/Partners',
    feesSection: 'Filing Fees',
    fees: {
      stateFee: 'State Filing Fee',
      serviceFee: 'Vault1040 Service Fee',
      lateFee: 'Late Fee (after May 1)',
      total: 'Total',
    },
    lateWarning: 'Note: Annual reports filed after May 1st incur a $400 late fee (except non-profits).',
    submitButton: 'Submit Filing Request',
    termsNotice:
      'By submitting, you authorize Vault1040 to file your annual report with the Florida Division of Corporations.',
    edit: 'Edit',
  },

  confirmation: {
    title: 'Filing Request Submitted!',
    subtitle: 'We have received your annual report filing request.',
    referenceNumber: 'Reference Number',
    nextSteps: 'Next Steps',
    nextStepsDescription:
      'Our team will review your submission and contact you within 1 business day to complete payment and file your annual report.',
    emailSent: 'A confirmation email has been sent to',
  },

  validation: {
    documentNumberRequired: 'Document number is required',
    documentNumberInvalid: 'Invalid Florida document number format (e.g., L12345678901)',
    feinRequired: 'FEIN is required',
    feinInvalid: 'FEIN must be in XX-XXXXXXX format',
    streetRequired: 'Street address is required',
    cityRequired: 'City is required',
    stateRequired: 'State is required',
    zipCodeInvalid: 'Invalid ZIP code format',
    registeredAgentRequired: 'Registered agent name is required',
    officerRequired: 'At least one officer is required for corporations',
    presidentRequired: 'A President is required',
    memberRequired: 'At least one manager or member is required for LLCs',
    generalPartnerRequired: 'At least one general partner is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
  },
};
