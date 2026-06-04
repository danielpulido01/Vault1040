import type { ServicesTranslations } from '../../types';

export const services: ServicesTranslations = {
  pageTitle: 'Nuestros Servicios',
  pageSubtitle:
    'Tu negocio merece una base sólida. Nosotros te la construimos.',
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
        'Paga lo justo. Ni un centavo más.',
      description:
        'Preparamos tu declaración federal y estatal con precisión quirúrgica. Si el IRS te llama, nosotros respondemos. Si hay errores, los cubrimos.',
      features: [
        'Presentación de declaraciones federales y estatales',
        'Presentación electrónica para reembolsos más rápidos',
        'Estrategias de minimización de responsabilidad fiscal',
        'Soporte de planificación fiscal durante todo el año',
        'Manejo de correspondencia del IRS',
      ],
    },
    {
      id: 'llc-formation',
      name: 'Formación de LLC en Florida',
      slug: 'llc-formation',
      shortDescription:
        'Forme su LLC en Florida hoy — nosotros nos encargamos del papeleo.',
      description:
        'Presentamos sus Artículos de Organización ante la División de Corporaciones de Florida. Incluye designación de agente registrado, estructura de gestión y confirmación una vez aprobado en Sunbiz.',
      features: [
        'Presentación de Artículos de Organización (tarifa estatal de $125 incluida)',
        'Designación de agente registrado',
        'Estructura de gestión por miembros o gerentes',
        'Plantilla de acuerdo operativo',
        'Orientación para solicitud de EIN',
        'Confirmación una vez registrado en Sunbiz',
      ],
    },
    {
      id: 'corporate-setup',
      name: 'Constitución de Empresas',
      slug: 'corporate-setup',
      shortDescription:
        'Evita errores costosos al registrar tu empresa. Nosotros elegimos la estructura ideal y lo gestionamos todo.',
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
    {
      id: 'bookkeeping',
      name: 'Contabilidad',
      slug: 'bookkeeping',
      shortDescription:
        'Información financiera en tiempo real para tu negocio. Siempre sabe a dónde va tu dinero.',
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
  ],
};
