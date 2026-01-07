import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMic, FiMapPin } from "react-icons/fi";
import { speak, listenCommand } from "../../../shared/utils/voice";
import { BottomNavbar } from "../../../shared/components/layout/BottomNavbar";

export const HomeScreen = () => {
  const navigate = useNavigate();

  // 🔊 Habla automáticamente (accesibilidad)
  useEffect(() => {
    speak(
      "Bienvenido a OpenBlind. " +
      "Di ubicación para saber dónde estás, " +
      "o di guía para iniciar navegación."
    );
  }, []);

  // 🎤 Comandos de voz
  const comandoVoz = () => {
    listenCommand((texto) => {
      if (texto.includes("ubicación")) {
        speak("Abriendo módulo de ubicación");
        navigate("/ubicacion");
      } else if (
        texto.includes("guía") ||
        texto.includes("navegación")
      ) {
        speak("Abriendo módulo de navegación");
        navigate("/guia");
      } else {
        speak("No entendí el comando");
      }
    });
  };

  return (
    <div className="screen">
      <h1 className="title">OpenBlind</h1>

      <button
        className="btn-primary"
        onClick={() => navigate("/ubicacion")}
      >
        <FiMapPin size={24} />
        Obtener ubicación
      </button>

      <button
        className="btn-primary"
        onClick={comandoVoz}
      >
        <FiMic size={24} />
        Llévame a un lugar
      </button>

      <BottomNavbar />
    </div>
  );
};