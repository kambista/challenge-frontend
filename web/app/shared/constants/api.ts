export const KAMBISTA_API_BASE_URL = 'https://api.kambista.com';

export const KAMBISTA_ENDPOINTS = {
  currentExchange: `${KAMBISTA_API_BASE_URL}/v1/exchange/kambista/current`,
  calculateExchange: `${KAMBISTA_API_BASE_URL}/v1/exchange/calculates`,
} as const;
