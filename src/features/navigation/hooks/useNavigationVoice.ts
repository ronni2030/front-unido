import { speak, listenCommand } from "../../../shared/utils/voice";

export const useNavigationVoice = (
  onDireccion: (direccion: string) => void
) => {
  const iniciarGuia = () => {
    speak("Di llévame a seguido del lugar al que deseas ir.");

    listenCommand(async (texto: string) => {
      const destino = texto
        .replace("llévame a", "")
        .replace("llevame a", "")
        .replace("dirígeme a", "")
        .trim();

      if (!destino) {
        speak("No entendí el destino");
        return;
      }

      speak(`Buscando la dirección de ${destino}`);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          destino
        )}&format=json&limit=1`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        speak("No encontré una dirección para ese lugar");
        return;
      }

      const direccion = data[0].display_name;
      speak(`Debes dirigirte a ${direccion}`);
      onDireccion(direccion);
    });
  };

  return { iniciarGuia };
};