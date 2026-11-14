import './ModuloDatos.css';

const modulos = {
  facturas: {
    titulo: 'Facturas',
    campos: [
      'id',
      'fecha_actualizacion',
      'fecha_creacion',
      'estado',
      'fecha_pago',
      'fecha_vencimiento',
      'periodo',
      'valor',
      'predio_id'
    ],
    registros: [
      {
        id: 1,
        fecha_actualizacion: '2026-10-15',
        fecha_creacion: '2026-10-01',
        estado: 'Pendiente',
        fecha_pago: null,
        fecha_vencimiento: '2026-10-30',
        periodo: '2026-10',
        valor: 48000,
        predio_id: 1
      },
      {
        id: 2,
        fecha_actualizacion: '2026-10-10',
        fecha_creacion: '2026-09-01',
        estado: 'Pagada',
        fecha_pago: '2026-09-18',
        fecha_vencimiento: '2026-09-30',
        periodo: '2026-09',
        valor: 42500,
        predio_id: 2
      }
    ]
  },
  pagos: {
    titulo: 'Pagos',
    campos: [
      'id',
      'fecha_actualizacion',
      'fecha_creacion',
      'metodo_pago',
      'factura_id'
    ],
    registros: [
      {
        id: 1,
        fecha_actualizacion: '2026-10-10',
        fecha_creacion: '2026-10-10',
        metodo_pago: 'Transferencia',
        factura_id: 2
      },
      {
        id: 2,
        fecha_actualizacion: '2026-09-18',
        fecha_creacion: '2026-09-18',
        metodo_pago: 'Efectivo',
        factura_id: 3
      }
    ]
  }
};

function formatearValor(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return '—';
  }

  if (typeof valor === 'number' && valor >= 1000) {
    return valor.toLocaleString('es-CO');
  }

  return valor;
}

export function ModuloDatos({ entidad }) {
  const modulo = modulos[entidad];

  if (!modulo) {
    return <p>Módulo no encontrado.</p>;
  }

  return (
    <section className="modulo-datos">
      <div className="modulo-datos__encabezado">
        <div>
          <h2>{modulo.titulo}</h2>
          <p>Registros de ejemplo según el modelo del backend.</p>
        </div>
        <span className="modulo-datos__total">
          {modulo.registros.length} registros
        </span>
      </div>

      <div className="modulo-datos__tabla-contenedor">
        <table className="modulo-datos__tabla">
          <thead>
            <tr>
              {modulo.campos.map((campo) => (
                <th key={campo} scope="col">{campo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modulo.registros.map((registro) => (
              <tr key={registro.id}>
                {modulo.campos.map((campo) => (
                  <td key={campo}>{formatearValor(registro[campo])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}