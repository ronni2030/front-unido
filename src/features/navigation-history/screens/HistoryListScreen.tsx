//la pantalla de Historial de Rutas
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout/Layout';
import { speak } from '../../../shared/utils/voiceUtils';
import { historyService } from '../services/historyService';
import type { Route } from '../types/history.types';

export const HistoryListScreen: React.FC = () => {
  const [history, setHistory] = useState<Route[]>([]);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Función para cargar datos desde el servicio
  const loadData = async () => {
    const data = await historyService.getHistory();
    // Tomamos las 5 rutas más recientes para facilitar el dictado
    const recentData = data.slice(0, 5);
    setHistory(recentData);
    return recentData;
  };

  // Efecto inicial: Carga y Bienvenida automática
  useEffect(() => {
    const init = async () => {
      const currentHistory = await loadData();
      if (currentHistory.length === 0) {
        await speak("Tu historial de rutas está vacío. Volviendo al inicio.");
        navigate('/');
      } else {
        let message = `Tienes ${currentHistory.length} rutas guardadas. `;
        const ordinalNames = ["primera", "segunda", "tercera", "cuarta", "quinta"];

        currentHistory.forEach((route, index) => {
          message += `${ordinalNames[index]} ruta: hacia ${decodeURIComponent(route.destination)}. `;
        });

        await speak(message + "Di: IR A, ELIMINAR o FAVORITA, seguido del número de ruta. O di VOLVER.");
        startVoiceRecognition(currentHistory);
      }
    };
    init();

    // Limpiar voz si el usuario sale de la pantalla
    return () => window.speechSynthesis.cancel();
  }, [navigate]);

  // Motor de reconocimiento de voz
  const startVoiceRecognition = (currentHistory: Route[]) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log("Comando recibido:", command);

      // Comandos de navegación básica
      if (command.includes("volver") || command.includes("atrás") || command.includes("inicio")) {
        await speak("Volviendo al menú principal.");
        navigate('/');
        return;
      }

      // Diccionario para detectar qué número de ruta mencionó el usuario
      const numbersMap: { [key: string]: number } = {
        "uno": 0, "1": 0, "primera": 0, "primer": 0,
        "dos": 1, "2": 1, "segunda": 1,
        "tres": 2, "3": 2, "tercera": 2,
        "cuatro": 3, "4": 3, "cuarta": 3,
        "cinco": 4, "5": 4, "quinta": 4
      };

      let targetIndex = -1;
      Object.keys(numbersMap).forEach(key => {
        if (command.includes(key)) targetIndex = numbersMap[key];
      });

      // Ejecutar acción basada en la palabra clave + número
      if (targetIndex !== -1 && currentHistory[targetIndex]) {
        const selectedRoute = currentHistory[targetIndex];

        if (command.includes("eliminar") || command.includes("borrar")) {
          handleDelete(selectedRoute.id);
        }
        else if (command.includes("favorita") || command.includes("preferida") || command.includes("estrella")) {
          handleToggleFavorite(selectedRoute);
        }
        else if (command.includes("ir") || command.includes("navegar") || command.includes("repetir") || command.includes("ruta")) {
          handleRepeat(selectedRoute);
        }
      }
      else {
        await speak("No te entendí bien. Di por ejemplo: Eliminar ruta uno.");
        // Reintentar escucha tras error
        setTimeout(() => startVoiceRecognition(currentHistory), 1500);
      }
    };

    recognition.start();
  };

  const handleDelete = async (id: string) => {
    try {
      await historyService.deleteRoute(id);
      await speak("Ruta eliminada.");
      const updated = await loadData();
      startVoiceRecognition(updated); // Reinicia escucha con datos frescos
    } catch (error) {
      await speak("Error al intentar eliminar.");
    }
  };

  const handleToggleFavorite = async (route: Route) => {
    try {
      const updatedRoute = { ...route, isFavorite: !route.isFavorite };
      await historyService.saveRoute(updatedRoute);

      const feedback = updatedRoute.isFavorite ? "Añadida a favoritas." : "Quitada de favoritas.";
      await speak(feedback);

      const updated = await loadData();
      startVoiceRecognition(updated);
    } catch (error) {
      await speak("No se pudo actualizar favoritos.");
    }
  };

  const handleRepeat = async (route: Route) => {
    await speak(`Iniciando navegación hacia ${decodeURIComponent(route.destination)}.`);
    // Aquí rediriges a la pantalla de guía activa si la tienes
    console.log("Navegando a:", route);
  };

  return (
    <Layout>
      <div className="dashboard-container" style={{ paddingBottom: '40px' }}>
        <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          {isListening ? "🎤 ESCUCHANDO..." : "MIS RUTAS"}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {history.map((route, index) => (
            <div
              key={route.id}
              className="info-card"
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '20px',
                borderLeft: `15px solid ${route.isFavorite ? '#f1c40f' : '#6c5ce7'}`,
                color: '#2d3436',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#eee', padding: '2px 8px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    {index + 1}
                  </span>
                  <span style={{ fontSize: '12px', color: '#636e72' }}>{route.date}</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {decodeURIComponent(route.destination)}
                </p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Origen: {decodeURIComponent(route.origin)}</p>
              </div>

              <div style={{ fontSize: '30px' }}>
                {route.isFavorite ? "⭐" : "📍"}
              </div>
            </div>
          ))}
        </div>

        {/* Guía de ayuda visual */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '15px',
          borderRadius: '15px'
        }}>
          <p style={{ margin: '5px 0' }}>Di: <strong>"Ir a la uno"</strong>, <strong>"Eliminar dos"</strong></p>
          <p style={{ margin: '5px 0' }}>o <strong>"Favorita tres"</strong></p>
        </div>
      </div>
    </Layout>
  );
};