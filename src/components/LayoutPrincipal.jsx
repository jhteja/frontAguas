import { Outlet, NavLink } from 'react-router-dom';
import './LayoutPrincipal.css';

export function LayoutPrincipal() {
  const claseEnlace = ({ isActive }) =>
    `menu-lateral__enlace${isActive ? ' menu-lateral__enlace--activo' : ''}`;

  return (
    <div className="layout-principal">
      <aside className="menu-lateral">
        <h2 className="menu-lateral__titulo">
          💧 Acueducto Veredal
        </h2>
        
        <nav className="menu-lateral__navegacion">
          <NavLink to="/" end className={claseEnlace}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/usuarios" className={claseEnlace}>
            👥 Usuarios
          </NavLink>
          <NavLink to="/predios" className={claseEnlace}>
            🏡 Predios
          </NavLink>
          <NavLink to="/facturas" className={claseEnlace}>
            🧾 Facturas
          </NavLink>
          <NavLink to="/pagos" className={claseEnlace}>
            💳 Pagos
          </NavLink>
        </nav>
      </aside>

      <div className="contenido-principal">
        <header className="contenido-principal__encabezado">
          <strong>Panel Administrativo - Gestión y Cobro de Agua</strong>
        </header>

        <main className="contenido-principal__cuerpo">
          <Outlet />
        </main>

        <footer className="contenido-principal__pie">
          <small>© 2026 Sistema de Acueducto Veredal - Todos los derechos reservados</small>
        </footer>
      </div>
    </div>
  );
}