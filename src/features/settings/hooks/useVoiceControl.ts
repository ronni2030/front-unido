import { useEffect, useRef } from 'react';

type Vista = 'ajustes' | 'registro';
type Idioma = 'ES' | 'EN';

const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

type Params = {
  vista: Vista;
  idioma: Idioma;
  volumen: number;
  velocidad: number;
  setVista: (v: Vista) => void;
  setIdioma: (i: Idioma) => void;
  setVolumen: (v: number) => void;
  setVelocidad: (v: number) => void;
  textos: any;
};

export function useVoiceControl({
  vista,
  idioma,
  volumen,
  velocidad,
  setVista,
  setIdioma,
  setVolumen,
  setVelocidad,
  textos,
}: Params) {
  const recognitionRef = useRef<any>(null);
  const speakingRef = useRef(false);
  const bienvenidaRef = useRef(false);

  // ================== HABLAR ==================
  function hablar(texto: string) {
    if (!window.speechSynthesis) return;

    speakingRef.current = true;
    recognitionRef.current?.stop?.();

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = idioma === 'ES' ? 'es-ES' : 'en-US';
    u.rate = velocidad;
    u.volume = volumen / 100;

    u.onend = () => {
      speakingRef.current = false;
      iniciarEscucha();
    };

    window.speechSynthesis.speak(u);
  }

  // ================== ESCUCHAR ==================
  function iniciarEscucha() {
    if (!SpeechRecognition || speakingRef.current) return;

    recognitionRef.current?.stop?.();
    const recognition = new SpeechRecognition();
    recognition.lang = idioma === 'ES' ? 'es-ES' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const cmd = e.results[0][0].transcript
        .toLowerCase()
        .trim();

      console.log('🎙️ Comando:', cmd);

      // ===== IDIOMA =====
      if (cmd.includes('idioma') || cmd.includes('language')) {
        setIdioma(idioma === 'ES' ? 'EN' : 'ES');
        hablar('Idioma cambiado');
        return;
      }

      // ===== VISTAS =====
      if (cmd.includes('ajustes') || cmd.includes('settings')) {
        setVista('ajustes');
        return;
      }

      if (cmd.includes('registro') || cmd.includes('logs')) {
        setVista('registro');
        return;
      }

      // ===== GUARDAR =====
      if (cmd.includes('guardar') || cmd.includes('save')) {
        hablar(textos[idioma].guardado);
        return;
      }

      // ===== RESET =====
      if (cmd.includes('restablecer') || cmd.includes('reset')) {
        setIdioma('ES');
        setVolumen(75);
        setVelocidad(1);
        hablar(textos[idioma].reset);
        return;
      }

      // ===== 🔊 VOLUMEN =====
      if (cmd.includes('subir') && cmd.includes('volumen')) {
        const nuevo = Math.min(100, volumen + 10);
        setVolumen(nuevo);
        hablar(`Volumen aumentado a ${nuevo}`);
        return;
      }

      if (cmd.includes('bajar') && cmd.includes('volumen')) {
        const nuevo = Math.max(0, volumen - 10);
        setVolumen(nuevo);
        hablar(`Volumen reducido a ${nuevo}`);
        return;
      }

      if (
        cmd.includes('volumen') &&
        (cmd.includes('máximo') || cmd.includes('maximo'))
      ) {
        setVolumen(100);
        hablar('Volumen ajustado al máximo');
        return;
      }

      if (
        cmd.includes('volumen') &&
        (cmd.includes('mínimo') || cmd.includes('minimo'))
      ) {
        setVolumen(0);
        hablar('Volumen ajustado al mínimo');
        return;
      }

      // =====  VELOCIDAD =====
      if (cmd.includes('más rápido') || cmd.includes('mas rapido') || cmd.includes('faster')) {
        const nueva = Math.min(2, velocidad + 0.1);
        setVelocidad(nueva);
        hablar(`Velocidad aumentada a ${nueva.toFixed(1)}`);
        return;
      }

      if (cmd.includes('más lento') || cmd.includes('mas lento') || cmd.includes('slower')) {
        const nueva = Math.max(0.5, velocidad - 0.1);
        setVelocidad(nueva);
        hablar(`Velocidad reducida a ${nueva.toFixed(1)}`);
        return;
      }

      // ===== AJUSTES COMBINADOS (VOLUMEN Y VELOCIDAD) =====
      if (cmd.includes('ajustes predeterminados') || cmd.includes('default settings')) {
        setVolumen(75);
        setVelocidad(1);
        hablar('Ajustes restablecidos a valores predeterminados');
        return;
      }

      if (cmd.includes('modo tranquilo') || cmd.includes('quiet mode')) {
        setVolumen(30);
        setVelocidad(0.8);
        hablar('Modo tranquilo activado: volumen bajo y velocidad reducida');
        return;
      }

      if (cmd.includes('modo presentación') || cmd.includes('presentation mode')) {
        setVolumen(90);
        setVelocidad(1.2);
        hablar('Modo presentación activado: volumen alto y velocidad rápida');
        return;
      }

      if (cmd.includes('modo lectura') || cmd.includes('reading mode')) {
        setVolumen(60);
        setVelocidad(1);
        hablar('Modo lectura activado: volumen medio y velocidad normal');
        return;
      }

      // ===== AJUSTES ESPECÍFICOS NUMÉRICOS =====
      const volumenMatch = cmd.match(/volumen (\d+)/);
      const velocidadMatch = cmd.match(/velocidad (\d+(?:\.\d+)?)/);

      if (volumenMatch && velocidadMatch) {
        const nuevoVolumen = Math.min(100, Math.max(0, parseInt(volumenMatch[1])));
        const nuevaVelocidad = Math.min(2, Math.max(0.5, parseFloat(velocidadMatch[1])));
        
        setVolumen(nuevoVolumen);
        setVelocidad(nuevaVelocidad);
        hablar(`Ajustados volumen a ${nuevoVolumen} y velocidad a ${nuevaVelocidad.toFixed(1)}`);
        return;
      }

      if (volumenMatch) {
        const nuevoVolumen = Math.min(100, Math.max(0, parseInt(volumenMatch[1])));
        setVolumen(nuevoVolumen);
        hablar(`Volumen ajustado a ${nuevoVolumen}`);
        return;
      }

      if (velocidadMatch) {
        const nuevaVelocidad = Math.min(2, Math.max(0.5, parseFloat(velocidadMatch[1])));
        setVelocidad(nuevaVelocidad);
        hablar(`Velocidad ajustada a ${nuevaVelocidad.toFixed(1)}`);
        return;
      }

      // ===== NO ENTENDIDO =====
      hablar('Comando no reconocido');
    };

    recognition.onend = () => {
      if (!speakingRef.current) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  // ================== BIENVENIDA Y DESCRIPCIÓN ==================
  useEffect(() => {
    if (!bienvenidaRef.current) {
      hablar(textos[idioma].bienvenida);
      bienvenidaRef.current = true;
      return;
    }

    if (vista === 'ajustes') {
      hablar(
        textos[idioma].ajustesDesc +
          '. Puedes decir: subir volumen, bajar volumen, hablar más rápido, hablar más lento, ' +
          'modo tranquilo, modo presentación, modo lectura, o ajustes predeterminados. ' +
          'También puedes decir números específicos como "volumen 50" o "velocidad 1.5"'
      );
    } else {
      hablar(
        textos[idioma].registroDesc +
          '. Puedes decir: guardar datos o volver a ajustes'
      );
    }
  }, [vista, idioma]);

  return { hablar };
}