import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlace } from '../hooks/usePlaces';
import { usePlaceActions } from '../hooks/usePlaceActions';
import { PlaceForm } from '../components/PlaceForm';
import { PlaceTypeBadge } from '../components/PlaceTypeBadge';
import type { PlaceFormData } from '../types/place.types';
import { 
  ArrowLeft, 
  Volume2, 
  Edit, 
  Trash2, 
  MapPin, 
  Home, 
  Briefcase, 
  Navigation,
  AlertCircle,
  CheckCircle,
  XCircle,
  Map
} from 'lucide-react';

const placeIcons = {
  'parada segura': MapPin,
  'destino frecuente': Navigation,
  'casa': Home,
  'trabajo': Briefcase,
};

export const PlaceDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { place, loading, error } = usePlace(id || '');
  const { updatePlace, deletePlace, loading: actionLoading, error: actionError } = usePlaceActions();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Función para leer la información del lugar en voz alta
  const readPlaceInfo = () => {
    if (!place) return;

    const text = `
      Información del lugar: ${place.name}.
      Tipo: ${place.type}.
      Dirección: ${place.address}.
      Descripción: ${place.description}.
      Coordenadas: latitud ${place.latitude}, longitud ${place.longitude}.
    `;
    
    speak(text);
  };

  // Función para usar Web Speech API
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Cancelar cualquier lectura anterior
      window.speechSynthesis.speak(utterance);
    } else {
      alert('La síntesis de voz no está soportada en este navegador');
    }
  };

  const handleUpdate = async (data: PlaceFormData) => {
    if (!id) return;
    
    const result = await updatePlace(id, data);
    
    if (result) {
      setShowSuccess(true);
      setIsEditing(false);
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    const success = await deletePlace(id);
    
    if (success) {
      navigate('/places');
    }
  };

  // Abrir en Google Maps
  const openInMaps = () => {
    if (!place) return;
    const url = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner"></div>
          <span className="text-lg text-white">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/places')}
            className="flex items-center gap-2 mb-6 text-white opacity-70 hover:opacity-100"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="info-card" style={{ 
            backgroundColor: 'rgba(139, 30, 63, 0.2)',
            borderColor: 'rgba(139, 30, 63, 0.4)'
          }}>
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Error al cargar el lugar</p>
                <p className="text-sm opacity-70 mt-1">{error || 'Lugar no encontrado'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const Icon = placeIcons[place.type];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="p-6 mb-6">
          <button
            onClick={() => navigate('/places')}
            className="flex items-center gap-2 mb-4 text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-start justify-between text-white">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-4 rounded-2xl gradient-primary">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
                <PlaceTypeBadge type={place.type} />
              </div>
            </div>
            <button
              onClick={readPlaceInfo}
              className="p-4 rounded-full transition-transform hover:scale-110"
              style={{ backgroundColor: 'rgba(185, 131, 255, 0.2)' }}
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mensajes de éxito/error */}
        {showSuccess && (
          <div className="info-card mb-6" style={{ 
            backgroundColor: 'rgba(31, 122, 111, 0.2)',
            borderColor: 'rgba(31, 122, 111, 0.4)'
          }}>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">¡Lugar actualizado exitosamente!</span>
            </div>
          </div>
        )}

        {actionError && (
          <div className="info-card mb-6" style={{ 
            backgroundColor: 'rgba(139, 30, 63, 0.2)',
            borderColor: 'rgba(139, 30, 63, 0.4)'
          }}>
            <div className="flex items-center gap-3 text-white">
              <XCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm opacity-70 mt-1">{actionError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Vista de detalle */}
        {!isEditing && (
          <div className="space-y-4">
            {/* Información principal */}
            <div className="info-card">
              <h3 className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#B983FF' }}>
                Dirección
              </h3>
              <p className="text-xl text-white">{place.address}</p>
            </div>

            {place.description && (
              <div className="info-card">
                <h3 className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#B983FF' }}>
                  Descripción
                </h3>
                <p className="text-lg text-light">{place.description}</p>
              </div>
            )}

            {/* Coordenadas */}
            <div className="info-card">
              <h3 className="text-base font-bold uppercase tracking-wide mb-4" style={{ color: '#B983FF' }}>
                Coordenadas
              </h3>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(185, 131, 255, 0.1)' }}>
                <MapPin className="w-6 h-6" style={{ color: '#B983FF' }} strokeWidth={2.5} />
                <span className="font-mono text-lg text-white">
                  {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Mapa */}
            <div className="info-card overflow-hidden" style={{ padding: 0 }}>
              <div className="aspect-video relative">
                <iframe
                  title="Mapa del lugar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.01},${place.latitude - 0.01},${place.longitude + 0.01},${place.latitude + 0.01}&layer=mapnik&marker=${place.latitude},${place.longitude}`}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                disabled={actionLoading}
                className="flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), #5B278A)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  padding: '18px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 10px 30px rgba(75, 31, 111, 0.25)',
                  transition: 'all 0.25s'
                }}
              >
                <Edit className="w-5 h-5" strokeWidth={2.5} />
                <span style={{ color: 'white' }}>Editar lugar</span>
              </button>
              <button
                onClick={openInMaps}
                disabled={actionLoading}
                className="flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary), #8E54CC)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  padding: '18px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 10px 30px rgba(122, 62, 177, 0.25)',
                  transition: 'all 0.25s'
                }}
              >
                <Map className="w-5 h-5" strokeWidth={2.5} />
                <span style={{ color: 'white' }}>Abrir mapa</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={actionLoading}
                className="flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  padding: '18px 24px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  boxShadow: '0 10px 30px rgba(220, 38, 38, 0.25)',
                  transition: 'all 0.25s'
                }}
              >
                <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                <span style={{ color: 'white' }}>Eliminar</span>
              </button>
            </div>
          </div>
        )}

        {/* Vista de edición */}
        {isEditing && (
          <div className="info-card">
            <h2 className="text-2xl font-bold mb-6 text-white">Editar Lugar</h2>
            <PlaceForm
              initialData={{
                name: place.name,
                address: place.address,
                description: place.description,
                type: place.type,
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isLoading={actionLoading}
              submitLabel="Guardar cambios"
            />
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="info-card max-w-md w-full mx-4">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                ¿Eliminar "{place.name}"?
              </h3>
              <p className="text-base mb-6 text-light">
                Esta acción no se puede deshacer. El lugar será eliminado permanentemente de tu lista de favoritos.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 text-white font-bold text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, var(--error), #A63952)' }}
                >
                  {actionLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 font-bold text-base rounded-xl disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
