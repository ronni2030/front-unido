// Genera la targeta con el qr
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout/Layout';
import { speak } from '../../../shared/utils/voiceUtils';
import type { IdentificationCard } from '../types/card.types';

export const CardViewScreen: React.FC = () => {
  const navigate = useNavigate();
  const [card, setCard] = useState<IdentificationCard | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('user_id_card');
    if (savedData) {
      const data = JSON.parse(savedData);
      setCard(data);

      const announce = async () => {
        // La voz explica todas las opciones disponibles
        await speak(
          `Tarjeta de ${data.name}. Sangre ${data.bloodType}. Alergias: ${data.allergies}. ` +
          `Di EDITAR para cambiar los datos, ELIMINAR para borrar la tarjeta, o INICIO para salir.`
        );
        startVoiceCommand(); // Se activa solo al terminar de hablar
      };
      announce();
    } else {
      navigate('/setup-card');
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [navigate]);

  const startVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false; // Escucha una orden y procesa

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log("Comando recibido:", command);

      if (command.includes("editar") || command.includes("cambiar")) {
        await speak("Abriendo el editor.");
        navigate('/update-card');
      }
      else if (command.includes("eliminar") || command.includes("borrar")) {
        handleDeleteFlow(); // Nueva función manos libres para borrar
      }
      else if (command.includes("inicio") || command.includes("volver")) {
        await speak("Volviendo al menú principal.");
        navigate('/');
      }
      else {
        await speak("No te entendí. Di editar, eliminar o inicio.");
        // Pequeño delay para que no se pise con la voz de la app
        setTimeout(() => startVoiceCommand(), 1500);
      }
    };

    recognition.start();
  };

  // Flujo de eliminación manos libres
  const handleDeleteFlow = async () => {
    await speak("¿Seguro que quieres eliminar esta tarjeta? Di CONFIRMAR para borrar o CANCELAR para mantenerla.");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const confirmRec = new SpeechRecognition();
    confirmRec.lang = 'es-ES';

    confirmRec.onresult = async (event: any) => {
      const response = event.results[0][0].transcript.toLowerCase();
      if (response.includes("confirmar")) {
        localStorage.removeItem('user_id_card');
        await speak("Tarjeta eliminada. Volviendo al inicio.");
        navigate('/');
      } else {
        await speak("Eliminación cancelada.");
        startVoiceCommand(); // Regresa a escuchar comandos normales
      }
    };
    confirmRec.start();
  };

  if (!card) return null;

  const qrData = `NOMBRE: ${card.name} | SANGRE: ${card.bloodType} | ALERGIAS: ${card.allergies}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <Layout>
      <header className="drip-header">
        <h1>{isListening ? "🎤 ESCUCHANDO..." : "MI TARJETA"}</h1>
      </header>

      <div className="dashboard-container" style={{ alignItems: 'center' }}>
        {/* TARJETA VISUAL */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          width: '100%',
          borderRadius: '30px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(75, 31, 111, 0.6), rgba(122, 62, 177, 0.6))',
            padding: '24px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '22px', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              IDENTIFICACIÓN MÉDICA
            </h2>
          </div>

          <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                👤 NOMBRE
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: '800', color: 'var(--accent)' }}>
                {card.name}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  🩸 SANGRE
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: '800', color: '#FF4D8D' }}>
                  {card.bloodType}
                </p>
              </div>
              <div style={{ flex: 2, textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  ⚠️ ALERGIAS
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '700', color: 'white' }}>
                  {card.allergies}
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '10px',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '25px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <img src={qrUrl} alt="QR" style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
            </div>
          </div>
        </div>

        {/* BOTONES (Informativos) */}
        <div className="info-card" style={{ marginTop: '10px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
            Comandos de voz:
          </p>
          <p style={{ margin: '8px 0 0', color: 'var(--primary)', fontWeight: '700' }}>
            "EDITAR", "ELIMINAR" o "VOLVER"
          </p>
        </div>
      </div>
    </Layout>
  );
};