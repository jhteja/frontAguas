export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function crearError(response) {
  return new Error(`La solicitud falló (${response.status}).`);
}