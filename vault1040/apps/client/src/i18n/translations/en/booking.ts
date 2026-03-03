import type { BookingTranslations } from '../../types';

export const booking: BookingTranslations = {
  pageTitle: 'Book a Consultation',
  pageSubtitle:
    'Schedule your free consultation with our tax experts. Choose a service, pick a time, and we will take care of the rest.',
  steps: {
    service: 'Service',
    dateTime: 'Date & Time',
    details: 'Details',
    confirmation: 'Confirmation',
  },
  serviceStep: {
    title: 'Select a Service',
    subtitle: 'Choose the service you need assistance with.',
  },
  dateTimeStep: {
    title: 'Choose Date & Time',
    subtitle: 'Select your preferred appointment date and time.',
    selectDate: 'Select a date',
    selectTime: 'Select a time',
    noSlots: 'No available slots for this date. Please select another date.',
  },
  detailsStep: {
    title: 'Your Information',
    subtitle: 'Please provide your contact details.',
    notes: 'Additional Notes',
    notesPlaceholder: 'Any specific questions or topics you would like to discuss...',
  },
  confirmationStep: {
    title: 'Booking Confirmed!',
    subtitle: 'Your consultation has been scheduled successfully.',
    bookingDetails: 'Booking Details',
    confirmationCode: 'Confirmation Code',
    emailSent: 'A confirmation email has been sent to your email address.',
  },
};
