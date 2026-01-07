import { useEffect, useState, useCallback } from "react";
import { speak, listenCommand } from "../../../shared/utils/voice";
import { MapPreview } from "../components/MapPreview";
import { useTracking } from "../hooks/useTracking";
import * as service from "../services/tracking.service";
import { BottomNavbar } from "../../../shared/components/layout/BottomNavbar";
import { FiMapPin, FiEdit2, FiTrash2 } from "react-icons/fi";

export const TrackingScreen = () => {
  const { tracking, reload } = useTracking();

  const [escuchandoComandos, setEscuchandoComandos] = useState(false);

  const ubicaciones = tracking.filter((t) => t.tipo === "ubicacion");

  // ===============================
  // 🧹 UTILIDADES
  // ===============================
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
  // 🔊 LEER ÚLTIMA UBICACIÓN
  // ===============================
  useEffect(() => {
    if (ubicaciones.length > 0) {
      speak(
        "Última ubicación registrada: " +
          formatearDireccion(ubicaciones[0].direccion)
      );
    }
  }, [ubicaciones, formatearDireccion]);

  // ===============================
  // 📍 OBTENER UBICACIÓN REAL
  // ===============================
  const obtenerUbicacion = useCallback(() => {
    speak("Obteniendo tu ubicación actual");

    if (!navigator.geolocation) {
      speak("Tu dispositivo no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
        );

        const data = await res.json();

        const direccion = `${data.street || "calle desconocida"}, ${
          data.city || data.locality || "ciudad desconocida"
        }, ${data.countryName || "país desconocido"}`;

        await service.saveUbicacion(direccion);
        reload();

        // 🔊 LECTURA CLAVE
        speak(
          "Ubicación obtenida. " + formatearDireccion(direccion)
        );
      },
      () => speak("No se pudo obtener tu ubicación")
    );
  }, [reload, formatearDireccion]);

  // ===============================
  // ✏️ EDITAR UBICACIÓN POR VOZ
  // ===============================
  const escucharNumeroEditar = useCallback(() => {
    listenCommand((texto: string) => {
      const numero = extraerNumero(texto);
      if (!numero || numero > ubicaciones.length) {
        speak("Número inválido");
        return;
      }

      const ubicacion = ubicaciones[numero - 1];
      speak("Di la nueva dirección");

      listenCommand(async (nueva: string) => {
        await service.updateTracking(ubicacion.id, nueva);
        speak("Ubicación actualizada");
        reload();
      });
    });
  }, [extraerNumero, ubicaciones, reload]);

  // ===============================
  // ❌ ELIMINAR UBICACIÓN POR VOZ
  // ===============================
  const escucharNumeroEliminar = useCallback(() => {
    listenCommand(async (texto: string) => {
      const numero = extraerNumero(texto);
      if (!numero || numero > ubicaciones.length) {
        speak("Número inválido");
        return;
      }

      await service.deleteTracking(ubicaciones[numero - 1].id);
      speak("Ubicación eliminada");
      reload();
    });
  }, [extraerNumero, ubicaciones, reload]);

  // ===============================
  // 🔊 MENSAJE INICIAL
  // ===============================
  useEffect(() => {
    speak(
      "Estás en el módulo de ubicación. " +
        "Di obtener ubicación, leer ubicaciones, " +
        "editar ubicación o eliminar ubicación."
    );

    const t = setTimeout(() => setEscuchandoComandos(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // ===============================
  // 🎤 LISTENER GLOBAL
  // ===============================
  useEffect(() => {
    if (!escuchandoComandos) return;

    listenCommand((texto: string) => {
      const comando = texto.toLowerCase();

      if (comando.includes("obtener ubicación")) {
        obtenerUbicacion();
        return;
      }

      if (comando.includes("leer ubicaciones")) {
        ubicaciones.forEach((u, i) =>
          speak(
            `Ubicación ${i + 1}: ${formatearDireccion(u.direccion)}`
          )
        );
        return;
      }

      if (comando.includes("editar ubicación")) {
        speak("Di el número de la ubicación");
        escucharNumeroEditar();
        return;
      }

      if (comando.includes("eliminar ubicación")) {
        speak("Di el número de la ubicación");
        escucharNumeroEliminar();
        return;
      }

      // ❗ no hablar si no coincide
    });
  }, [
    escuchandoComandos,
    obtenerUbicacion,
    escucharNumeroEditar,
    escucharNumeroEliminar,
    ubicaciones,
    formatearDireccion,
  ]);

  // ===============================
  // 🖼️ UI
  // ===============================
  return (
    <div className="bg-app-dark min-h-screen pb-28">
      <header className="openblind-header-clean">
        <h1>OpenBlind</h1>
        <p className="subtitle">Ubicación actual</p>
      </header>

      <main className="dashboard-container">
        <div className="info-card">
          <button className="btn-primary" onClick={obtenerUbicacion}>
            <FiMapPin size={22} /> Obtener ubicación
          </button>
        </div>

        {ubicaciones.map((u, i) => (
          <div key={u.id} className="route-card">
            <strong>
              {i + 1}. {formatearDireccion(u.direccion)}
            </strong>

            <MapPreview address={u.direccion} />

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
                  service.deleteTracking(u.id).then(() => reload())
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
