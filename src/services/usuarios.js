import { API_BASE_URL, crearError } from './api';

export async function obtenerUsuarios() {
  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw crearError(response);
  }

  const usuarios = await response.json();

  if (!Array.isArray(usuarios)) {
    throw new Error('La respuesta de usuarios no tiene el formato de una lista.');
  }

  return usuarios;
}

export async function crearUsuario(usuario) {
  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  });

  if (!response.ok) {
    throw crearError(response);
  }
}

export async function actualizarUsuario(id, usuario) {
  const response = await fetch(
    `${API_BASE_URL}/api/usuarios/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    }
  );

  if (!response.ok) {
    throw crearError(response);
  }
}