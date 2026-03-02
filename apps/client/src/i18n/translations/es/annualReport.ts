import type { AnnualReportTranslations } from '../../types';

export const annualReport: AnnualReportTranslations = {
  pageTitle: 'Presentacion de Informe Anual de Florida',
  pageSubtitle:
    'Permita que nosotros manejemos la presentacion de su informe anual de Florida. Complete el formulario con la informacion de su negocio.',

  steps: {
    entityInfo: 'Info de Entidad',
    addresses: 'Direcciones',
    officers: 'Oficiales',
    review: 'Revisar y Pagar',
  },

  entityInfoStep: {
    title: 'Informacion de la Entidad',
    subtitle: 'Ingrese los detalles de su negocio de Florida registrados en la Division de Corporaciones.',
    documentNumber: 'Numero de Documento',
    documentNumberHint: 'Su numero de documento SunBiz (ej., L12345678901)',
    entityType: 'Tipo de Entidad',
    entityTypes: {
      'profit-corp': 'Corporacion con Fines de Lucro',
      'non-profit-corp': 'Corporacion sin Fines de Lucro',
      llc: 'Compania de Responsabilidad Limitada (LLC)',
      lp: 'Sociedad Limitada (LP)',
      lllp: 'Sociedad Limitada de Responsabilidad Limitada (LLLP)',
    },
    businessName: 'Nombre del Negocio',
    businessNameReadonly: 'El nombre del negocio no puede cambiarse mediante el informe anual',
    fein: 'Numero de Identificacion del Empleador Federal (FEIN)',
    feinHint: 'Formato: XX-XXXXXXX',
  },

  addressesStep: {
    title: 'Direcciones del Negocio',
    subtitle: 'Proporcione las direcciones de su oficina principal, correo y agente registrado.',
    principalOffice: {
      title: 'Direccion de Oficina Principal',
      description: 'La ubicacion principal del negocio',
    },
    mailingAddress: {
      title: 'Direccion de Correo',
      sameAsPrincipal: 'Igual que la Oficina Principal',
    },
    registeredAgent: {
      title: 'Agente Registrado',
      description: 'Debe ser una direccion fisica de Florida (sin apartado postal)',
      name: 'Nombre del Agente Registrado',
      nameHint: 'Nombre individual o de negocio',
    },
    fields: {
      street: 'Direccion',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Codigo Postal',
      country: 'Pais',
    },
  },

  officersStep: {
    title: 'Oficiales y Directores',
    subtitle: 'Liste todos los oficiales, directores, gerentes o socios de su entidad.',
    corporation: {
      title: 'Oficiales y Directores',
      addOfficer: 'Agregar Oficial/Director',
      titles: {
        president: 'Presidente',
        'vice-president': 'Vicepresidente',
        secretary: 'Secretario',
        treasurer: 'Tesorero',
        director: 'Director',
      },
      requirements: 'Como minimo, se requiere un Presidente.',
    },
    llc: {
      title: 'Gerentes y Miembros',
      addMember: 'Agregar Gerente/Miembro',
      types: {
        manager: 'Gerente',
        member: 'Miembro',
      },
      requirements: 'Se requiere al menos un gerente o miembro.',
    },
    lp: {
      title: 'Socios',
      addPartner: 'Agregar Socio',
      types: {
        general: 'Socio General',
        limited: 'Socio Limitado',
      },
      requirements: 'Se requiere al menos un socio general.',
    },
    name: 'Nombre Completo',
    remove: 'Eliminar',
  },

  reviewStep: {
    title: 'Revisar y Pagar',
    subtitle: 'Revise su informacion y envie su solicitud de presentacion.',
    entitySection: 'Informacion de la Entidad',
    addressSection: 'Direcciones',
    officersSection: 'Oficiales/Miembros/Socios',
    feesSection: 'Tarifas de Presentacion',
    fees: {
      stateFee: 'Tarifa de Presentacion Estatal',
      serviceFee: 'Tarifa de Servicio Vault1040',
      lateFee: 'Tarifa por Retraso (despues del 1 de mayo)',
      total: 'Total',
    },
    lateWarning:
      'Nota: Los informes anuales presentados despues del 1 de mayo incurren en una tarifa de $400 por retraso (excepto organizaciones sin fines de lucro).',
    submitButton: 'Enviar Solicitud de Presentacion',
    termsNotice:
      'Al enviar, autoriza a Vault1040 a presentar su informe anual ante la Division de Corporaciones de Florida.',
    edit: 'Editar',
  },

  confirmation: {
    title: 'Solicitud de Presentacion Enviada!',
    subtitle: 'Hemos recibido su solicitud de presentacion de informe anual.',
    referenceNumber: 'Numero de Referencia',
    nextSteps: 'Proximos Pasos',
    nextStepsDescription:
      'Nuestro equipo revisara su envio y se comunicara con usted dentro de 1 dia habil para completar el pago y presentar su informe anual.',
    emailSent: 'Se ha enviado un correo de confirmacion a',
  },

  validation: {
    documentNumberRequired: 'Se requiere el numero de documento',
    documentNumberInvalid: 'Formato de numero de documento de Florida invalido (ej., L12345678901)',
    feinRequired: 'Se requiere el FEIN',
    feinInvalid: 'El FEIN debe estar en formato XX-XXXXXXX',
    streetRequired: 'Se requiere la direccion',
    cityRequired: 'Se requiere la ciudad',
    stateRequired: 'Se requiere el estado',
    zipCodeInvalid: 'Formato de codigo postal invalido',
    registeredAgentRequired: 'Se requiere el nombre del agente registrado',
    officerRequired: 'Se requiere al menos un oficial para corporaciones',
    presidentRequired: 'Se requiere un Presidente',
    memberRequired: 'Se requiere al menos un gerente o miembro para LLCs',
    generalPartnerRequired: 'Se requiere al menos un socio general',
    emailRequired: 'Se requiere el correo electronico',
    emailInvalid: 'Direccion de correo electronico invalida',
  },
};
