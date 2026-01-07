//modifica la targeta
import React, { useState, useEffect } from 'react';
import api from '../../../services/api/client'; // ✅ IMPORTAR API
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/index';
import { cardService } from '../services/cardService';
import { speak } from '../../../shared/utils/voiceUtils';
import type { CardSlice } from '../../../store/slices/cardSlice';
import { Mic, Trash2, ArrowLeft, Edit3 } from 'lucide-react';
import { Layout } from '../../../shared/components/layout/Layout';
import { VoiceWaveform } from '../../../shared/components/VoiceWaveform';

export const CardUpdateScreen: React.FC = () => {
  const navigate = useNavigate();
  const { card, setCard } = useAppStore((state: CardSlice) => state);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Modo Edición");

  const [formData, setFormData] = useState({
    bloodType: '',
    allergies: '',
  });

  useEffect(() => {
    if (card) {
      setFormData({
        bloodType: card.bloodType,
        allergies: card.allergies,
      });

      const startAutomaticFlow = async () => {
        await speak("Modo edición. Di: EDITAR para cambiar datos, ELIMINAR para borrar, o VOLVER para ver tu tarjeta.");
        startVoiceCommand();
      };

      startAutomaticFlow();
    } else {
      navigate('/setup-card');
    }
    return () => window.speechSynthesis.cancel();
  }, [card, navigate]);

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
    setStatusMessage("Escuchando comando...");
    const command = await listen();

    if (command.includes("editar") || command.includes("cambiar")) {
      runUpdateProcess();
    }
    else if (command.includes("eliminar") || command.includes("borrar")) {
      handleDelete();
    }
    else if (command.includes("volver") || command.includes("atrás") || command.includes("regresar") || command.includes("cancelar")) {
      await speak("Entendido, regresando a tu tarjeta.");
      navigate('/view-card');
    }
    else {
      await speak("No te entendí. Di Editar, Eliminar o Volver.");
      setTimeout(() => startVoiceCommand(), 1000);
    }
  };

  const runUpdateProcess = async () => {
    setStatusMessage("Actualizando Sangre...");
    await speak("Dime el nuevo tipo de sangre.");
    const newBlood = await listen();
    if (!newBlood) return startVoiceCommand();
    setFormData(prev => ({ ...prev, bloodType: newBlood }));

    setStatusMessage("Actualizando Alergias...");
    await speak("Dime las nuevas alergias.");
    const newAllergies = await listen();
    if (!newAllergies) return startVoiceCommand();
    setFormData(prev => ({ ...prev, allergies: newAllergies }));

    setStatusMessage("Confirmar Cambios?");
    await speak(`¿Deseas guardar los cambios? Di Sí o No.`);
    const confirmation = await listen();

    if (confirmation.includes("sí") || confirmation.includes("si") || confirmation.includes("guardar")) {
      saveChanges(newBlood, newAllergies);
    } else {
      await speak("Edición cancelada. Volviendo al menú de edición.");
      startVoiceCommand();
    }
  };

  const saveChanges = async (blood: string, allergies: string) => {
    if (!card) return;
    const updated = { ...card, bloodType: blood, allergies: allergies };
    try {
      await cardService.saveCard(updated);
      setCard(updated);
      localStorage.setItem('user_id_card', JSON.stringify(updated));

      try {
        const backendData = {
          userId: 2, // ⚠️ ID FIJO POR AHORA
          nombresCompletos: updated.name,
          tipoSangre: blood,
          alergias: allergies
        };
        await api.post('/tarjeta/guardar', backendData);
      } catch (err) {
        console.error("⚠️ Error guardando en backend:", err);
      }

      await speak("Cambios guardados. Volviendo a la tarjeta.");
      navigate('/view-card');
    } catch (e) {
      await speak("Error al guardar.");
      startVoiceCommand();
    }
  };

  const handleDelete = async () => {
    setStatusMessage("¿Confirmar Eliminación?");
    await speak("¿Seguro que quieres borrar todo? Di CONFIRMAR para eliminar.");
    const confirmation = await listen();
    if (confirmation.includes("confirmar")) {
      localStorage.removeItem('user_id_card');
      // @ts-ignore
      setCard(null);
      await speak("Tarjeta eliminada. Volviendo al inicio.");
      navigate('/');
    } else {
      await speak("Eliminación cancelada.");
      startVoiceCommand();
    }
  };

  return (
    <Layout>
      <div className="absolute inset-0 bg-[#1B1026] flex flex-col items-center justify-between text-white overflow-hidden">

        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#B983FF_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>

        {/* Top Header */}
        <div className="w-full pt-12 px-8 z-10 flex justify-between items-center">
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Edit3 size={16} className="text-secondary" />
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Edición</span>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-60">
              <Trash2 size={18} />
            </div>
            <div className="bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-60" onClick={() => navigate('/view-card')}>
              <ArrowLeft size={18} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 z-10">
          <div className="relative">
            {/* Animated Dashed Border */}
            <div className={`absolute -inset-10 border-2 border-dashed border-secondary/30 rounded-full animate-[spin_25s_linear_infinite] ${isListening ? 'opacity-100 scale-110' : 'opacity-30 scale-100'} transition-all duration-1000`}></div>

            <div className={`
            relative w-40 h-40 rounded-full flex items-center justify-center
            bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg
            border border-white/20 shadow-2xl transition-all duration-500
            ${isListening ? 'scale-105 shadow-[0_0_60px_rgba(185,131,255,0.4)]' : 'scale-100'}
          `}>
              <Mic size={56} className={`relative z-10 transition-all duration-300 ${isListening ? 'text-white drop-shadow-[0_0_15px_rgba(185,131,255,0.8)]' : 'text-white/40'}`} />
            </div>
          </div>

          <div className="mt-14 text-center">
            <h2 className="text-3xl font-black tracking-tight mb-3">
              {statusMessage}
            </h2>
            <p className="text-secondary font-bold uppercase tracking-tighter opacity-80">
              {isListening ? "Escuchando voz..." : "Esperando comando"}
            </p>
          </div>

          {/* Info Card Preview */}
          <div className="mt-10 w-full max-w-[320px] bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 blur-3xl rounded-full -mr-10 -mt-10"></div>

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Tipo Sangre</span>
                <span className="text-lg font-black text-white">{formData.bloodType || "—"}</span>
              </div>
              <div className="h-px bg-white/10 w-full"></div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Alergias / Condición</span>
                <span className="text-sm font-medium text-white/90 leading-tight">{formData.allergies || "Ninguna registrada"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full pb-10 z-10 flex flex-col items-center">
          <VoiceWaveform />
          <div className="mt-4 flex flex-col items-center gap-1 opacity-40">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Comandos disponibles</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
