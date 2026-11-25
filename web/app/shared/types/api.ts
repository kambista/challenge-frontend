export interface APIError {
  success: false;
  data: {
    name: 'DUPLICATE_DNI' | 'INVALID_PHONE' | 'SERVER_ERROR';
    title: string;
    message: string;
  };
}
export function apiError(name: APIError['data']['name'], title: string, message: string): APIError {
  return { success: false, data: { name, title, message } };
}
