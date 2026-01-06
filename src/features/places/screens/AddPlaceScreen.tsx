import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaceActions } from '../hooks/usePlaceActions';
import { PlaceForm } from '../components/PlaceForm';
import type { PlaceFormRef } from '../components/PlaceForm';
import type { PlaceFormData, PlaceType } from '../types/place.types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const AddPlaceScreen = () => {
  const navigate = useNavigate();
  const { createPlace, loading } = usePlaceActions();
  const [showSuccess, setShowSuccess] = useState(false);
  const [voiceStep, setVoiceStep] = useState(-1); // -1 = pregunta inicial
  const recognitionRef = useRef<any>(null);
  const formRef = useRef<PlaceFormRef>(null);
  const formDataRef = useRef<Partial<PlaceFormData>>({});

  const steps = [
    { field: 'name', question: 'Por favor, dime el nombre del lugar' },
    { field: 'type', question: 'Dime el tipo de lugar: casa, trabajo, parada segura, o destino frecuente' },
    { field: 'address', question: 'Cuál es la dirección del lugar' },
    { field: 'description', question: 'Quieres agregar una descripción? Di sí o no' },
  ];

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.onend = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const initRecognition = () => {
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

  const processVoiceStep = async (step: number) => {
    if (step >= steps.length) {
      await confirmSave();
      return;
    }

    const currentStep = steps[step];
    await speak(currentStep.question);

    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('📝 Respuesta de voz:', transcript);

      if (currentStep.field === 'description') {
        if (transcript.includes('no')) {
          formDataRef.current.description = '';
          formRef.current?.setValue('description', '');
          await speak('De acuerdo, sin descripción');
          setVoiceStep(prev => prev + 1);
          return;
        } else if (transcript.includes('si') || transcript.includes('sí')) {
          await speak('Dime la descripción');
          const descRecognition = initRecognition();
          if (!descRecognition) return;
          
          descRecognition.onresult = async (e: any) => {
            const desc = e.results[0][0].transcript;
            formDataRef.current.description = desc;
            formRef.current?.setValue('description', desc);
            console.log('✅ Descripción guardada:', desc);
            await speak('Descripción guardada');
            setVoiceStep(prev => prev + 1);
          };
          descRecognition.start();
          return;
        }
      } else if (currentStep.field === 'type') {
        let type: PlaceType = 'destino frecuente';
        if (transcript.includes('casa')) type = 'casa';
        else if (transcript.includes('trabajo')) type = 'trabajo';
        else if (transcript.includes('parada')) type = 'parada segura';
        
        formDataRef.current.type = type;
        formRef.current?.setValue('type', type);
        console.log('✅ Tipo guardado:', type);
        await speak(`Tipo ${type} guardado`);
        setVoiceStep(prev => prev + 1);
        return;
      } else {
        formDataRef.current[currentStep.field as keyof PlaceFormData] = transcript as any;
        formRef.current?.setValue(currentStep.field, transcript);
        console.log(`✅ ${currentStep.field} guardado:`, transcript);
        await speak('Guardado');
        setVoiceStep(prev => prev + 1);
        return;
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Error en voz:', event.error);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        speak('No te escuché bien, intenta de nuevo');
        setTimeout(() => processVoiceStep(step), 1500);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Error al iniciar reconocimiento:', e);
    }
  };

  const confirmSave = async () => {
    await speak('Todos los campos completados. Deseas guardar el lugar?');
    
    const recognition = initRecognition();
    if (!recognition) return;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      if (transcript.includes('si') || transcript.includes('sí') || transcript.includes('guardar')) {
        await speak('Guardando lugar');
        formRef.current?.submitForm();
      } else {
        await speak('Cancelado');
        setVoiceStep(-1);
      }
    };

    recognition.start();
  };

  useEffect(() => {
    if (voiceStep >= 0 && voiceStep < steps.length) {
      setTimeout(() => processVoiceStep(voiceStep), 1000);
    } else if (voiceStep >= steps.length) {
      setTimeout(() => confirmSave(), 1000);
    }
  }, [voiceStep]);

  useEffect(() => {
    // Preguntar si quiere usar el asistente de voz
    const askInitial = async () => {
      await speak('Bienvenido a crear lugar. Quieres usar el asistente de voz para llenar el formulario? Di sí o no');
      
      const recognition = initRecognition();
      if (!recognition) return;
      
      recognitionRef.current = recognition;
      
      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('📝 Respuesta inicial:', transcript);
        
        if (transcript.includes('si') || transcript.includes('sí')) {
          await speak('Perfecto. Empecemos');
          setVoiceStep(0);
        } else {
          await speak('De acuerdo. Puedes llenar el formulario manualmente');
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Error en pregunta inicial:', event.error);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          speak('Puedes llenar el formulario manualmente');
        }
      };
      
      try {
        recognition.start();
      } catch (e) {
        console.error('Error al iniciar pregunta inicial:', e);
      }
    };

    setTimeout(() => askInitial(), 1000);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSubmit = async (data: PlaceFormData) => {
    const result = await createPlace(data);
    
    if (result) {
      setShowSuccess(true);
      await speak('Lugar guardado exitosamente');
      setTimeout(() => {
        navigate('/places');
      }, 2000);
    }
  };

  const handleCancel = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    navigate('/places');
  };

  return (
    <div className="pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-6 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 mb-4 text-white opacity-70 hover:opacity-100 transition-opacity font-semibold"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            Volver
          </button>
          
          <h1 className="text-4xl font-black text-white mb-2">Nuevo Lugar</h1>
          <p className="text-white opacity-70 text-base font-medium">
            Registra un nuevo lugar favorito
          </p>
        </div>

        {/* Formulario */}
        <div className="px-4">
          <PlaceForm
            ref={formRef}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
            submitLabel="Guardar lugar"
          />
        </div>

        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="px-4 py-4">
            <div className="info-card" style={{ 
              backgroundColor: 'rgba(31, 122, 111, 0.2)',
              borderColor: 'rgba(31, 122, 111, 0.4)'
            }}>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-semibold text-lg">¡Lugar creado exitosamente!</p>
                  <p className="text-sm opacity-70 mt-1">Volviendo a lugares favoritos...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
