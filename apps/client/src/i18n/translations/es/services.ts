import type { ServicesTranslations } from '../../types';

export const services: ServicesTranslations = {
  pageTitle: 'Nuestros Servicios',
  pageSubtitle:
    'Soluciones financieras integrales adaptadas a sus necesidades individuales y empresariales.',
  ctaButton: 'Consulta GRATIS',
  bottomCta: {
    title: '¿Listo para Comenzar?',
    description:
      'Programe su consulta gratuita y permítanos ayudarlo a alcanzar sus metas financieras.',
  },
  items: [
    {
      id: 'tax-preparation',
      name: 'Preparación de Impuestos',
      slug: 'tax-preparation',
      shortDescription:
        '¡Concéntrese en su negocio mientras maximizamos sus ganancias!',
      description:
        'Presentamos cuidadosamente sus declaraciones de impuestos federales y estatales electrónicamente, minimizando su responsabilidad fiscal. Nuestro equipo experimentado garantiza precisión y cumplimiento con todas las regulaciones fiscales.',
      features: [
        'Presentación de declaraciones federales y estatales',
        'Presentación electrónica para reembolsos más rápidos',
        'Estrategias de minimización de responsabilidad fiscal',
        'Soporte de planificación fiscal durante todo el año',
        'Manejo de correspondencia del IRS',
      ],
    },
    {
      id: 'bookkeeping',
      name: 'Contabilidad',
      slug: 'bookkeeping',
      shortDescription:
        'Registros financieros precisos para decisiones empresariales informadas.',
      description:
        'Mantenemos registros financieros precisos para respaldar decisiones empresariales informadas y facilitar el intercambio de información con inversores y bancos para la declaración adecuada de ingresos durante los períodos fiscales.',
      features: [
        'Preparación de estados financieros mensuales',
        'Conciliación bancaria',
        'Cuentas por pagar y por cobrar',
        'Procesamiento de nómina',
        'Informes financieros',
      ],
    },
    {
      id: 'corporate-setup',
      name: 'Constitución de Empresas',
      slug: 'corporate-setup',
      shortDescription:
        'Inicie su negocio de la manera correcta con orientación experta.',
      description:
        'Asistencia con la formación de empresas, incluyendo selección del tipo de entidad, búsquedas de nombres y requisitos de registro para lanzar nuevos emprendimientos exitosamente.',
      features: [
        'Selección del tipo de entidad (LLC, S-Corp, C-Corp)',
        'Búsqueda y registro de nombre comercial',
        'Solicitud de EIN',
        'Registro estatal y cumplimiento',
        'Preparación de acuerdo operativo',
      ],
    },
  ],
};
