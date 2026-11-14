import { useEffect, useState } from 'react';
import {
  actualizarUsuario,
  crearUsuario,
  obtenerUsuarios
} from '../services/usuarios';
import './Usuarios.css';

const formularioVacio = {
  documento: '',
  nombre: '',
  password: '',
  rol: ''
};

export function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [nuevoUsuario, setNuevoUsuario] = useState(formularioVacio);
  const [creando, setCreando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    let cancelado = false;

    async function cargarUsuarios() {
      setCargando(true);
      setError('');

      try {
        const resultado = await obtenerUsuarios();
        if (!cancelado) setUsuarios(resultado);
      } catch (requestError) {
        if (!cancelado) {
          setError(requestError.message || 'No se pudieron cargar los usuarios.');
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarUsuarios();
    return () => {
      cancelado = true;
    };
  }, [intentoCarga]);

  function seleccionarUsuario(usuario) {
    setCreando(false);
    setUsuarioId(usuario.id);
    setFormulario({
      documento: usuario.documento ?? '',
      nombre: usuario.nombre ?? '',
      password: '',
      rol: usuario.rol ?? ''
    });
    setError('');
    setMensaje('');
  }

  function abrirFormularioNuevo() {
    setUsuarioId(null);
    setCreando(true);
    setNuevoUsuario(formularioVacio);
    setError('');
    setMensaje('');
  }

  function cancelarCreacion() {
    setCreando(false);
    setNuevoUsuario(formularioVacio);
    setError('');
  }

  function cambiarCampo(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  function cambiarCampoNuevo(event) {
    const { name, value } = event.target;
    setNuevoUsuario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardarNuevoUsuario(event) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      await crearUsuario(nuevoUsuario);
      setCreando(false);
      setNuevoUsuario(formularioVacio);
      setMensaje('Usuario creado correctamente.');
      setIntentoCarga((intento) => intento + 1);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  async function guardarUsuario(event) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      await actualizarUsuario(usuarioId, formulario);
      setFormulario((actual) => ({ ...actual, password: '' }));
      setUsuarios((actuales) => actuales.map((usuario) => (
        usuario.id === usuarioId
          ? {
              ...usuario,
              documento: formulario.documento,
              nombre: formulario.nombre,
              rol: formulario.rol
            }
          : usuario
      )));
      setMensaje('Usuario actualizado correctamente.');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="usuarios">
      <header className="usuarios__encabezado">
        <div>
          <h2>Usuarios</h2>
          <p>Usuarios registrados en el sistema.</p>
        </div>
        <button type="button" onClick={abrirFormularioNuevo} disabled={guardando}>
          Agregar usuario
        </button>
      </header>

      {error && <p className="usuarios__mensaje usuarios__mensaje--error" role="alert">{error}</p>}
      {mensaje && <p className="usuarios__mensaje" role="status">{mensaje}</p>}

      {creando && (
        <form className="usuarios__formulario" onSubmit={guardarNuevoUsuario}>
          <h3>Nuevo usuario</h3>
          <div className="usuarios__campos">
            <label>
              Documento
              <input
                name="documento"
                value={nuevoUsuario.documento}
                onChange={cambiarCampoNuevo}
                required
              />
            </label>
            <label>
              Nombre
              <input
                name="nombre"
                value={nuevoUsuario.nombre}
                onChange={cambiarCampoNuevo}
                required
              />
            </label>
            <label>
              Rol
              <input
                name="rol"
                value={nuevoUsuario.rol}
                onChange={cambiarCampoNuevo}
                required
              />
            </label>
            <label>
              Contraseña
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                value={nuevoUsuario.password}
                onChange={cambiarCampoNuevo}
                required
              />
            </label>
          </div>
          <div className="usuarios__acciones-formulario">
            <button type="submit" disabled={guardando}>
              {guardando ? 'Creando...' : 'Crear usuario'}
            </button>
            <button type="button" onClick={cancelarCreacion} disabled={guardando}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {cargando && <p role="status">Cargando usuarios...</p>}

      {!cargando && !error && usuarios.length === 0 && (
        <p>No hay usuarios registrados.</p>
      )}

      {!cargando && error && (
        <button type="button" onClick={() => setIntentoCarga((intento) => intento + 1)}>
          Reintentar
        </button>
      )}

      {!cargando && usuarios.length > 0 && (
        <div className="usuarios__tabla-contenedor">
          <table className="usuarios__tabla">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Documento</th>
                <th scope="col">Nombre</th>
                <th scope="col">Rol</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.documento}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => seleccionarUsuario(usuario)}
                      aria-label={`Editar usuario ${usuario.nombre}`}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {usuarioId !== null && (
        <form className="usuarios__formulario" onSubmit={guardarUsuario}>
          <h3>Editar usuario #{usuarioId}</h3>

          <div className="usuarios__campos">
            <label>
              Documento
              <input
                name="documento"
                value={formulario.documento}
                onChange={cambiarCampo}
                required
              />
            </label>
            <label>
              Nombre
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                required
              />
            </label>
            <label>
              Rol
              <input
                name="rol"
                value={formulario.rol}
                onChange={cambiarCampo}
                required
              />
            </label>
            <label>
              Nueva contraseña
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                value={formulario.password}
                onChange={cambiarCampo}
                required
              />
            </label>
          </div>

          <p className="usuarios__ayuda">
            El endpoint PUT requiere una nueva contraseña en cada actualización.
          </p>
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </section>
  );
}