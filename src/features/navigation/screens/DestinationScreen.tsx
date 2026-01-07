import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { speak } from '../../../shared/utils/voiceUtils';
import { locationService } from '../../../shared/services/locationService';
import { historyService } from '../../navigation-history/services/historyService';
import { Navigation, ArrowLeft } from 'lucide-react';
import { VoiceWaveform } from '../../../shared/components/VoiceWaveform';

import { Layout } from '../../../shared/components/layout/Layout';

export const DestinationScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTarget = queryParams.get('target');

  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState("Iniciando...");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const initFlow = async () => {
      await startNavigationFlow();
    };
    initFlow();

    return () => window.speechSynthesis.cancel();
  }, []);

  const listen = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return reject("No soportado");

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => resolve(event.results[0][0].transcript);
      recognition.onerror = (err: any) => reject(err.error);
      recognition.start();
    });
  };

  const startNavigationFlow = async () => {
    setStatusText("Obteniendo GPS...");
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
        });
      });

      const originStreet = await locationService.getAddressFromCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );
      setOrigin(originStreet);

      let finalDestiny = initialTarget;

      if (!finalDestiny) {
        setStatusText("Esperando destino...");
        await speak(`Te encuentras en ${originStreet}. ¿A dónde quieres ir?`);
        finalDestiny = await listen();
      }

      if (finalDestiny.toLowerCase().includes("cancelar") || finalDestiny.toLowerCase().includes("salir")) {
        await speak("Navegación cancelada.");
        navigate('/');
        return;
      }

      const decodedOrigin = decodeURIComponent(originStreet);
      const decodedDestiny = decodeURIComponent(finalDestiny);

      setStatusText("Ruta confirmada");
      await speak(`Perfecto. Iniciando ruta desde ${decodedOrigin} hacia ${decodedDestiny}.`);

      const newRoute = {
        id: '', // Crear
        origin: decodedOrigin,
        destination: decodedDestiny,
        date: new Date().toLocaleDateString(),
        duration: "15 min", // Mock duration
        isFavorite: false
      };

      await historyService.saveRoute(newRoute);
      navigate('/history-list');

    } catch (error: any) {
      console.error("Error:", error);
      const msg = "Hubo un problema con la navegación. Inténtalo de nuevo.";
      setStatusText("Error detectado");
      await speak(msg);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <Layout>
      <div className="absolute inset-0 bg-[#1B1026] flex flex-col items-center justify-between text-white overflow-hidden text-center">
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#B983FF_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>

        {/* Header */}
        <div className="w-full pt-12 px-8 z-10 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="p-3 rounded-full bg-white/5 border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md ring-1 ring-white/10">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-accent">Nueva Ruta</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 z-10 pb-20 px-8 w-full">
          <div className="relative mb-8">
            <div className={`absolute -inset-10 border border-white/10 rounded-full animate-pulse transition-all duration-1000 ${isListening ? 'scale-125 opacity-100' : 'scale-100 opacity-20'}`}></div>
            <div className={`
              relative w-24 h-24 rounded-full flex items-center justify-center
              bg-gradient-to-tr from-accent to-secondary shadow-[0_0_30px_rgba(185,131,255,0.3)]
              transition-transform duration-500 ${isListening ? 'scale-110' : 'scale-100'}
            `}>
              <Navigation size={36} className="text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              {isListening ? "Escuchando" : "Navegación"}
            </h2>

            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-2xl ring-1 ring-white/10 shadow-2xl">
              <p className="text-xl font-bold text-accent mb-1 truncate px-4">{statusText}</p>
              <p className="text-sm text-white/50 font-medium">Desde: {origin || "Calculando..."}</p>
            </div>
          </div>
        </div>

        {/* Footer Waveform */}
        <div className="w-full pb-10 z-10 flex flex-col items-center">
          <VoiceWaveform />
          <div className="mt-6 flex flex-col items-center gap-1 opacity-50">
            <p className="text-[9px] font-black uppercase tracking-[6px]">Voice Interface v2</p>
            <div className="w-12 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
