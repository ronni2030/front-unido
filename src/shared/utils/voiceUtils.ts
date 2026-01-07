export const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    // Cancelar cualquier voz que esté sonando ahora
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Un poco más lento para que se entienda bien
    
    utterance.onend = () => {
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};