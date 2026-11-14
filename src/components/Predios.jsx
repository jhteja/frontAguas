import { useEffect, useState } from 'react';
import {
  actualizarPredio,
  crearPredio,
  obtenerPredio
} from '../services/predios';
import { obtenerUsuarios } from '../services/usuarios';
import './Predios.css';

const formularioVacio = {
  usuarioId: '',
  sector: '',
  via: '',
  numero: '',
  complemento: '',
  tipoPredio: '',
  tarifaXunidad: '',
  tarifa: ''
};

function construirDireccion(predio) {
  const viaNumero = [predio.via, predio.numero].filter(Boolean).join(' ');

  return [viaNumero, predio.sector, predio.complemento]
    .filter(Boolean)
    .join(', ') || 'Sin dirección registrada';
}

function formatearTarifa(valor) {
  if (valor === null || valor === undefined) return 'No definida';

  return Number(valor).toLocaleString('es-CO', {
    maximumFractionDigits: 2
  });
}

function prepararFormulario(predio) {
  return {
    usuarioId: String(predio.usuarioId ?? ''),
    sector: predio.sector ?? '',
    via: predio.via ?? '',
    numero: predio.numero ?? '',
    complemento: predio.complemento ?? '',
    tipoPredio: predio.tipoPredio ?? '',
    tarifaXunidad: String(predio.tarifaXunidad ?? ''),
    tarifa: String(predio.tarifa ?? '')
  };
}

