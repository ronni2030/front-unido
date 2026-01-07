import { useState } from 'react';
import { VoiceService } from '../services/voice';

export const useDashboard = () => {
  const [isListening, setIsListening] = useState(false);

  const startListening = (onNavigate: (screen: string) => void) => {
    VoiceService.startListening(
      (command) => {
        if (command.includes('guía') || command.includes('navegación')) {
          VoiceService.speak('Abriendo Guía');
          onNavigate('navigation');
        } else if (command.includes('tarjeta')) {
          VoiceService.speak('Abriendo Tarjeta');
          onNavigate('card');
        } else if (command.includes('contacto')) {
          VoiceService.speak('Abriendo Contacto');
          onNavigate('contact');
        } else if (command.includes('favoritos') || command.includes('lugares')) {
          VoiceService.speak('Abriendo Lugares Favoritos');
          onNavigate('favorites');
        } else if (command.includes('perfil')) {
          VoiceService.speak('Abriendo Perfil');
          onNavigate('profile');
        } else {
          VoiceService.speak('Comando no reconocido. Di: Guía, Tarjeta, Contacto, Favoritos o Perfil');
        }
      },
      () => VoiceService.speak('Error al escuchar. Intenta de nuevo.'),
      setIsListening
    );
  };

  return {
    isListening,
    startListening
  };
};