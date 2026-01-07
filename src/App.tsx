import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Styles.css'; // 🔹 Agregamos los estilos del primer componente

import { Header } from './features/users/components/Header';
import { BottomNavigation } from './features/users/components/BottomNavigation';
import { DashboardScreen } from './features/dashboard/screens/DashboardScreen';
import { ProfileScreenNew } from './features/users/screens/ProfileScreenNew';
import { NavigationScreen, FavoritesScreen, CardScreen, ContactScreen } from './features/users/screens/SimpleScreens';
import { useDashboard } from './features/dashboard/hooks/useDashboard';
import { useProfile } from './features/users/useProfile';
import { VoiceService as UsersVoiceService } from './features/users/services/voice';

// Importaciones de identificación
import { CardSetupScreen } from './features/identification-card/screens/CardSetupScreen';
import { CardViewScreen } from './features/identification-card/screens/CardViewScreen';
import { CardUpdateScreen } from './features/identification-card/screens/CardUpdateScreen';

// Importaciones de navegación e historial
import { DestinationScreen } from './features/navigation/screens/DestinationScreen';
import { HistoryListScreen } from './features/navigation-history/screens/HistoryListScreen';
import { LocationScreen } from './features/navigation/screens/LocationScreen';

// Importaciones de lugares favoritos
import { FavoritePlacesListScreen } from './features/places/screens/FavoritePlacesListScreen';
import { AddPlaceScreen } from './features/places/screens/AddPlaceScreen';
import { PlaceDetailScreen } from './features/places/screens/PlaceDetailScreen';

// Importación del dashboard y prueba de conexión
import { Dashboard } from './features/dashboard/screens/Dashboard';
import { ConnectionTest as ConnectionTestScreen } from './components/ConnectionTest';

// 🔹 IMPORTACIÓN DE LA API UNIFICADA
import { api } from './services/api/api';

// 🔹 TIPOS PARA LA VISTA DE AJUSTES DE VOZ
type VistaVoz = 'ajustes' | 'registro';
type Idioma = 'ES' | 'EN';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

