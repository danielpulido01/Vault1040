import type { AuthTranslations } from '../../types';

export const auth: AuthTranslations = {
  login: {
    title: 'Bienvenido de Nuevo',
    subtitle: 'Inicie sesión en su cuenta Vault1040',
    forgotPassword: '¿Olvidó su contraseña?',
    noAccount: '¿No tiene una cuenta?',
    createAccount: 'Crear cuenta',
    submit: 'Iniciar Sesión',
    error: 'Error al iniciar sesión',
  },
  register: {
    title: 'Crear Cuenta',
    subtitle: 'Únase a Vault1040 hoy',
    hasAccount: '¿Ya tiene una cuenta?',
    signIn: 'Iniciar sesión',
    submit: 'Crear Cuenta',
    error: 'Error en el registro',
    successTitle: '¡Registro Exitoso!',
    successMessage: 'Por favor revise su correo electrónico para verificar su cuenta.',
    goToLogin: 'Ir a Iniciar Sesión',
  },
  forgotPassword: {
    title: '¿Olvidó su Contraseña?',
    subtitle: 'Ingrese su correo electrónico y le enviaremos instrucciones para restablecer.',
    submit: 'Enviar Enlace',
    backToLogin: 'Volver a Iniciar Sesión',
    successTitle: 'Revise su Correo',
    successMessage:
      'Si existe una cuenta con este correo, hemos enviado instrucciones para restablecer la contraseña.',
  },
  resetPassword: {
    title: 'Restablecer Contraseña',
    subtitle: 'Ingrese su nueva contraseña a continuación.',
    submit: 'Restablecer Contraseña',
    error: 'Error al restablecer la contraseña',
    invalidLink: 'Enlace Inválido',
    invalidLinkMessage: 'Este enlace de restablecimiento de contraseña es inválido o ha expirado.',
    requestNewLink: 'Solicitar Nuevo Enlace',
    successTitle: '¡Contraseña Restablecida!',
    successMessage: 'Su contraseña ha sido restablecida exitosamente.',
    goToLogin: 'Ir a Iniciar Sesión',
  },
};
