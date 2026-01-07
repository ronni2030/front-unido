//captura la voz del usuario y convertirla en texto.
// y se reutiliza en varias pantallas
import React from 'react';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  label: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onResult, label }) => {
  const handleListen = () => {
    // Verificar si el navegador soporta voz
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta voz. Intenta con Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
  };

  return (
    <button className="big-button" onClick={handleListen} style={{ backgroundColor: '#4A90E2' }}>
      🎤 {label}
    </button>
  );
};