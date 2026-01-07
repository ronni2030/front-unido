export function speak(text: string) {
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;

  synth.speak(utterance);
}