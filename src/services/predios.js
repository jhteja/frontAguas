import { API_BASE_URL, crearError } from './api';

export async function obtenerPredio(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/predios/${encodeURIComponent(id)}`,
    { headers: { Accept: 'application/json' } }
  );

  if (!response.ok) {
    throw crearError(response);
  }

  return response.json();
}

export async function crearPredio(predio) {
  const response = await fetch(`${API_BASE_URL}/api/predios`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(predio)
  });

  if (!response.ok) {
    throw crearError(response);
  }

  return response.json();
}

export async function actualizarPredio(id, predio) {
  const response = await fetch(
    `${API_BASE_URL}/api/predios/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(predio)
    }
  );

  if (!response.ok) {
    throw crearError(response);
  }

  return response.json();
}
