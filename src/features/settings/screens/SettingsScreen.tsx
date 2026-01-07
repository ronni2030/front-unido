import { useState } from 'react';
import { useVoiceControl } from '../hooks/useVoiceControl';

type Vista = 'ajustes' | 'registro';
type Idioma = 'ES' | 'EN';

function SettingsScreen() {
  const [vista, setVista] = useState<Vista>('ajustes');
  const [idioma, setIdioma] = useState<Idioma>('ES');
  const [volumen, setVolumen] = useState(75);
  const [velocidad, setVelocidad] = useState(1);

  const textos = {
    ES: {
      titulo: 'AJUSTES',
      registro: 'REGISTRO',
      lang: 'IDIOMA',
      vol: 'VOLUMEN',
      vel: 'VELOCIDAD',

      bienvenida: 'Bienvenido. El sistema de voz está listo.',
      descripcionGeneral:
        'Puedes navegar por voz, cambiar idioma, volumen y velocidad.',

      ajustesDesc:
        'Estás en ajustes. Di idioma, subir volumen, bajar volumen, más rápido, más lento o registro.',
      registroDesc:
        'Estás en registro. Di guardar, restablecer o ajustes.',

      volumenSube: 'Volumen aumentado.',
      volumenBaja: 'Volumen reducido.',
      velocidadSube: 'Velocidad aumentada.',
      velocidadBaja: 'Velocidad reducida.',

      guardado: 'Datos guardados correctamente.',
      reset: 'Datos restablecidos.',
    },
    EN: {
      titulo: 'SETTINGS',
      registro: 'LOGS',
      lang: 'LANGUAGE',
      vol: 'VOLUME',
      vel: 'SPEED',

      bienvenida: 'Welcome. Voice system ready.',
      descripcionGeneral:
        'You can navigate by voice, change language, volume and speed.',

      ajustesDesc:
        'You are in settings. Say language, volume up, volume down, faster, slower or logs.',
      registroDesc:
        'You are in logs. Say save, reset or settings.',

      volumenSube: 'Volume increased.',
      volumenBaja: 'Volume decreased.',
      velocidadSube: 'Speed increased.',
      velocidadBaja: 'Speed decreased.',

      guardado: 'Data saved successfully.',
      reset: 'Data reset.',
    },
  };

  useVoiceControl({
    vista,
    idioma,
    volumen,
    velocidad,
    setVista,
    setIdioma,
    setVolumen,
    setVelocidad,
    textos,
  });

  const t = textos[idioma];

 

  return (
    <div className="mobile-shell">
      <header className="fluid-header">
        <h1>{vista === 'ajustes' ? t.titulo : t.registro}</h1>
      </header>

      

      <main className="app-main">
        {vista === 'ajustes' ? (
          <div className="view-container">
            <div
              className="glass-item anim-press"
              onClick={() => setIdioma(idioma === 'ES' ? 'EN' : 'ES')}
            >
              <div className="item-icon">🌐</div>
              <div className="item-info">
                <label>{t.lang}</label>
                <p>{idioma === 'ES' ? 'Español' : 'English'}</p>
              </div>
            </div>

            <div className="glass-item">
              <div className="item-icon">🔊</div>
              <div className="item-info" style={{ flex: 1 }}>
                <label>{t.vol}</label>
                <input
                  type="range"
                  value={volumen}
                  onChange={e => setVolumen(+e.target.value)}
                />
                <p>{volumen}%</p>
              </div>
            </div>

            <div className="glass-item">
              <div className="item-icon">⚡</div>
              <div className="item-info" style={{ flex: 1 }}>
                <label>{t.vel}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={velocidad}
                  onChange={e => setVelocidad(+e.target.value)}
                />
                <p>{velocidad}x</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="view-container log-card">
            <div><b>{t.lang}:</b> {idioma}</div>
            <div><b>{t.vol}:</b> {volumen}%</div>
            <div><b>{t.vel}:</b> {velocidad}x</div>
          </div>
        )}
      </main>

      <nav className="bottom-dock">
        <div
          className={`nav-btn ${vista === 'ajustes' ? 'active' : ''}`}
          onClick={() => setVista('ajustes')}
        >
          ⚙️
        </div>
        <div
          className={`nav-btn ${vista === 'registro' ? 'active' : ''}`}
          onClick={() => setVista('registro')}
        >
          📋
        </div>
      </nav>
    </div>
  );
  
}

export default SettingsScreen;


