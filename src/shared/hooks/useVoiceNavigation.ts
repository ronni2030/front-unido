import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VoiceNavigationOptions {
  onCommand?: (command: string) => void;
  enabled?: boolean;
}

export const useVoiceNavigation = ({ onCommand, enabled = true }: VoiceNavigationOptions = {}) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    // Verificar soporte de reconocimiento de voz
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.error('❌ El navegador no soporta reconocimiento de voz');
      return;
    }

    console.log('✅ Inicializando reconocimiento de voz...');
    let isActive = true;

    // Inicializar reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let restartTimeout: NodeJS.Timeout;

      recognition.onstart = () => {
        console.log('🎤 Micrófono activado');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        console.log('🎤 Comando detectado:', command);
        setLastCommand(command);

        // Procesar comandos
        if (command.includes('crear') || command.includes('agregar') || command.includes('nuevo')) {
          console.log('✅ Comando: crear lugar');
          speak('Abriendo formulario');
          setTimeout(() => navigate('/places/add'), 1500);
        } else if (command.includes('escuchar') || command.includes('leer') || command.includes('lista')) {
          console.log('✅ Comando: leer lugares');
          if (onCommand) onCommand(command);
        } else if (command.includes('inicio') || command.includes('volver')) {
          console.log('✅ Comando: inicio');
          speak('Volviendo al inicio');
          setTimeout(() => navigate('/places'), 1500);
        } else {
          console.log('ℹ️ Comando personalizado');
          if (onCommand) onCommand(command);
        }
      };

      recognition.onerror = (event: any) => {
        console.log('⚠️ Error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          console.error('❌ Micrófono no permitido');
          isActive = false;
          return;
        }
        
        // Para otros errores, solo esperar y reintentar
        if (isActive && event.error !== 'aborted') {
          clearTimeout(restartTimeout);
          restartTimeout = setTimeout(() => {
            if (isActive && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignorar si ya está corriendo
              }
            }
          }, 2000);
        }
      };

      recognition.onend = () => {
        console.log('🔴 Reconocimiento terminado');
        setIsListening(false);
        
        // Auto-reiniciar si sigue activo
        if (isActive) {
          clearTimeout(restartTimeout);
          restartTimeout = setTimeout(() => {
            if (isActive && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Ignorar si ya está corriendo
              }
            }
          }, 1500);
        }
      };

      recognitionRef.current = recognition;

      // Iniciar
      console.log('🚀 Iniciando reconocimiento...');
      try {
        recognition.start();
      } catch (e) {
        console.error('❌ Error al iniciar:', e);
      }

      return () => {
        console.log('🧹 Limpiando reconocimiento');
        isActive = false;
        clearTimeout(restartTimeout);
        try {
          recognition.stop();
        } catch (e) {
          // Ignorar
        }
      };
    }
  }, [enabled, navigate, onCommand]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancelar cualquier lectura anterior
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Esperar a que las voces estén disponibles
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Si no hay voces cargadas, esperar al evento
        window.speechSynthesis.onvoiceschanged = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          const spanishVoice = availableVoices.find(voice => voice.lang.includes('es'));
          if (spanishVoice) {
            utterance.voice = spanishVoice;
          }
          console.log('🔊 Reproduciendo:', text);
          window.speechSynthesis.speak(utterance);
        };
      } else {
        // Seleccionar una voz en español si está disponible
        const spanishVoice = voices.find(voice => voice.lang.includes('es'));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        console.log('🔊 Reproduciendo:', text);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.error('❌ SpeechSynthesis no está disponible');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {
        console.log('Error al detener');
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Ya está escuchando');
      }
    }
  };

  return {
    isListening,
    lastCommand,
    stopListening,
    startListening,
    speak,
  };
};
