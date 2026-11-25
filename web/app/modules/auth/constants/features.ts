export interface AuthFeature {
  title: string;
  image: string;
  textPrefix: string;
  highlight1: string;
  textMiddle?: string;
  highlight2?: string;
  textSuffix?: string;
}

export const AUTH_FEATURES: readonly AuthFeature[] = [
  {
    title: 'Cotiza tu operación',
    image: '/images/figma/Login-2-1.png',
    textPrefix: 'Utiliza la calculadora para verificar el',
    highlight1: 'Tipo de Cambio',
    textSuffix: 'en tiempo real',
  },
  {
    title: 'Realiza la transferencia',
    image: '/images/figma/Login-2-2.png',
    textPrefix: 'Envía desde tu banco el',
    highlight1: 'dinero',
    textMiddle: 'que deseas cambiar a la',
    highlight2: 'cuenta',
    textSuffix: 'de Kambista indicada',
  },
  {
    title: 'Obtén tu dinero',
    image: '/images/figma/Login-2-3.png',
    textPrefix: 'El dinero será',
    highlight1: 'depositado',
    textSuffix: 'en tu cuenta de destino',
  },
] as const;
