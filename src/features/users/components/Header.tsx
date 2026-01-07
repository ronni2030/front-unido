import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-logo">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <h1 className="header-title">OpenBlind</h1>
    </div>
  );
};