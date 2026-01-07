import { useState } from 'react';
import { VoiceService } from './services/voice';
import { UsersApiService } from '../../services/api/users';

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export const useProfile = () => {
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('openblind_profile');
    return saved ? JSON.parse(saved) : { name: '', email: '', phone: '' };
  });
  const [editField, setEditField] = useState('');
  const [isFillingProfile, setIsFillingProfile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateUserData = (field: string, value: string) => {
    console.log('Actualizando campo:', field, 'con valor:', value);
    setUserData(prevData => {
      const newUserData = { ...prevData, [field]: value };
      localStorage.setItem('openblind_profile', JSON.stringify(newUserData));
      return newUserData;
    });
  };

  const saveToDatabase = (userData: UserData) => {
    console.log('Enviando a backend:', userData);
    UsersApiService.saveUser(userData)
      .then((result) => {
        console.log('Respuesta del backend:', result);
        VoiceService.speak('Perfil guardado en la base de datos');
      })
      .catch((error) => {
        console.error('Error del backend:', error);
        VoiceService.speak('Error al guardar en la base de datos');
      });
  };

  const startVoiceInput = (field: string, callback?: () => void) => {
    VoiceService.startVoiceInput(
      field,
      (value) => updateUserData(field, value),
      () => {}, // onError
      setEditField,
      isFillingProfile,
      callback
    );
  };

  const fillProfileWithVoice = async () => {
    if (isProcessing) return; // Evitar múltiples ejecuciones
    setIsProcessing(true);
    
    await VoiceService.fillProfileWithVoice(
      startVoiceInput,
      setIsFillingProfile,
      askForEdit,
      saveToDatabase
    );
    
    setIsProcessing(false);
  };

  const askForEdit = () => {
    VoiceService.askForEdit(
      listenForFieldEdit,
      setIsFillingProfile,
      () => {} // startListening - se maneja en el componente padre
    );
  };

  const listenForFieldEdit = () => {
    VoiceService.listenForFieldEdit(
      startVoiceInput,
      askForEdit,
      setIsFillingProfile,
      () => {} // startListening - se maneja en el componente padre
    );
  };

  const deleteProfile = () => {
    const emptyProfile = { name: '', email: '', phone: '' };
    setUserData(emptyProfile);
    localStorage.setItem('openblind_profile', JSON.stringify(emptyProfile));
    VoiceService.speak('Perfil eliminado');
  };

  return {
    userData,
    editField,
    isFillingProfile,
    startVoiceInput,
    fillProfileWithVoice,
    deleteProfile,
    saveToDatabase
  };
};