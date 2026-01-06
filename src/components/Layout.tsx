import { Outlet, Link, useLocation } from 'react-router-dom';
import { MapPin, Plus, Home } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  return (
    <div className="bg-app-dark" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header con efecto drip */}
      <div className="drip-header">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="w-8 h-8 text-white" />
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', margin: 0 }}>OpenBlind</h1>
        </Link>
      </div>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation - Estilo app móvil */}
      <nav className="fixed bottom-0 shadow-lg" style={{ 
        background: 'rgba(27, 16, 38, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(185, 131, 255, 0.2)',
        width: '100%',
        maxWidth: '480px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <div className="px-4">
          <div className="flex justify-center items-center h-16 gap-32">
            {/* Home */}
            <Link
              to="/places"
              className="flex flex-col items-center gap-1 px-4 py-2 transition-all"
            >
              <Home 
                className="w-6 h-6" 
                style={{ 
                  color: location.pathname === '/places' || location.pathname.startsWith('/places/') && location.pathname !== '/places/add' ? '#B983FF' : 'rgba(255, 255, 255, 0.5)',
                  fill: location.pathname === '/places' || location.pathname.startsWith('/places/') && location.pathname !== '/places/add' ? '#B983FF' : 'none'
                }} 
              />
              <span 
                className="text-xs font-medium"
                style={{ color: location.pathname === '/places' || location.pathname.startsWith('/places/') && location.pathname !== '/places/add' ? '#B983FF' : 'rgba(255, 255, 255, 0.5)' }}
              >
                Inicio
              </span>
            </Link>

            {/* Agregar con texto */}
            <Link
              to="/places/add"
              className="flex flex-col items-center gap-1 px-4 py-2 transition-all"
            >
              <Plus 
                className="w-6 h-6" 
                style={{ color: location.pathname === '/places/add' ? '#B983FF' : 'rgba(255, 255, 255, 0.5)' }} 
              />
              <span 
                className="text-xs font-medium"
                style={{ color: location.pathname === '/places/add' ? '#B983FF' : 'rgba(255, 255, 255, 0.5)' }}
              >
                Agregar
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