export function Predios() {
  const [idBusqueda, setIdBusqueda] = useState('');
  const [predio, setPredio] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [cargandoPredio, setCargandoPredio] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardandoPredio, setGuardandoPredio] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [errorPredio, setErrorPredio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [intentoUsuarios, setIntentoUsuarios] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function cargarUsuarios() {
      setCargandoUsuarios(true);
      setErrorUsuarios('');

      try {
        const resultado = await obtenerUsuarios();
        if (!cancelado) setUsuarios(resultado);
      } catch (requestError) {
        if (!cancelado) {
          setErrorUsuarios(requestError.message || 'No se pudieron cargar los usuarios.');
        }
      } finally {
        if (!cancelado) setCargandoUsuarios(false);
      }
    }

    cargarUsuarios();
    return () => {
      cancelado = true;
    };
  }, [intentoUsuarios]);

  async function buscarPredio(event) {
    event.preventDefault();
    const id = idBusqueda.trim();
    if (!id) return;

    setCargandoPredio(true);
    setPredio(null);
    setMostrarFormulario(false);
    setModoEdicion(false);
    setErrorPredio('');
    setMensaje('');

    try {
      const resultado = await obtenerPredio(id);
      setPredio(resultado);
    } catch (requestError) {
      setErrorPredio(requestError.message || 'No se pudo consultar el predio.');
    } finally {
      setCargandoPredio(false);
    }
  }

  function abrirCreacion() {
    setFormulario(formularioVacio);
    setMostrarFormulario(true);
    setModoEdicion(false);
    setErrorPredio('');
    setMensaje('');
  }

  function abrirEdicion() {
    setFormulario(prepararFormulario(predio));
    setMostrarFormulario(true);
    setModoEdicion(true);
    setErrorPredio('');
    setMensaje('');
  }

  function cancelarFormulario() {
    setMostrarFormulario(false);
    setModoEdicion(false);
    setFormulario(formularioVacio);
    setErrorPredio('');
  }

  function cambiarCampo(event) {
    const { name, value } = event.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  }

  async function guardarFormulario(event) {
    event.preventDefault();
    setGuardandoPredio(true);
    setErrorPredio('');
    setMensaje('');

    const payload = {
      ...formulario,
      usuarioId: Number(formulario.usuarioId),
      tarifaXunidad: Number(formulario.tarifaXunidad),
      tarifa: Number(formulario.tarifa)
    };

    try {
      const resultado = modoEdicion
        ? await actualizarPredio(predio.id, payload)
        : await crearPredio(payload);

      setPredio(resultado);
      setIdBusqueda(String(resultado.id));
      setMostrarFormulario(false);
      setModoEdicion(false);
      setFormulario(formularioVacio);
      setMensaje(
        modoEdicion
          ? `Predio #${resultado.id} actualizado correctamente.`
          : `Predio #${resultado.id} creado correctamente.`
      );
    } catch (requestError) {
      setErrorPredio(
        requestError.message ||
        `No se pudo ${modoEdicion ? 'actualizar' : 'crear'} el predio.`
      );
    } finally {
      setGuardandoPredio(false);
    }
  }

  const usuarioRelacionado = predio
    ? usuarios.find((usuario) => String(usuario.id) === String(predio.usuarioId))
    : null;
  const usuarioNoEncontrado = predio
    && !cargandoUsuarios
    && !errorUsuarios
    && !usuarioRelacionado;

  return (
    <section className="predios">
      <header className="predios__encabezado">
        <div>
          <h2>Predios</h2>
          <p>Consulta, crea y actualiza predios del sistema.</p>
        </div>
        <button type="button" onClick={abrirCreacion} disabled={guardandoPredio}>
          Agregar predio
        </button>
      </header>

      {mensaje && <p className="predios__mensaje" role="status">{mensaje}</p>}

      {mostrarFormulario && (
        <form className="predios__formulario" onSubmit={guardarFormulario}>
          <h3>{modoEdicion ? `Editar predio #${predio.id}` : 'Nuevo predio'}</h3>

          <div className="predios__campos">
            <label>
              Usuario
              <select
                name="usuarioId"
                value={formulario.usuarioId}
                onChange={cambiarCampo}
                required
                disabled={cargandoUsuarios || Boolean(errorUsuarios) || usuarios.length === 0}
              >
                <option value="">Selecciona un usuario existente</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} (ID: {usuario.id})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo de predio
              <input
                name="tipoPredio"
                value={formulario.tipoPredio}
                onChange={cambiarCampo}
                required
              />
            </label>
          </div>

          <fieldset className="predios__direccion">
            <legend>Dirección</legend>
            <div className="predios__campos">
              <label>
                Sector
                <input
                  name="sector"
                  value={formulario.sector}
                  onChange={cambiarCampo}
                  required
                />
              </label>
              <label>
                Vía
                <input
                  name="via"
                  value={formulario.via}
                  onChange={cambiarCampo}
                  required
                />
              </label>
              <label>
                Número
                <input
                  name="numero"
                  value={formulario.numero}
                  onChange={cambiarCampo}
                  required
                />
              </label>
              <label>
                Complemento
                <input
                  name="complemento"
                  value={formulario.complemento}
                  onChange={cambiarCampo}
                />
              </label>
            </div>
          </fieldset>

          <div className="predios__campos">
            <label>
              Tarifa por unidad
              <input
                name="tarifaXunidad"
                type="number"
                min="0"
                step="any"
                value={formulario.tarifaXunidad}
                onChange={cambiarCampo}
                required
              />
            </label>
            <label>
              Tarifa
              <input
                name="tarifa"
                type="number"
                min="0"
                step="any"
                value={formulario.tarifa}
                onChange={cambiarCampo}
                required
              />
            </label>
          </div>

          <div className="predios__acciones-formulario">
            <button
              type="submit"
              disabled={guardandoPredio || cargandoUsuarios || usuarios.length === 0}
            >
              {guardandoPredio
                ? 'Guardando...'
                : modoEdicion ? 'Guardar cambios' : 'Crear predio'}
            </button>
            <button
              type="button"
              onClick={cancelarFormulario}
              disabled={guardandoPredio}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {errorPredio && (
        <p className="predios__mensaje predios__mensaje--error" role="alert">
          {errorPredio}
        </p>
      )}
      {cargandoPredio && <p role="status">Cargando predio...</p>}

      {errorUsuarios && (
        <div className="predios__mensaje predios__mensaje--error" role="alert">
          <p>{errorUsuarios}</p>
          <button type="button" onClick={() => setIntentoUsuarios((intento) => intento + 1)}>
            Reintentar carga de usuarios
          </button>
          {mostrarFormulario && <p>No se puede guardar el predio sin usuarios existentes.</p>}
        </div>
      )}

      <form className="predios__busqueda" onSubmit={buscarPredio}>
        <label htmlFor="predio-id">ID del predio</label>
        <div className="predios__busqueda-campos">
          <input
            id="predio-id"
            inputMode="numeric"
            value={idBusqueda}
            onChange={(event) => setIdBusqueda(event.target.value)}
            required
          />
          <button type="submit" disabled={cargandoPredio || !idBusqueda.trim()}>
            {cargandoPredio ? 'Buscando...' : 'Buscar predio'}
          </button>
        </div>
      </form>

      {predio && !cargandoPredio && (
        <article className="predios__detalle">
          <div className="predios__detalle-encabezado">
            <h3>Predio #{predio.id}</h3>
            <button
              type="button"
              onClick={abrirEdicion}
              disabled={guardandoPredio || cargandoUsuarios || Boolean(errorUsuarios)}
            >
              Editar predio
            </button>
          </div>
          <section className="predios__grupo" aria-labelledby="predio-direccion">
            <h4 id="predio-direccion">Dirección</h4>
            <p>{construirDireccion(predio)}</p>
          </section>
          <dl className="predios__datos">
            <div>
              <dt>Tipo de predio</dt>
              <dd>{predio.tipoPredio || 'No especificado'}</dd>
            </div>
            <div>
              <dt>Tarifa</dt>
              <dd>{formatearTarifa(predio.tarifa)}</dd>
            </div>
            <div>
              <dt>Tarifa por unidad</dt>
              <dd>{formatearTarifa(predio.tarifaXunidad)}</dd>
            </div>
            <div>
              <dt>Usuario vinculado</dt>
              <dd>
                {cargandoUsuarios
                  ? 'Buscando usuario...'
                  : usuarioRelacionado?.nombre || predio.nombreUsuario || 'No encontrado'}
              </dd>
            </div>
            <div>
              <dt>Usuario ID (clave foránea)</dt>
              <dd>{predio.usuarioId}</dd>
            </div>
          </dl>
          {usuarioNoEncontrado && (
            <p className="predios__mensaje predios__mensaje--error" role="alert">
              El usuario ID {predio.usuarioId} no aparece en la lista de usuarios existentes.
            </p>
          )}
        </article>
      )}
    </section>
  );
}
