import React from 'react';

interface SimpleScreenProps {
  setScreen: (screen: string) => void;
}

export const NavigationScreen: React.FC<SimpleScreenProps> = ({ setScreen }) => {
  return (
    <div className="screen-card">
      <h2 className="screen-title">🧭 Guía de Navegación</h2>
      <p className="screen-subtitle">Sistema de navegación para personas con discapacidad visual</p>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setScreen("home")} className="back-button">
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export const FavoritesScreen: React.FC<SimpleScreenProps> = ({ setScreen }) => {
  return (
    <div className="screen-card">
      <h2 className="screen-title">⭐ Lugares Favoritos</h2>
      <p className="screen-subtitle">Gestión de tus lugares favoritos</p>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setScreen("home")} className="back-button-alt">
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export const CardScreen: React.FC<SimpleScreenProps> = ({ setScreen }) => {
  return (
    <div className="screen-card">
      <h2 className="screen-title">💳 Mi Tarjeta</h2>
      <p className="screen-subtitle">Información de tu tarjeta de identificación</p>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setScreen("home")} className="back-button">
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export const ContactScreen: React.FC<SimpleScreenProps> = ({ setScreen }) => {
  return (
    <div className="screen-card">
      <h2 className="screen-title">📞 Contacto de Emergencia</h2>
      <p className="screen-subtitle">Gestión de contactos de emergencia</p>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => setScreen("home")} className="back-button-alt">
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};