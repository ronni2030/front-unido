import React from 'react';

interface DashboardScreenProps {
  isListening: boolean;
  startListening: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ isListening, startListening }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h2 className="home-title">Bienvenido a OpenBlind</h2>
        <p className="home-subtitle">Sistema de navegación para personas con discapacidad visual</p>
      
        <div className="listen-container">
          <button
            onClick={startListening}
            disabled={isListening}
            className={`listen-button ${isListening ? 'disabled' : ''}`}
          >
            <span className="emoji">🔊</span>
          </button>
          <p className="listen-text">
            {isListening ? 'ESCUCHANDO...' : 'ESCUCHAR'}
          </p>
        </div>
      </div>
    </div>
  );
};