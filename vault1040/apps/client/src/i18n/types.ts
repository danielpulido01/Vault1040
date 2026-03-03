export type Language = 'en' | 'es';

export interface CommonTranslations {
  nav: {
    home: string;
    services: string;
    about: string;
    faq: string;
    contact: string;
  };
  buttons: {
    login: string;
    logout: string;
    register: string;
    bookConsultation: string;
    getStarted: string;
    learnMore: string;
    sendMessage: string;
    submit: string;
    cancel: string;
    back: string;
    next: string;
    confirm: string;
    callUs: string;
    exploreServices: string;
    confirmBooking: string;
    viewDashboard: string;
    returnHome: string;
    bookNewConsultation: string;
    bookFirstConsultation: string;
  };
  labels: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneOptional: string;
    newPassword: string;
    message: string;
    subject: string;
    company: string;
    service: string;
    date: string;
    time: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    passwordMin: string;
    passwordMatch: string;
    passwordMismatch: string;
    messageMin: string;
  };
  language: {
    switchTo: string;
    english: string;
    spanish: string;
  };
}

export interface HomeTranslations {
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    highlights: {
      irsCompliant: string;
      maximizeReturns: string;
      yearRoundSupport: string;
    };
  };
  services: {
    subhead: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  whyChooseUs: {
    subhead: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  testimonials: {
    subhead: string;
    title: string;
    titleAccent: string;
    description: string;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    bookButton: string;
    callButton: string;
  };
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  features: string[];
}

export interface ServicesTranslations {
  pageTitle: string;
  pageSubtitle: string;
  ctaButton: string;
  bottomCta: {
    title: string;
    description: string;
  };
  items: ServiceItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQTranslations {
  pageTitle: string;
  pageSubtitle: string;
  stillHaveQuestions: {
    title: string;
    description: string;
  };
  items: FAQItem[];
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export interface AboutTranslations {
  pageTitle: string;
  pageSubtitle: string;
  story: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
  values: {
    title: string;
    subtitle: string;
    items: CompanyValue[];
  };
  team: {
    title: string;
    subtitle: string;
    members: TeamMember[];
  };
  cta: {
    title: string;
    description: string;
  };
}

export interface ContactTranslations {
  pageTitle: string;
  pageSubtitle: string;
  form: {
    title: string;
    phoneOptional: string;
    subject: string;
    message: string;
    messageMinLength: string;
    submit: string;
    successTitle: string;
    successMessage: string;
  };
  info: {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export interface TestimonialsTranslations {
  items: Testimonial[];
}

export interface AuthTranslations {
  login: {
    title: string;
    subtitle: string;
    forgotPassword: string;
    noAccount: string;
    createAccount: string;
    submit: string;
    error: string;
  };
  register: {
    title: string;
    subtitle: string;
    hasAccount: string;
    signIn: string;
    submit: string;
    error: string;
    successTitle: string;
    successMessage: string;
    goToLogin: string;
  };
  forgotPassword: {
    title: string;
    subtitle: string;
    submit: string;
    backToLogin: string;
    successTitle: string;
    successMessage: string;
  };
  resetPassword: {
    title: string;
    subtitle: string;
    submit: string;
    error: string;
    invalidLink: string;
    invalidLinkMessage: string;
    requestNewLink: string;
    successTitle: string;
    successMessage: string;
    goToLogin: string;
  };
}

export interface BookingTranslations {
  pageTitle: string;
  pageSubtitle: string;
  steps: {
    service: string;
    dateTime: string;
    details: string;
    confirmation: string;
  };
  serviceStep: {
    title: string;
    subtitle: string;
  };
  dateTimeStep: {
    title: string;
    subtitle: string;
    selectDate: string;
    selectTime: string;
    noSlots: string;
  };
  detailsStep: {
    title: string;
    subtitle: string;
    notes: string;
    notesPlaceholder: string;
  };
  confirmationStep: {
    title: string;
    subtitle: string;
    bookingDetails: string;
    confirmationCode: string;
    emailSent: string;
  };
}

export interface FooterTranslations {
  description: string;
  quickLinks: string;
  services: string;
  contactUs: string;
  copyright: string;
  privacyPolicy: string;
}

export interface DashboardTranslations {
  welcome: string;
  subtitle: string;
  stats: {
    upcomingAppointments: string;
    totalBookings: string;
    accountStatus: string;
    active: string;
  };
  upcoming: {
    title: string;
    noAppointments: string;
    loading: string;
    code: string;
  };
  past: {
    title: string;
  };
  cancelConfirm: string;
}

export interface AnnualReportTranslations {
  pageTitle: string;
  pageSubtitle: string;
  steps: {
    entityInfo: string;
    addresses: string;
    officers: string;
    review: string;
  };
  entityInfoStep: {
    title: string;
    subtitle: string;
    documentNumber: string;
    documentNumberHint: string;
    entityType: string;
    entityTypes: {
      'profit-corp': string;
      'non-profit-corp': string;
      llc: string;
      lp: string;
      lllp: string;
    };
    businessName: string;
    businessNameReadonly: string;
    fein: string;
    feinHint: string;
  };
  addressesStep: {
    title: string;
    subtitle: string;
    principalOffice: {
      title: string;
      description: string;
    };
    mailingAddress: {
      title: string;
      sameAsPrincipal: string;
    };
    registeredAgent: {
      title: string;
      description: string;
      name: string;
      nameHint: string;
    };
    fields: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  officersStep: {
    title: string;
    subtitle: string;
    corporation: {
      title: string;
      addOfficer: string;
      titles: {
        president: string;
        'vice-president': string;
        secretary: string;
        treasurer: string;
        director: string;
      };
      requirements: string;
    };
    llc: {
      title: string;
      addMember: string;
      types: {
        manager: string;
        member: string;
      };
      requirements: string;
    };
    lp: {
      title: string;
      addPartner: string;
      types: {
        general: string;
        limited: string;
      };
      requirements: string;
    };
    name: string;
    remove: string;
  };
  reviewStep: {
    title: string;
    subtitle: string;
    entitySection: string;
    addressSection: string;
    officersSection: string;
    feesSection: string;
    fees: {
      stateFee: string;
      serviceFee: string;
      lateFee: string;
      total: string;
    };
    lateWarning: string;
    submitButton: string;
    termsNotice: string;
    edit: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    referenceNumber: string;
    nextSteps: string;
    nextStepsDescription: string;
    emailSent: string;
  };
  validation: {
    documentNumberRequired: string;
    documentNumberInvalid: string;
    feinRequired: string;
    feinInvalid: string;
    streetRequired: string;
    cityRequired: string;
    stateRequired: string;
    zipCodeInvalid: string;
    registeredAgentRequired: string;
    officerRequired: string;
    presidentRequired: string;
    memberRequired: string;
    generalPartnerRequired: string;
    emailRequired: string;
    emailInvalid: string;
  };
}

export interface Translations {
  common: CommonTranslations;
  home: HomeTranslations;
  services: ServicesTranslations;
  faq: FAQTranslations;
  about: AboutTranslations;
  contact: ContactTranslations;
  testimonials: TestimonialsTranslations;
  auth: AuthTranslations;
  booking: BookingTranslations;
  footer: FooterTranslations;
  dashboard: DashboardTranslations;
  annualReport: AnnualReportTranslations;
}
