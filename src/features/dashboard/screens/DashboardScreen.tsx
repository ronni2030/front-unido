import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout/Layout';
import { MapPin, Navigation, History, CreditCard, Map, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'location',
      title: 'Mi Ubicación',
      description: 'Ver ubicación actual',
      icon: MapPin,
      path: '/location',
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      id: 'new-route',
      title: 'Nueva Ruta',
      description: 'Iniciar navegación',
      icon: Navigation,
      path: '/new-route',
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      id: 'places',
      title: 'Lugares',
      description: 'Gestionar favoritos',
      icon: Map,
      path: '/places',
      gradient: 'from-green-500 to-green-700',
    },
    {
      id: 'history',
      title: 'Historial',
      description: 'Ver rutas anteriores',
      icon: History,
      path: '/history-list',
      gradient: 'from-orange-500 to-orange-700',
    },
    {
      id: 'card',
      title: 'Mi Tarjeta',
      description: 'Tarjeta médica',
      icon: CreditCard,
      path: '/view-card',
      gradient: 'from-pink-500 to-pink-700',
    },
    {
      id: 'add-place',
      title: 'Agregar Lugar',
      description: 'Nuevo favorito',
      icon: Plus,
      path: '/places/add',
      gradient: 'from-teal-500 to-teal-700',
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-20">
        {/* Header */}
        <div className="p-6 mb-4">
          <h1 className="text-4xl font-black text-white mb-2">
            Bienvenido
          </h1>
          <p className="text-white text-lg font-medium opacity-70">
            ¿Qué deseas hacer hoy?
          </p>
        </div>

        {/* Grid de opciones */}
        <div className="px-4 grid grid-cols-2 gap-4 pb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-300 active:scale-95 hover:shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(185, 131, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Gradiente de fondo */}
              <div
                className={`absolute inset-0 opacity-20 bg-gradient-to-br ${item.gradient}`}
              />

              {/* Contenido */}
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient}`}
                  style={{
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <item.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                <div>
                  <h3 className="text-white font-black text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white text-sm opacity-70 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Punto decorativo */}
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#B983FF' }}
              />
            </button>
          ))}
        </div>

        {/* Indicador de ayuda */}
        <div className="px-6 pb-6">
          <div
            className="p-4 rounded-2xl"
            style={{
              background: 'rgba(185, 131, 255, 0.1)',
              border: '1px solid rgba(185, 131, 255, 0.3)',
            }}
          >
            <p className="text-white text-sm font-medium text-center opacity-80">
              💡 Usa comandos de voz en cualquier pantalla
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};