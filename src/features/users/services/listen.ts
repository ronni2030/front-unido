// src/shared/voice/listen.ts
export function listen(commands: Record<string, () => void>) {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("El navegador no soporta reconocimiento de voz");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript.toLowerCase();
    console.log("Comando detectado:", text);

    Object.entries(commands).forEach(([key, action]) => {
      if (text.includes(key)) {
        action();
      }
    });
  };
}