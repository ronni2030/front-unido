// Servicio de reconocimiento y síntesis de voz
export class VoiceService {
  
  static speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }
      
      // Solo cancelar si hay algo hablando
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setTimeout(() => resolve(), 100);
      };
      utterance.onerror = () => {
        setTimeout(() => resolve(), 100);
      };
      
      // Pequeño delay antes de hablar
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    });
  }

  static isVoiceSupported(): boolean {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  static createRecognition() {
    if (!this.isVoiceSupported()) return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    return recognition;
  }

  static startListening(
    onResult: (command: string) => void,
    onError: () => void,
    setIsListening: (listening: boolean) => void
  ) {
    if (!this.isVoiceSupported()) {
      this.speak('Lo siento, tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = this.createRecognition();
    if (!recognition) return;

    setIsListening(true);
    this.speak('Escuchando... Di: Guía, Tarjeta, Contacto, Favoritos o Perfil');

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      onResult(command);
      setIsListening(false);
    };

    recognition.onerror = () => {
      onError();
      setIsListening(false);
    };

    recognition.start();
  }
}