import { useState } from 'react';
import type { ContactoEmergencia } from '../types';
import * as Speech from 'expo-speech';

export const useEmergencyContacts = () => {
  const [contacts, setContacts] = useState<ContactoEmergencia[]>([]);

  const addContact = (contact: Omit<ContactoEmergencia, 'id'>) => {
    const newContact: ContactoEmergencia = { 
      ...contact, 
      id: Date.now().toString() 
    };
    setContacts((prev) => [...prev, newContact]);
    
    // Feedback por voz
    if (Speech.speak) {
      Speech.speak("Contacto guardado correctamente");
    }
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c: ContactoEmergencia) => c.id !== id));
    Speech.speak("Contacto eliminado");
  };

  const readContacts = () => {
    if (contacts.length === 0) {
      Speech.speak("No tienes contactos registrados");
      return;
    }
    contacts.forEach((c: ContactoEmergencia) => {
      Speech.speak(`${c.nombre} ${c.apellido}, relación: ${c.parentesco}`);
    });
  };

  return { contacts, addContact, deleteContact, readContacts };
};