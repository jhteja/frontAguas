import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutPrincipal } from './components/LayoutPrincipal';
import { Dashboard } from './components/Dashboard';
import { ModuloDatos } from './components/ModuloDatos';
import { Predios } from './components/Predios';
import { Usuarios } from './components/Usuarios';

// 🟢 CAMBIO AQUÍ: agregamos 'default'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta contenedora padre con el Layout principal */}
        <Route path="/" element={<LayoutPrincipal />}>
          
          {/* Rutas Hijas que se inyectan en el <Outlet /> */}
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="predios" element={<Predios />} />
          <Route path="facturas" element={<ModuloDatos entidad="facturas" />} />
          <Route path="pagos" element={<ModuloDatos entidad="pagos" />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}