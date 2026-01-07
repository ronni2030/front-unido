import React from 'react';

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface ProfileScreenNewProps {
  userData: UserData;
  isFillingProfile: boolean;
  editField: string;
  startVoiceInput: (field: string) => void;
  fillProfileWithVoice: () => void;
  deleteProfile: () => void;
  saveToDatabase: (userData: UserData) => void;
  setScreen: (screen: string) => void;
}

export const ProfileScreenNew: React.FC<ProfileScreenNewProps> = ({
  userData,
  isFillingProfile,
  editField,
  startVoiceInput,
  fillProfileWithVoice,
  deleteProfile,
  saveToDatabase,
  setScreen
}) => {
  return (
    <div className="profile-card">
      <h2 className="profile-title">Mi Perfil</h2>
      
      {isFillingProfile && (
        <div className="profile-filling-alert">
          <p className="profile-filling-text">🎤 Llenando perfil por voz...</p>
        </div>
      )}
      
      <div className="profile-avatar-container">
        <div className="profile-avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7A3EB1" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
      
      <div className="profile-fields">
        <div className="profile-field">
          <label className="profile-field-label">Nombre Completo</label>
          <div className="profile-field-row">
            <p className="profile-field-value">{userData.name || 'No especificado'}</p>
            <button
              onClick={() => startVoiceInput('name')}
              disabled={editField === 'name' || isFillingProfile}
              className="profile-edit-button"
            >
              {editField === 'name' ? '🎤' : '✏️'}
            </button>
          </div>
        </div>
        
        <div className="profile-field">
          <label className="profile-field-label">Correo Electrónico</label>
          <div className="profile-field-row">
            <p className="profile-field-value">{userData.email || 'No especificado'}</p>
            <button
              onClick={() => startVoiceInput('email')}
              disabled={editField === 'email' || isFillingProfile}
              className="profile-edit-button"
            >
              {editField === 'email' ? '🎤' : '✏️'}
            </button>
          </div>
        </div>
        
        <div className="profile-field">
          <label className="profile-field-label">Número de Teléfono</label>
          <div className="profile-field-row">
            <p className="profile-field-value">{userData.phone || 'No especificado'}</p>
            <button
              onClick={() => startVoiceInput('phone')}
              disabled={editField === 'phone' || isFillingProfile}
              className="profile-edit-button"
            >
              {editField === 'phone' ? '🎤' : '✏️'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="profile-actions">
        <button 
          onClick={fillProfileWithVoice}
          disabled={isFillingProfile}
          className="profile-action-button profile-voice-button"
        >
          🎤 Llenar por Voz
        </button>
        <button 
          onClick={deleteProfile}
          className="profile-action-button profile-delete-button"
        >
          🗑️ Eliminar Perfil
        </button>
        <button 
          onClick={() => setScreen("home")}
          className="profile-action-button profile-back-button"
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};