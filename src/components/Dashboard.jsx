import './Dashboard.css';

export function Dashboard() {
  return (
    <section>
      <h2>Resumen del Sistema</h2>
      <div className="indicadores-dashboard">
        <div className="indicador-dashboard indicador-dashboard--suscriptores">
          <h3>142</h3>
          <p>Total Suscriptores</p>
        </div>
        <div className="indicador-dashboard indicador-dashboard--consumo">
          <h3>3,250 m³</h3>
          <p>Consumo del Mes</p>
        </div>
        <div className="indicador-dashboard indicador-dashboard--recaudo">
          <h3>$4,820,000</h3>
          <p>Recaudo Estimado</p>
        </div>
      </div>
    </section>
  );
}