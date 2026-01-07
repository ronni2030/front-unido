//registro para la targeta 
import React, { useState, useEffect } from 'react';
import api from '../../../services/api/client'; //  IMPORTAR API
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/index';
import { cardService } from '../services/cardService';
import { speak } from '../../../shared/utils/voiceUtils';
import type { CardSlice } from '../../../store/slices/cardSlice';
import { Mic } from 'lucide-react';
import { Layout } from '../../../shared/components/layout/Layout';
import { VoiceWaveform } from '../../../shared/components/VoiceWaveform';


const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const CardSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const setCard = useAppStore((state: CardSlice) => state.setCard);
  const [isListening, setIsListening] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bloodType: '',
    allergies: '',
  });

  // EFECTO AUTOMÁTICO: Inicia el registro apenas carga la pantalla
  useEffect(() => {
    const initFlow = async () => {
      await sleep(1000); // Pausa breve para estabilidad
      await speak("Bienvenido. Vamos a crear tu tarjeta médica. Te haré tres preguntas.");
      startConversationalFlow();
    };
    initFlow();

    return () => window.speechSynthesis.cancel();
  }, []);

  const listen = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Tu navegador no soporta voz. Usa Google Chrome.");
        return reject("No soportado");
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        resolve(text);
      };

      recognition.onerror = (event: any) => reject(event.error);
      recognition.start();
    });
  };

  const startConversationalFlow = async () => {
    try {
      // 1. Nombre
      await speak("¿Cómo te llamas?");
      const name = await listen();
      setFormData(prev => ({ ...prev, fullName: name }));

      // 2. Sangre
      await speak(`Mucho gusto ${name}. ¿Cuál es tu tipo de sangre?`);
      const blood = await listen();
      setFormData(prev => ({ ...prev, bloodType: blood }));

      // 3. Alergias
      await speak("¿Tienes alguna alergia o condición médica?");
      const allergies = await listen();
      setFormData(prev => ({ ...prev, allergies: allergies }));

      await speak("Perfecto. Estoy guardando tu información y generando tu código Q R.");

      const newCard = {
        name: name,
        bloodType: blood,
        allergies: allergies,
        id: Date.now().toString(),
        isActive: true
      };

      // PERSISTENCIA
      setCard(newCard as any);
      await cardService.saveCard(newCard as any);
      localStorage.setItem('user_id_card', JSON.stringify(newCard));

      // 🟢 GUARDAR EN BACKEND MYSQL 🟢
      try {
        const backendData = {
          userId: 2, //  ID FIJO POR AHORA (Idealmente usar userStore)
          nombresCompletos: name,
          tipoSangre: blood,
          alergias: allergies
        };

        await api.post('/tarjeta/guardar', backendData);
        console.log("✅ Datos guardados en Backend MySQL correctamente");

      } catch (err) {
        console.error("⚠️ Error guardando en backend:", err);
        // No bloqueamos el flujo principal
      }

      await speak("Listo. Tu tarjeta ha sido creada.");
      navigate('/view-card');

    } catch (error: any) {
      console.error("Error:", error);
      await speak("No pude escucharte bien. Vamos a reiniciar el proceso.");
      setTimeout(() => startConversationalFlow(), 2000);
    }
  };

  return (
    <Layout>
      <div className="absolute inset-0 bg-[#1B1026] flex flex-col items-center justify-between text-white overflow-hidden">

        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#7A3EB1_0%,_transparent_70%)] opacity-30 pointer-events-none"></div>

        {/* Top Banner/Status */}
        <div className="w-full pt-12 px-8 z-10">
          <div className="flex justify-between items-center text-secondary opacity-80 backdrop-blur-sm p-4 rounded-full border border-white/5">
            <span className="text-sm font-medium tracking-widest uppercase">
              Setup <span className="text-white ml-2">•</span>
            </span>
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full ${formData.fullName ? 'bg-accent shadow-[0_0_8px_rgba(185,131,255,0.8)]' : 'bg-white/20'}`}></div>
              <div className={`w-2 h-2 rounded-full ${formData.bloodType ? 'bg-accent shadow-[0_0_8px_rgba(185,131,255,0.8)]' : 'bg-white/20'}`}></div>
              <div className={`w-2 h-2 rounded-full ${formData.allergies ? 'bg-accent shadow-[0_0_8px_rgba(185,131,255,0.8)]' : 'bg-white/20'}`}></div>
            </div>
          </div>
        </div>

        {/* Main Content: Microphone Icon */}
        <div className="flex flex-col items-center justify-center flex-1 z-10">
          <div className="relative group">
            {/* Animated Dashed Border */}
            <div className={`absolute -inset-8 border-2 border-dashed border-white/30 rounded-full animate-[spin_20s_linear_infinite] ${isListening ? 'opacity-100 scale-110' : 'opacity-40 scale-100'} transition-all duration-700`}></div>

            {/* Central Mic Container with Glow */}
            <div className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md
            border border-white/20 shadow-2xl transition-all duration-500
            ${isListening ? 'scale-110 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : 'scale-100'}
          `}>
              {/* Inner Glow Bulb */}
              <div className={`absolute inset-4 rounded-full bg-accent mix-blend-screen transition-opacity duration-300 ${isListening ? 'opacity-40 blur-xl animate-pulse' : 'opacity-0 blur-none'}`}></div>

              <Mic size={48} className={`relative z-10 transition-all duration-300 ${isListening ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/60'}`} />
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {isListening ? "Reconocimiento de Voz" : "Esperando..."}
            </h2>
            <p className="text-white/60 font-medium">
              {isListening ? "Te escucho, adelante..." : "Preparando sistema de voz"}
            </p>
          </div>

          {/* Current Field Indicator */}
          <div className="mt-8 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm min-w-[200px] text-center">
            <span className="text-accent text-sm font-bold uppercase tracking-wider">
              {!formData.fullName ? "PREGUNTA: NOMBRE" : !formData.bloodType ? "PREGUNTA: SANGRE" : "PREGUNTA: ALERGIAS"}
            </span>
          </div>
        </div>

        {/* Bottom Waveform & Progress */}
        <div className="w-full pb-10 z-10 flex flex-col items-center">
          <VoiceWaveform />

          {/* Step Preview */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs text-secondary font-semibold uppercase tracking-widest opacity-60">Proceso de Registro</p>
            <div className="flex gap-4">
              <span className={`text-lg font-bold ${formData.fullName ? 'text-white' : 'text-white/20 text-sm'}`}>{formData.fullName || "—"}</span>
              <span className={`text-lg font-bold ${formData.bloodType ? 'text-white' : 'text-white/20 text-sm'}`}>{formData.bloodType || "—"}</span>
              <span className={`text-lg font-bold ${formData.allergies ? 'text-white' : 'text-white/20 text-sm'}`}>{formData.allergies || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
