export function speak(
  text: string,
  options: {
    lang: string;
    rate: number;
    volume: number;
    // Cambiamos el tipo aquí para aceptar el evento
    onEnd?: (ev: SpeechSynthesisEvent) => void; 
  }
) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = options.lang;
  u.rate = options.rate;
  u.volume = options.volume;

  if (options.onEnd) {
    u.onend = options.onEnd;
  }
  
  window.speechSynthesis.speak(u);
}