import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../../shared/components/layout/Layout';
import { locationService } from '../../../shared/services/locationService';
import { speak } from '../../../shared/utils/voiceUtils';
import { MapPin, ArrowLeft } from 'lucide-react';
import { VoiceWaveform } from '../../../shared/components/VoiceWaveform';

export const LocationScreen: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<string>("Detectando...");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    handleDetectLocation();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleDetectLocation = async () => {
    setLoading(true);
    await speak("Detectando tu ubicación actual. Por favor espera.");

    try {
      const pos = await locationService.getCurrentPosition();
      const street = await locationService.getAddressFromCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );

      setAddress(street);
      await speak(`Te encuentras en: ${street}. Puedes decir: REPETIR, VOLVER al inicio, o IR A un destino.`);
      startVoiceCommand();
    } catch (error) {
      await speak("No pude acceder al GPS. Verifica los permisos.");
      setTimeout(() => navigate('/'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const listen = (): Promise<string> => {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return resolve("");

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => resolve(event.results[0][0].transcript.toLowerCase());
      recognition.onerror = () => resolve("");
      recognition.start();
    });
  };

  const startVoiceCommand = async () => {
    const command = await listen();
    console.log("Comando ubicación:", command);

    if (command.includes("ir a") || command.includes("navegar a")) {
      const destination = command.split("ir a")[1] || command.split("navegar a")[1] || "";
      if (destination.trim()) {
        await speak(`Entendido, iniciando navegación hacia ${destination}`);
        navigate(`/new-route?target=${encodeURIComponent(destination.trim())}`);
      } else {
        await speak("¿A qué destino quieres ir?");
        navigate('/new-route');
      }
    }
    else if (command.includes("repetir") || command.includes("anunciar")) {
      await speak(`Te encuentras en: ${address}`);
      startVoiceCommand();
    }
    else if (command.includes("volver") || command.includes("inicio") || command.includes("atrás")) {
      await speak("Volviendo al inicio.");
      navigate('/');
    }
    else {
      await speak("No te entendí. Di REPETIR, VOLVER o IR A un destino.");
      setTimeout(() => startVoiceCommand(), 1000);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-between min-h-full">
        {/* Header */}
        <div className="w-full pt-12 px-8 z-10 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="p-3 rounded-full bg-white/5 border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-accent">GPS Activo</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 z-10 w-full px-8">
          <div className="relative mb-12">
            <div className={`absolute -inset-8 border-2 border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite] ${isListening ? 'opacity-100 scale-110' : 'opacity-40'} transition-all duration-700`}></div>
            <div className={`
              relative w-28 h-28 rounded-full flex items-center justify-center
              bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md
              border border-white/20 shadow-2xl transition-all duration-500
              ${isListening ? 'scale-110 shadow-[0_0_40px_rgba(185,131,255,0.4)]' : 'scale-100'}
            `}>
              <MapPin size={40} className={isListening ? "text-accent animate-pulse" : "text-white/60"} />
            </div>
          </div>

          <div className="text-center max-w-xs">
            <h2 className="text-xl font-bold mb-3 tracking-tight">Tu Ubicación</h2>
            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl mb-6 ring-1 ring-white/5 shadow-inner">
              <p className="text-lg font-medium leading-tight text-white/90">
                {loading ? "Buscando ubicación..." : address}
              </p>
            </div>

            <div className="flex flex-col gap-2 opacity-60">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Comandos Disponibles</p>
              <p className="text-sm font-medium italic">"Ir a [Destino]" • "Repetir" • "Volver"</p>
            </div>
          </div>
        </div>

        {/* Waveform footer */}
        <div className="w-full pb-10 z-10 flex flex-col items-center">
          <VoiceWaveform />
          <p className="mt-4 text-[10px] uppercase tracking-[4px] font-bold text-white/30">
            {isListening ? "Escuchando comandos..." : "Sistema de Voz"}
          </p>
        </div>
      </div>
    </Layout>
  );
};
