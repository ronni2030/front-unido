import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PlaceFormData, PlaceType } from '../types/place.types';
import { MapPin, Mic } from 'lucide-react';

const placeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  description: z.string(),
  type: z.enum(['parada segura', 'destino frecuente', 'casa', 'trabajo']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type PlaceFormSchema = z.infer<typeof placeSchema>;

interface PlaceFormProps {
  initialData?: Partial<PlaceFormData>;
  onSubmit: (data: PlaceFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export interface PlaceFormRef {
  setValue: (field: string, value: any) => void;
  submitForm: () => void;
}

const placeTypes: { value: PlaceType; label: string }[] = [
  { value: 'parada segura', label: 'Parada Segura' },
  { value: 'destino frecuente', label: 'Destino Frecuente' },
  { value: 'casa', label: 'Casa' },
  { value: 'trabajo', label: 'Trabajo' },
];

export const PlaceForm = forwardRef<PlaceFormRef, PlaceFormProps>(({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  submitLabel = 'Guardar'
}, ref) => {
  const [isListening, setIsListening] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PlaceFormSchema>({
    resolver: zodResolver(placeSchema),
    defaultValues: initialData || {
      name: '',
      address: '',
      description: '',
      type: 'destino frecuente' as PlaceType,
      latitude: 0,
      longitude: 0,
    },
  });

  // Exponer métodos a través del ref
  useImperativeHandle(ref, () => ({
    setValue: (field: string, value: any) => {
      setValue(field as keyof PlaceFormSchema, value, { 
        shouldValidate: true, 
        shouldDirty: true,
        shouldTouch: true 
      });
    },
    submitForm: () => {
      handleSubmit(onSubmit)();
    }
  }));

  // Inicializar reconocimiento de voz
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;
      return recognition;
    }
    return null;
  };

  // Función para iniciar reconocimiento de voz
  const startVoiceInput = (fieldName: keyof PlaceFormData) => {
    const recognitionInstance = initSpeechRecognition();
    
    if (!recognitionInstance) {
      alert('El reconocimiento de voz no está disponible en este navegador');
      return;
    }

    console.log('🎤 Iniciando reconocimiento para campo:', fieldName);
    setIsListening(fieldName);

    // Dar feedback de audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Dictando ${fieldName === 'name' ? 'nombre' : fieldName === 'address' ? 'dirección' : 'descripción'}`);
      utterance.lang = 'es-ES';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }

    recognitionInstance.onstart = () => {
      console.log('✅ Micrófono activado para campo:', fieldName);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('📝 Texto reconocido:', transcript);
      
      // Para campos de texto, reemplazar el contenido
      if (fieldName === 'type') {
        // Extraer tipo del comando
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('casa')) {
          setValue('type', 'casa');
        } else if (lowerTranscript.includes('trabajo')) {
          setValue('type', 'trabajo');
        } else if (lowerTranscript.includes('parada')) {
          setValue('type', 'parada segura');
        } else {
          setValue('type', 'destino frecuente');
        }
      } else {
        setValue(fieldName, transcript as any);
      }
      
      // Confirmar con audio
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Listo');
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
      
      setIsListening(null);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('❌ Error en reconocimiento de voz:', event.error);
      setIsListening(null);
      
      if (event.error === 'not-allowed') {
        alert('Permiso de micrófono denegado. Por favor habilita el acceso al micrófono.');
      } else if (event.error === 'no-speech') {
        alert('No se detectó voz. Intenta de nuevo hablando más fuerte.');
      } else if (event.error === 'aborted') {
        console.log('Reconocimiento abortado');
      } else {
        alert(`Error: ${event.error}. Intenta de nuevo.`);
      }
    };

    recognitionInstance.onend = () => {
      console.log('🔴 Reconocimiento finalizado');
      setIsListening(null);
    };

    try {
      recognitionInstance.start();
      console.log('🚀 Reconocimiento iniciado correctamente');
    } catch (error) {
      console.error('❌ Error al iniciar reconocimiento:', error);
      setIsListening(null);
      alert('No se pudo iniciar el reconocimiento. Intenta de nuevo.');
    }
  };

  // Función para detener reconocimiento de voz
  const stopVoiceInput = () => {
    setIsListening(null);
  };

  // Función para obtener ubicación actual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener la ubicación actual');
        }
      );
    } else {
      alert('La geolocalización no está soportada en este navegador');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
      {/* Nombre del lugar */}
      <div>
        <label className="block text-base font-semibold mb-2 text-white">
          Nombre del lugar
        </label>
        <div className="relative">
          <input
            type="text"
            {...register('name')}
            className="big-input"
            style={{ 
              borderColor: errors.name ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              marginBottom: 0
            }}
            placeholder="Ej: Mi casa, Oficina principal..."
          />
          <button
            type="button"
            onClick={() => isListening === 'name' ? stopVoiceInput() : startVoiceInput('name')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
            title={isListening === 'name' ? 'Detener grabación' : 'Dictar con voz'}
          >
            <Mic className="w-6 h-6" style={{ color: '#B983FF' }} strokeWidth={2.5} />
          </button>
        </div>
        {errors.name && (
          <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.name.message}</p>
        )}
      </div>

      {/* Tipo de lugar */}
      <div>
        <label className="block text-base font-semibold mb-2 text-white">
          Tipo de lugar
        </label>
        <select
          {...register('type')}
          className="big-input"
          style={{ 
            borderColor: errors.type ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            marginBottom: 0
          }}
        >
          {placeTypes.map((type) => (
            <option key={type.value} value={type.value} style={{ backgroundColor: '#1B1026', color: 'white' }}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.type.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-base font-semibold mb-2 text-white">
          Dirección
        </label>
        <div className="relative">
          <input
            type="text"
            {...register('address')}
            className="big-input"
            style={{ 
              borderColor: errors.address ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              marginBottom: 0
            }}
            placeholder="Ej: Av. Ejemplo #123, Ciudad"
          />
          <button
            type="button"
            onClick={() => isListening === 'address' ? stopVoiceInput() : startVoiceInput('address')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2"
            title={isListening === 'address' ? 'Detener grabación' : 'Dictar con voz'}
          >
            <Mic className="w-6 h-6" style={{ color: '#B983FF' }} strokeWidth={2.5} />
          </button>
        </div>
        {errors.address && (
          <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.address.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-base font-semibold mb-2 text-white">
          Descripción
        </label>
        <div className="relative">
          <textarea
            {...register('description')}
            rows={2}
            className="big-input resize-none"
            style={{ 
              borderColor: errors.description ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)', 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              marginBottom: 0,
              minHeight: '60px'
            }}
            placeholder="Describe brevemente este lugar..."
          />
          <button
            type="button"
            onClick={() => isListening === 'description' ? stopVoiceInput() : startVoiceInput('description')}
            className="absolute right-3 top-3 p-2"
            title={isListening === 'description' ? 'Detener grabación' : 'Dictar con voz'}
          >
            <Mic className="w-6 h-6" style={{ color: '#B983FF' }} strokeWidth={2.5} />
          </button>
        </div>
        {errors.description && (
          <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.description.message}</p>
        )}
      </div>

      {/* Coordenadas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-base font-semibold mb-2 text-white">
            Latitud
          </label>
          <input
            type="number"
            step="any"
            {...register('latitude', { valueAsNumber: true })}
            className="big-input"
            style={{ 
              borderColor: errors.latitude ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              marginBottom: 0
            }}
            placeholder="0"
          />
          {errors.latitude && (
            <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <label className="block text-base font-semibold mb-2 text-white">
            Longitud
          </label>
          <input
            type="number"
            step="any"
            {...register('longitude', { valueAsNumber: true })}
            className="big-input"
            style={{ 
              borderColor: errors.longitude ? '#8B1E3F' : 'rgba(185, 131, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              marginBottom: 0
            }}
            placeholder="0"
          />
          {errors.longitude && (
            <p className="mt-1 text-sm" style={{ color: '#FF6B6B' }}>{errors.longitude.message}</p>
          )}
        </div>
      </div>

      {/* Botón obtener ubicación actual */}
      <button
        type="button"
        onClick={getCurrentLocation}
        className="btn-outline w-full flex items-center justify-center gap-2"
        style={{ borderColor: '#B983FF', color: '#B983FF' }}
      >
        <MapPin className="w-5 h-5" strokeWidth={2.5} />
        Usar mi ubicación actual
      </button>

      {/* Botones de acción */}
      <div className="flex flex-col gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="big-button primary"
        >
          {isLoading ? 'Guardando...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="big-button"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
});