function App() {
  // 🔹 ESTADOS PARA LA VISTA DE AJUSTES DE VOZ
  const [vistaVoz, setVistaVoz] = useState<VistaVoz>('ajustes');
  const [idioma, setIdioma] = useState<Idioma>('ES');
  const [volumen, setVolumen] = useState(75);
  const [velocidad, setVelocidad] = useState(1);
  
  const recognitionRef = useRef<any>(null);
  const speakingRef = useRef(false);
  const bienvenidaRef = useRef(false);

  // 🔹 ESTADOS PARA LA APP PRINCIPAL
  const [screen, setScreen] = useState("home");
  const { isListening, startListening } = useDashboard();
  const {
    userData,
    editField,
    isFillingProfile,
    startVoiceInput,
    fillProfileWithVoice,
    deleteProfile,
    saveToDatabase
  } = useProfile();

  // 🔹 TEXTO MULTILENGUAJE
  const textos = {
    ES: {
      titulo: 'AJUSTES DE VOZ',
      registro: 'REGISTRO DE VOZ',
      lang: 'IDIOMA',
      vol: 'VOLUMEN',
      vel: 'VELOCIDAD',
      bienvenida: 'Bienvenido. El sistema de voz está listo.',
      ajustesDesc:
        'Estás en ajustes de voz. Puedes decir: cambiar idioma, subir volumen, bajar volumen, volumen máximo, volumen mínimo, hablar más rápido, hablar más lento, ajustes predeterminados, o ir a registro.',
      registroDesc:
        'Estás en registro de voz. Puedes decir: guardar datos, restablecer o volver a ajustes.',
      guardado: 'Configuración de voz guardada correctamente',
      reset: 'Configuración de voz restablecida',
    },
    EN: {
      titulo: 'VOICE SETTINGS',
      registro: 'VOICE LOGS',
      lang: 'LANGUAGE',
      vol: 'VOLUME',
      vel: 'SPEED',
      bienvenida: 'Welcome. Voice system ready.',
      ajustesDesc:
        'You are in voice settings. You can say: change language, increase volume, decrease volume, maximum volume, minimum volume, speak faster, speak slower, default settings, or go to logs.',
      registroDesc:
        'You are in voice logs. You can say: save data, reset or go back to settings.',
      guardado: 'Voice settings saved successfully',
      reset: 'Voice settings reset',
    },
  };

  const t = textos[idioma];

  // 🔹 FUNCIÓN MEJORADA PARA GUARDAR CONFIGURACIÓN DE VOZ
  async function guardarConfiguracionVoz() {
    try {
      console.log('🔄 Guardando configuración de voz...');
      await api.guardarDatos({
        idioma,
        volumen,
        velocidad,
      });
      hablar(t.guardado);
    } catch (error) {
      console.error('❌ Error al guardar configuración de voz:', error);
      if (error instanceof Error) {
        if (error.message.includes('foreign key')) {
          hablar('Error: No existe el mensaje asociado. Por favor contacta al administrador.');
        } else {
          hablar('Error al guardar configuración de voz. Intenta nuevamente.');
        }
      }
    }
  }

  // 🔹 FUNCIÓN DE HABLAR UNIFICADA
  function hablar(texto: string) {
    if (!window.speechSynthesis) return;
    speakingRef.current = true;
    
    // Detener reconocimiento si está activo
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = idioma === 'ES' ? 'es-ES' : 'en-US';
    u.rate = velocidad;
    u.volume = volumen / 100;

    u.onend = () => {
      speakingRef.current = false;
      // Solo reiniciar escucha si estamos en la vista de voz
      if (screen === 'voice-settings') {
        iniciarEscuchaVoz();
      }
    };
    window.speechSynthesis.speak(u);
  }

  // 🔹 INICIAR ESCUCHA PARA LA VISTA DE AJUSTES DE VOZ
  function iniciarEscuchaVoz() {
    if (!SpeechRecognition || speakingRef.current) return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = idioma === 'ES' ? 'es-ES' : 'en-US';
    recognition.continuous = false;

    recognition.onresult = (e: any) => {
      const cmd = e.results[0][0].transcript.toLowerCase();
      console.log('🎙️ Comando de voz:', cmd);

      // ===== IDIOMA =====
      if (cmd.includes('idioma') || cmd.includes('language')) {
        setIdioma(idioma === 'ES' ? 'EN' : 'ES');
        hablar('Idioma cambiado');
        return;
      }

      // ===== VISTAS =====
      if (cmd.includes('registro') || cmd.includes('logs')) {
        setVistaVoz('registro');
        return;
      }

      if (cmd.includes('ajustes') || cmd.includes('settings')) {
        setVistaVoz('ajustes');
        return;
      }

      // ===== VOLVER A LA APP PRINCIPAL =====
      if (cmd.includes('volver') || cmd.includes('back') || cmd.includes('regresar')) {
        setScreen('home');
        hablar('Volviendo a la aplicación principal');
        return;
      }

      // ===== GUARDAR =====
      if (cmd.includes('guardar') || cmd.includes('save')) {
        guardarConfiguracionVoz();
        return;
      }

      // ===== RESET =====
      if (cmd.includes('restablecer') || cmd.includes('reset')) {
        setIdioma('ES');
        setVolumen(75);
        setVelocidad(1);
        hablar(t.reset);
        return;
      }

      // ===== VOLUMEN =====
      if (cmd.includes('subir') && cmd.includes('volumen')) {
        const nuevo = Math.min(100, volumen + 10);
        setVolumen(nuevo);
        hablar(`Volumen aumentado a ${nuevo}`);
        return;
      }

      if (cmd.includes('bajar') && cmd.includes('volumen')) {
        const nuevo = Math.max(0, volumen - 10);
        setVolumen(nuevo);
        hablar(`Volumen reducido a ${nuevo}`);
        return;
      }

      if (cmd.includes('volumen') && (cmd.includes('máximo') || cmd.includes('maximo') || cmd.includes('maximum'))) {
        setVolumen(100);
        hablar('Volumen ajustado al máximo');
        return;
      }

      if (cmd.includes('volumen') && (cmd.includes('mínimo') || cmd.includes('minimo') || cmd.includes('minimum'))) {
        setVolumen(0);
        hablar('Volumen ajustado al mínimo');
        return;
      }

      // ===== VELOCIDAD =====
      if (cmd.includes('más rápido') || cmd.includes('mas rapido') || cmd.includes('faster')) {
        const nueva = Math.min(2, velocidad + 0.1);
        setVelocidad(nueva);
        hablar(`Velocidad aumentada a ${nueva.toFixed(1)}`);
        return;
      }

      if (cmd.includes('más lento') || cmd.includes('mas lento') || cmd.includes('slower')) {
        const nueva = Math.max(0.5, velocidad - 0.1);
        setVelocidad(nueva);
        hablar(`Velocidad reducida a ${nueva.toFixed(1)}`);
        return;
      }

      // ===== AJUSTES PREDETERMINADOS =====
      if (cmd.includes('ajustes predeterminados') || cmd.includes('default settings')) {
        setVolumen(75);
        setVelocidad(1);
        hablar('Ajustes restablecidos a valores predeterminados');
        return;
      }

      // ===== AJUSTES NUMÉRICOS =====
      const volumenMatch = cmd.match(/volumen (\d+)/);
      const velocidadMatch = cmd.match(/velocidad (\d+(?:\.\d+)?)/);

      if (volumenMatch && velocidadMatch) {
        const nuevoVolumen = Math.min(100, Math.max(0, parseInt(volumenMatch[1])));
        const nuevaVelocidad = Math.min(2, Math.max(0.5, parseFloat(velocidadMatch[1])));
        
        setVolumen(nuevoVolumen);
        setVelocidad(nuevaVelocidad);
        hablar(`Ajustados volumen a ${nuevoVolumen} y velocidad a ${nuevaVelocidad.toFixed(1)}`);
        return;
      }

      if (volumenMatch) {
        const nuevoVolumen = Math.min(100, Math.max(0, parseInt(volumenMatch[1])));
        setVolumen(nuevoVolumen);
        hablar(`Volumen ajustado a ${nuevoVolumen}`);
        return;
      }

      if (velocidadMatch) {
        const nuevaVelocidad = Math.min(2, Math.max(0.5, parseFloat(velocidadMatch[1])));
        setVelocidad(nuevaVelocidad);
        hablar(`Velocidad ajustada a ${nuevaVelocidad.toFixed(1)}`);
        return;
      }

      // ===== COMANDO NO RECONOCIDO =====
      hablar('Comando no reconocido en ajustes de voz');
    };

    recognition.onend = () => {
      if (!speakingRef.current && screen === 'voice-settings') {
        try {
          recognition.start();
        } catch {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {}
  }

  // 🔹 EFFECTS PARA LA VISTA DE AJUSTES DE VOZ
  useEffect(() => {
    if (screen === 'voice-settings') {
      if (!bienvenidaRef.current) {
        hablar(t.bienvenida);
        bienvenidaRef.current = true;
        setTimeout(() => {
          iniciarEscuchaVoz();
        }, 1000);
        return;
      }
      hablar(vistaVoz === 'ajustes' ? t.ajustesDesc : t.registroDesc);
    }
  }, [vistaVoz, idioma, screen]);

  // 🔹 EFFECTS PARA LA APP PRINCIPAL
  const handleStartListening = () => {
    startListening(setScreen);
  };

  useEffect(() => {
    if (screen === "home") {
      UsersVoiceService.speak("Bienvenido al inicio. Aplaste en el centro");
    } else if (screen === "profile") {
      const hasData = userData.name || userData.email || userData.phone;
      if (!hasData && !isFillingProfile) {
        setTimeout(() => {
          fillProfileWithVoice();
        }, 500);
      }
    } else if (screen !== 'voice-settings') {
      UsersVoiceService.speak(`Se abrió ${screen}`);
    }
  }, [screen]);

  useEffect(() => {
    const handleNavigation = (event: any) => {
      setScreen(event.detail);
    };

    window.addEventListener('navigateTo', handleNavigation);
    return () => window.removeEventListener('navigateTo', handleNavigation);
  }, []);

  // 🔹 COMPONENTE DE AJUSTES DE VOZ
  const VoiceSettingsScreen = () => (
    <div className="mobile-shell">
      <header className="fluid-header">
        <h1>{vistaVoz === 'ajustes' ? t.titulo : t.registro}</h1>
      </header>

      <main className="app-main">
        {vistaVoz === 'ajustes' ? (
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
                  onChange={(e) => setVolumen(+e.target.value)}
                  className="vol-slider"
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
                  onChange={(e) => setVelocidad(+e.target.value)}
                  className="vol-slider"
                />
                <p>{velocidad}x</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="view-container log-card">
            <div className="log-row">
              <p>{t.lang}:</p> <b>{idioma}</b>
            </div>
            <div className="log-row">
              <p>{t.vol}:</p> <b>{volumen}%</b>
            </div>
            <div className="log-row">
              <p>{t.vel}:</p> <b>{velocidad}x</b>
            </div>

            <button
              className="delete-trigger anim-press"
              onClick={guardarConfiguracionVoz}
            >
              Guardar configuración de voz
            </button>

            <button
              className="delete-trigger anim-press"
              style={{ backgroundColor: '#441a2a', marginTop: '20px' }}
              onClick={() => {
                setIdioma('ES');
                setVolumen(75);
                setVelocidad(1);
                hablar(t.reset);
              }}
            >
              Restablecer configuración de voz
            </button>
          </div>
        )}
      </main>

      <nav className="bottom-dock">
        <div
          className={`nav-btn ${vistaVoz === 'ajustes' ? 'active' : ''}`}
          onClick={() => setVistaVoz('ajustes')}
        >
          ⚙️
        </div>
        <div
          className={`nav-btn ${vistaVoz === 'registro' ? 'active' : ''}`}
          onClick={() => setVistaVoz('registro')}
        >
          📋
        </div>
        <div
          className="nav-btn"
          onClick={() => {
            setScreen('home');
            hablar('Volviendo a la aplicación principal');
          }}
        >
          ↩️
        </div>
      </nav>
    </div>
  );

  // 🔹 COMPONENTE PRINCIPAL DE LA APP
  const MainApp = () => (
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        {screen === "home" && (
          <DashboardScreen 
            isListening={isListening} 
            startListening={handleStartListening} 
          />
        )}
        
        {screen === "profile" && (
          <ProfileScreenNew 
            userData={userData}
            isFillingProfile={isFillingProfile}
            editField={editField}
            startVoiceInput={startVoiceInput}
            fillProfileWithVoice={fillProfileWithVoice}
            deleteProfile={deleteProfile}
            saveToDatabase={saveToDatabase}
            setScreen={setScreen}
          />
        )}
        
        {screen === "voice-settings" && <VoiceSettingsScreen />}
        {screen === "navigation" && <NavigationScreen setScreen={setScreen} />}
        {screen === "favorites" && <FavoritesScreen setScreen={setScreen} />}
        {screen === "card" && <CardScreen setScreen={setScreen} />}
        {screen === "contact" && <ContactScreen setScreen={setScreen} />}
      </div>
      
      <BottomNavigation 
        screen={screen} 
        setScreen={setScreen}
        // 🔹 Agregar opción de ajustes de voz al menú
        additionalItems={[
          {
            id: 'voice-settings',
            icon: '🎤',
            label: 'Voz',
            onClick: () => setScreen('voice-settings')
          }
        ]}
      />
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* RUTAS CON NAVEGACIÓN POR ESTADO (screen) */}
        <Route path="/old" element={<MainApp />} />
        <Route path="/legacy" element={<MainApp />} />
        
        {/* MENÚ PRINCIPAL: Dashboard como raíz */}
        <Route path="/" element={<Dashboard />} />
        
        {/* RUTAS DE IDENTIFICACIÓN */}
        <Route path="/setup-card" element={<CardSetupScreen />} />
        <Route path="/view-card" element={<CardViewScreen />} />
        <Route path="/update-card" element={<CardUpdateScreen />} />
        
        {/* RUTAS DE NAVEGACIÓN GPS Y VOZ */}
        <Route path="/location" element={<LocationScreen />} />
        <Route path="/new-route" element={<DestinationScreen />} />
        
        {/* RUTA DE HISTORIAL */}
        <Route path="/history-list" element={<HistoryListScreen />} />
        
        {/* RUTAS DE LUGARES FAVORITOS */}
        <Route path="/places" element={<FavoritePlacesListScreen />} />
        <Route path="/places/add" element={<AddPlaceScreen />} />
        <Route path="/places/:id" element={<PlaceDetailScreen />} />
        
        {/* RUTA DE PRUEBA DE CONEXIÓN */}
        <Route path="/test-connection" element={<ConnectionTestScreen />} />
        
        {/* RUTA DE AJUSTES DE VOZ */}
        <Route path="/voice-settings" element={<VoiceSettingsScreen />} />
        
        {/* RUTAS COMPATIBILIDAD CON EL SISTEMA DE SCREENS */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/profile" element={
          <MainAppWrapper initialScreen="profile" />
        } />
        <Route path="/navigation" element={
          <MainAppWrapper initialScreen="navigation" />
        } />
        <Route path="/favorites" element={
          <MainAppWrapper initialScreen="favorites" />
        } />
        <Route path="/card" element={
          <MainAppWrapper initialScreen="card" />
        } />
        <Route path="/contact" element={
          <MainAppWrapper initialScreen="contact" />
        } />
        <Route path="/voice" element={
          <MainAppWrapper initialScreen="voice-settings" />
        } />
        
        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// 🔹 COMPONENTE WRAPPER PARA INICIALIZAR CON UNA SCREEN ESPECÍFICA
const MainAppWrapper = ({ initialScreen }: { initialScreen: string }) => {
  const [screen, setScreen] = useState(initialScreen);
  const { isListening, startListening } = useDashboard();
  const {
    userData,
    editField,
    isFillingProfile,
    startVoiceInput,
    fillProfileWithVoice,
    deleteProfile,
    saveToDatabase
  } = useProfile();

  const handleStartListening = () => {
    startListening(setScreen);
  };

  useEffect(() => {
    if (screen === "home") {
      UsersVoiceService.speak("Bienvenido al inicio. Aplaste en el centro");
    } else if (screen === "profile") {
      const hasData = userData.name || userData.email || userData.phone;
      if (!hasData && !isFillingProfile) {
        setTimeout(() => {
          fillProfileWithVoice();
        }, 500);
      }
    } else {
      UsersVoiceService.speak(`Se abrió ${screen}`);
    }
  }, [screen]);

  useEffect(() => {
    const handleNavigation = (event: any) => {
      setScreen(event.detail);
    };

    window.addEventListener('navigateTo', handleNavigation);
    return () => window.removeEventListener('navigateTo', handleNavigation);
  }, []);

  return (
    <div className="app-container">
      <Header />
      
      <div className="main-content">
        {screen === "home" && (
          <DashboardScreen 
            isListening={isListening} 
            startListening={handleStartListening} 
          />
        )}
        
        {screen === "profile" && (
          <ProfileScreenNew 
            userData={userData}
            isFillingProfile={isFillingProfile}
            editField={editField}
            startVoiceInput={startVoiceInput}
            fillProfileWithVoice={fillProfileWithVoice}
            deleteProfile={deleteProfile}
            saveToDatabase={saveToDatabase}
            setScreen={setScreen}
          />
        )}
        
        {screen === "navigation" && <NavigationScreen setScreen={setScreen} />}
        {screen === "favorites" && <FavoritesScreen setScreen={setScreen} />}
        {screen === "card" && <CardScreen setScreen={setScreen} />}
        {screen === "contact" && <ContactScreen setScreen={setScreen} />}
      </div>
      
      <BottomNavigation screen={screen} setScreen={setScreen} />
    </div>
  );
};

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Página no encontrada</p>
        <a href="/" className="big-button primary">
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}

export default App;