import { MapPin, Home, Briefcase, Navigation, Volume2, Edit, Trash2 } from 'lucide-react';
import type { Place } from '../types/place.types';

interface PlaceCardProps {
  place: Place;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const placeIcons = {
  'parada segura': MapPin,
  'destino frecuente': Navigation,
  'casa': Home,
  'trabajo': Briefcase,
};

export const PlaceCard = ({ place, onEdit, onDelete }: PlaceCardProps) => {
  const Icon = placeIcons[place.type] || MapPin;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeak = () => {
    const text = `${place.name}. Dirección: ${place.address}. Descripción: ${place.description}`;
    speak(text);
  };

  return (
    <div 
      className="relative rounded-3xl p-6 shadow-lg mb-6"
      style={{ 
        backgroundColor: 'transparent',
        border: '2px solid rgba(185, 131, 255, 0.3)',
        marginBottom: '24px'
      }}
    >
      {/* Punto indicador en esquina superior derecha */}
      <div 
        className="absolute top-6 right-6 w-3 h-3 rounded-full"
        style={{ backgroundColor: '#B983FF' }}
      />
      
      {/* Header con icono y nombre */}
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="p-3 rounded-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4B1F6F, #7A3EB1)' }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-black mb-2" style={{ color: 'white' }}>
            {place.name}
          </h3>
          <p className="text-base font-semibold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {place.address}
          </p>
        </div>
      </div>

      {/* Descripción */}
      {place.description && (
        <p className="text-sm font-medium mb-5 leading-relaxed" style={{ color: 'white' }}>
          {place.description}
        </p>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-around pt-4 border-t-2" style={{ borderColor: 'rgba(255, 255, 255, 0.7)' }}>
        <button
          onClick={handleSpeak}
          className="flex flex-col items-center gap-1 px-4 py-2 transition-all hover:scale-110"
        >
          <Volume2 className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} strokeWidth={2.5} />
          <span className="text-sm font-bold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Escuchar
          </span>
        </button>

        {onEdit && (
          <button
            onClick={() => onEdit(place.id)}
            className="flex flex-col items-center gap-1 px-4 py-2 transition-all hover:scale-110"
          >
            <Edit className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} strokeWidth={2.5} />
            <span className="text-sm font-bold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Editar
            </span>
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(place.id)}
            className="flex flex-col items-center gap-1 px-4 py-2 transition-all hover:scale-110"
          >
            <Trash2 className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} strokeWidth={2.5} />
            <span className="text-sm font-bold" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Eliminar
            </span>
          </button>
        )}
      </div>
    </div>
  );
};