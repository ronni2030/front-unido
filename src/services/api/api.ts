const API_URL = 'http://localhost:8888';

export interface GuardarDatosPayload {
  idioma: string;
  volumen: number;
  velocidad: number;
}

export const api = {
  guardarDatos: async (data: GuardarDatosPayload) => {
    // SOLUCIÓN: Cambiar mensajeId por mensajeIdMensaje y usar null
    const payload = {
      nombreGuiaVoz: `Configuración ${data.idioma}`,
      duracionGuiaVoz: 60,
      mensajeIdMensaje: null,  // ← CAMBIADO: nombre correcto y valor null
      idiomaId: data.idioma === 'ES' ? 1 : 2,
      lugarTuristicoId: 1,
      usuarioId: 1,
    };

    console.log('📤 Enviando payload al backend:', payload);

    const res = await fetch(`${API_URL}/guia-voz/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('❌ Error del backend:', result);
      throw new Error(result.message || 'Error al guardar datos');
    }

    console.log('✅ Éxito - Datos guardados:', result);
    return result;
  },
};