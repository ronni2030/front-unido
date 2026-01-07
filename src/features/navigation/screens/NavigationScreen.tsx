import { useEffect, useState, useCallback } from "react";
import { speak, listenCommand } from "../../../shared/utils/voice";
import { MapPreview } from "../components/MapPreview";
import { useTracking } from "../hooks/useTracking";
import * as service from "../services/tracking.service";
import { BottomNavbar } from "../../../shared/components/layout/BottomNavbar";
import { FiMic, FiEdit2, FiTrash2 } from "react-icons/fi";

export const NavigationScreen = () => {
  const { tracking, reload } = useTracking();

  const [direccionActual, setDireccionActual] = useState("");
  const [escuchandoComandos, setEscuchandoComandos] = useState(false);

  const rutas = tracking.filter((t) => t.tipo === "navegacion");

  // ===============================
  // 🧹 UTILIDADES
  // ===============================
  const limpiarTexto = useCallback((t: string) => {
    return t
      .toLowerCase()
      .replace("llévame a", "")
      .replace("llevame a", "")
      .trim();
  }, []);

  const formatearDireccion = useCallback((d: string) => {
    const partes = d.split(",");
    return partes.length >= 2
      ? `${partes[0].trim()}, ${partes[1].trim()}`
      : d;
  }, []);

  const extraerNumero = useCallback((texto: string) => {
    const n = texto.match(/\d+/);
    return n ? parseInt(n[0]) : null;
  }, []);

  // ===============================
  // 🔊 LEER ÚLTIMA RUTA AL ENTRAR
  // ===============================
  useEffect(() => {
    if (rutas.length > 0) {
      speak(
        "Última ruta guardada: " +
          formatearDireccion(rutas[0].direccion)
      );
    }
  }, [rutas, formatearDireccion]);

  // ===============================
  // 🌍 BUSCAR Y GUARDAR DESTINO
  // ===============================
  const buscarYGuardarDestino = useCallback(
    async (destino: string) => {
      try {
        speak("Buscando dirección");

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            destino
          )}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "OpenBlindApp/1.0",
              "Accept-Language": "es",
            },
          }
        );

        const data = await res.json();

        if (!data || data.length === 0) {
          speak("No encontré ese lugar");
          return;
        }

        const direccion = data[0].display_name;

        setDireccionActual(direccion);
        await service.saveNavegacion(direccion);
        await reload();

        // 🔊 LECTURA FINAL (Y TERMINA AQUÍ)
        speak("Ruta obtenida. " + formatearDireccion(direccion));
      } catch {
        speak("Ocurrió un error al buscar la dirección");
      }
    },
    [reload, formatearDireccion]
  );

  // ===============================
  // 🔊 LEER TODAS LAS RUTAS
  // ===============================
  const leerRutas = useCallback(() => {
    if (rutas.length === 0) {
      speak("No tienes rutas guardadas");
      return;
    }

    rutas.forEach((ruta, index) => {
      speak(
        `Ruta ${index + 1}: ${formatearDireccion(ruta.direccion)}`
      );
    });
  }, [rutas, formatearDireccion]);

  // ===============================
  // ✏️ EDITAR POR VOZ
  // ===============================
  const escucharNumeroEditar = useCallback(() => {
    listenCommand((texto: string) => {
      const numero = extraerNumero(texto);
      if (!numero || numero > rutas.length) {
        speak("Número inválido");
        return;
      }

      const ruta = rutas[numero - 1];
      speak("Di la nueva dirección");

      listenCommand(async (nueva: string) => {
        await service.updateTracking(ruta.id, nueva);
        speak("Ruta actualizada");
        reload();
      });
    });
  }, [extraerNumero, rutas, reload]);

  // ===============================
  // ❌ ELIMINAR POR VOZ
  // ===============================
  const escucharNumeroEliminar = useCallback(() => {
    listenCommand(async (texto: string) => {
      const numero = extraerNumero(texto);
      if (!numero || numero > rutas.length) {
        speak("Número inválido");
        return;
      }

      await service.deleteTracking(rutas[numero - 1].id);
      speak("Ruta eliminada");
      reload();
    });
  }, [extraerNumero, rutas, reload]);

  // ===============================
  // 🔊 MENSAJE INICIAL
  // ===============================
  useEffect(() => {
    speak(
      "Estás en navegación. Di llévame a seguido del lugar, " +
        "leer rutas, editar ruta o eliminar ruta."
    );

    const t = setTimeout(() => setEscuchandoComandos(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // ===============================
  // 🎤 LISTENER GLOBAL (SIN MENSAJE EXTRA)
  // ===============================
  useEffect(() => {
    if (!escuchandoComandos) return;

    listenCommand((texto: string) => {
      const comando = texto.toLowerCase();

      if (comando.includes("leer rutas")) {
        leerRutas();
        return;
      }

      if (comando.includes("editar ruta")) {
        speak("Di el número de la ruta");
        escucharNumeroEditar();
        return;
      }

      if (comando.includes("eliminar ruta")) {
        speak("Di el número de la ruta");
        escucharNumeroEliminar();
        return;
      }

      if (comando.includes("llévame a") || comando.includes("llevame a")) {
        buscarYGuardarDestino(limpiarTexto(comando));
        return;
      }

      // ❗ NO decir nada si no coincide
    });
  }, [
    escuchandoComandos,
    leerRutas,
    escucharNumeroEditar,
    escucharNumeroEliminar,
    limpiarTexto,
    buscarYGuardarDestino,
  ]);

  // ===============================
  // 🎤 BOTÓN MANUAL
  // ===============================
  const escucharDestino = () => {
    speak("Te escucho");

    listenCommand((texto: string) => {
      buscarYGuardarDestino(limpiarTexto(texto));
    });
  };

  return (
    <div className="bg-app-dark min-h-screen pb-28">
      <header className="openblind-header-clean">
        <h1>OpenBlind</h1>
        <p className="subtitle">Navegación por voz</p>
      </header>

      <main className="dashboard-container">
        <div className="info-card">
          <button className="btn-primary" onClick={escucharDestino}>
            <FiMic size={22} /> Llévame a un lugar
          </button>
        </div>

        {direccionActual && (
          <div className="info-card">
            <p>{formatearDireccion(direccionActual)}</p>
            <MapPreview address={direccionActual} />
          </div>
        )}

        {rutas.map((ruta, index) => (
          <div key={ruta.id} className="route-card">
            <strong>
              {index + 1}. {formatearDireccion(ruta.direccion)}
            </strong>

            <MapPreview address={ruta.direccion} />

            <div className="actions-row">
              <button
                className="btn-secondary"
                onClick={() => escucharNumeroEditar()}
              >
                <FiEdit2 /> Editar
              </button>

              <button
                className="btn-delete"
                onClick={() =>
                  service.deleteTracking(ruta.id).then(() => reload())
                }
              >
                <FiTrash2 /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </main>

      <BottomNavbar />
    </div>
  );
};
