import React from 'react';

interface BottomNavigationProps {
  screen: string;
  setScreen: (screen: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ screen, setScreen }) => {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    )},
    { id: 'navigation', label: 'Guía', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="3,11 22,2 13,21 11,13 3,11"/>
      </svg>
    )},
    { id: 'favorites', label: 'Favoritos', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
      </svg>
    )},
    { id: 'card', label: 'Tarjeta', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )},
    { id: 'contact', label: 'Contacto', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    )},
    { id: 'profile', label: 'Perfil', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )},
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id)}
          className={`nav-button ${screen === item.id ? 'active' : ''}`}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className={`nav-label ${screen === item.id ? 'active' : 'inactive'}`}>{item.label}</div>
        </button>
      ))}
    </div>
  );
};