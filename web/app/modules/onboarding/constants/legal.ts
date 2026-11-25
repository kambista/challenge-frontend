export const LEGAL_CONTENT = {
  terms: {
    title: 'Términos y condiciones',
    paragraphs: [
      'Esta aplicación es una demostración del proceso de cambio de divisas de Kambista. El inicio de sesión y el registro son simulados; no se abre una cuenta financiera ni se realizan transferencias reales.',
      'Debes ser mayor de edad, proporcionar información correcta y registrar únicamente cuentas bancarias de tu titularidad. Antes de continuar, revisa el monto, las monedas y la cuenta de destino.',
      'Las cotizaciones provienen de un servicio externo y pueden variar. Adjuntar una constancia en esta demostración no acredita un pago ni genera una obligación de cambio.',
    ],
  },
  privacy: {
    title: 'Política de Tratamiento de datos personales',
    paragraphs: [
      'Los datos de perfil se utilizan en este navegador para mostrar el recorrido de registro. El consentimiento de esta casilla es opcional y puedes continuar sin marcarla.',
      'Las cuentas que agregues se guardan en el almacenamiento local del navegador, asociadas al correo de demostración. La sesión y la operación activa se conservan durante la pestaña y se eliminan al cerrar sesión.',
      'La constancia seleccionada permanece en memoria y no se envía a un servidor. Solo el monto y las monedas se consultan en la API de cotización. Puedes eliminar las cuentas guardadas borrando los datos locales de este sitio.',
    ],
  },
} as const;
