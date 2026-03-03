import type { BookingTranslations } from '../../types';

export const booking: BookingTranslations = {
  pageTitle: 'Agendar una Consulta',
  pageSubtitle:
    'Programe su consulta gratuita con nuestros expertos en impuestos. Elija un servicio, seleccione un horario y nosotros nos encargamos del resto.',
  steps: {
    service: 'Servicio',
    dateTime: 'Fecha y Hora',
    details: 'Detalles',
    confirmation: 'Confirmación',
  },
  serviceStep: {
    title: 'Seleccione un Servicio',
    subtitle: 'Elija el servicio con el que necesita asistencia.',
  },
  dateTimeStep: {
    title: 'Elija Fecha y Hora',
    subtitle: 'Seleccione su fecha y hora preferida para la cita.',
    selectDate: 'Seleccione una fecha',
    selectTime: 'Seleccione una hora',
    noSlots: 'No hay horarios disponibles para esta fecha. Por favor seleccione otra fecha.',
  },
  detailsStep: {
    title: 'Su Información',
    subtitle: 'Por favor proporcione sus datos de contacto.',
    notes: 'Notas Adicionales',
    notesPlaceholder: 'Cualquier pregunta específica o tema que le gustaría discutir...',
  },
  confirmationStep: {
    title: '¡Cita Confirmada!',
    subtitle: 'Su consulta ha sido programada exitosamente.',
    bookingDetails: 'Detalles de la Cita',
    confirmationCode: 'Código de Confirmación',
    emailSent: 'Se ha enviado un correo de confirmación a su dirección de correo electrónico.',
  },
};
