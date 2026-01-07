// Servicio de reconocimiento y síntesis de voz para perfil
export class VoiceService {
  
  static speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1.0;
      utterance.pitch = 1;
      
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      
      window.speechSynthesis.speak(utterance);
    });
  }

  static isVoiceSupported(): boolean {
    return ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);
  }

  static createRecognition() {
    if (!this.isVoiceSupported()) return null;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    return recognition;
  }

  static processEmailText(text: string): string {
    return text
      .toLowerCase()
      .replace(/\barroba\b/g, '@')
      .replace(/\bpunto\b/g, '.')
      .replace(/\s+/g, ''); // Eliminar espacios
  }

  static startVoiceInput(
    field: string,
    onResult: (value: string) => void,
    onError: () => void,
    setEditField: (field: string) => void,
    isFillingProfile: boolean,
    callback?: () => void
  ) {
    const recognition = this.createRecognition();
    if (!recognition) return;

    setEditField(field);
    
    recognition.onresult = (event: any) => {
      let value = event.results[0][0].transcript;
      
      // Procesar email si es el campo de correo
      if (field === 'email') {
        value = this.processEmailText(value);
      }
      
      console.log('Capturado:', field, '=', value);
      onResult(value);
      setEditField('');
      
      // Llamar callback después de un pequeño delay
      if (callback) {
        setTimeout(() => {
          console.log('Llamando callback para siguiente paso');
          callback();
        }, 1000);
      }
    };

    recognition.onerror = () => {
      console.log('Error en reconocimiento para:', field);
      this.speak('No te escuché bien');
      setEditField('');
    };

    console.log('Iniciando reconocimiento para:', field);
    recognition.start();
  }

  static fillProfileWithVoice(
    startVoiceInput: (field: string, callback?: () => void) => void,
    setIsFillingProfile: (filling: boolean) => void,
    askForEdit: () => void,
    saveToDatabase?: (userData: any) => void
  ) {
    console.log('Iniciando fillProfileWithVoice');
    setIsFillingProfile(true);
    
    const step1 = () => {
      console.log('Step 1: Iniciando');
      this.speak('Vamos a llenar el perfil');
      setTimeout(() => {
        this.speak('Diga su nombre');
        setTimeout(() => {
          console.log('Step 1: Iniciando reconocimiento nombre');
          startVoiceInput('name', step2);
        }, 3000);
      }, 3000);
    };
    
    const step2 = () => {
      console.log('Step 2: Iniciando');
      setTimeout(() => {
        this.speak('Diga su correo');
        setTimeout(() => {
          console.log('Step 2: Iniciando reconocimiento correo');
          startVoiceInput('email', step3);
        }, 3000);
      }, 2000);
    };
    
    const step3 = () => {
      console.log('Step 3: Iniciando');
      setTimeout(() => {
        this.speak('Diga su teléfono');
        setTimeout(() => {
          console.log('Step 3: Iniciando reconocimiento teléfono');
          startVoiceInput('phone', step4);
        }, 3000);
      }, 2000);
    };
    
    const step4 = () => {
      console.log('Step 4: Finalizando');
      setTimeout(() => {
        this.speak('Perfil completado');
        // Guardar en base de datos aquí
        if (saveToDatabase) {
          setTimeout(() => {
            // Obtener datos del localStorage
            const saved = localStorage.getItem('openblind_profile');
            if (saved) {
              const userData = JSON.parse(saved);
              if (userData.name && userData.email && userData.phone) {
                saveToDatabase(userData);
              }
            }
          }, 1000);
        }
        setTimeout(() => {
          askForEdit();
        }, 2000);
      }, 1000);
    };
    
    step1();
  }

  static askForEdit(
    listenForFieldEdit: () => void,
    setIsFillingProfile: (filling: boolean) => void,
    startListening: () => void
  ) {
    const recognition = this.createRecognition();
    if (!recognition) return;

    this.speak('¿Quiere editar la información?');
    
    setTimeout(() => {
      recognition.onresult = (event: any) => {
        const response = event.results[0][0].transcript.toLowerCase();
        
        if (response.includes('sí') || response.includes('si')) {
          this.speak('¿Qué campo quiere editar? Diga: nombre, correo o teléfono');
          setTimeout(() => {
            listenForFieldEdit();
          }, 3000);
        } else if (response.includes('no')) {
          this.speak('¿Quiere ir a otro módulo? Diga: guía, tarjeta, contacto o favoritos');
          setTimeout(() => {
            this.listenForNavigation(setIsFillingProfile);
          }, 3000);
        } else {
          this.speak('No entendí. Diga sí o no');
          setTimeout(() => {
            this.askForEdit(listenForFieldEdit, setIsFillingProfile, startListening);
          }, 2000);
        }
      };

      recognition.onerror = () => {
        this.speak('No te escuché bien');
        setTimeout(() => {
          this.askForEdit(listenForFieldEdit, setIsFillingProfile, startListening);
        }, 2000);
      };

      recognition.start();
    }, 3000);
  }

  static listenForNavigation(setIsFillingProfile: (filling: boolean) => void) {
    const recognition = this.createRecognition();
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setIsFillingProfile(false);
      
      if (command.includes('guía') || command.includes('navegación')) {
        this.speak('Abriendo Guía');
        // Disparar evento personalizado para cambiar pantalla
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'navigation' }));
      } else if (command.includes('tarjeta')) {
        this.speak('Abriendo Tarjeta');
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'card' }));
      } else if (command.includes('contacto')) {
        this.speak('Abriendo Contacto');
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'contact' }));
      } else if (command.includes('favoritos')) {
        this.speak('Abriendo Favoritos');
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'favorites' }));
      } else {
        this.speak('Comando no reconocido. Diga: guía, tarjeta, contacto o favoritos');
        setTimeout(() => {
          this.listenForNavigation(setIsFillingProfile);
        }, 2000);
      }
    };

    recognition.onerror = () => {
      this.speak('No te escuché bien');
      setTimeout(() => {
        this.listenForNavigation(setIsFillingProfile);
      }, 2000);
    };

    recognition.start();
  }

  static listenForFieldEdit(
    startVoiceInput: (field: string, callback?: () => void) => void,
    askForEdit: () => void,
    setIsFillingProfile: (filling: boolean) => void,
    startListening: () => void
  ) {
    const recognition = this.createRecognition();
    if (!recognition) return;

    setTimeout(() => {
      recognition.onresult = async (event: any) => {
        const field = event.results[0][0].transcript.toLowerCase();
        
        if (field.includes('nombre')) {
          await this.speak('Di tu nuevo nombre');
          startVoiceInput('name', async () => {
            await this.speak('Nombre actualizado. ¿Quieres editar otro campo?');
            setTimeout(() => {
              askForEdit();
            }, 1000);
          });
        } else if (field.includes('correo') || field.includes('email')) {
          await this.speak('Di tu nuevo correo electrónico');
          startVoiceInput('email', async () => {
            await this.speak('Correo actualizado. ¿Quieres editar otro campo?');
            setTimeout(() => {
              askForEdit();
            }, 1000);
          });
        } else if (field.includes('teléfono') || field.includes('telefono')) {
          await this.speak('Di tu nuevo número de teléfono');
          startVoiceInput('phone', async () => {
            await this.speak('Teléfono actualizado. ¿Quieres editar otro campo?');
            setTimeout(() => {
              askForEdit();
            }, 1000);
          });
        } else {
          await this.speak('Campo no reconocido. Di: nombre, correo o teléfono');
          setTimeout(() => {
            this.listenForFieldEdit(startVoiceInput, askForEdit, setIsFillingProfile, startListening);
          }, 1000);
        }
      };

      recognition.onerror = async () => {
        await this.speak('No te escuché bien. ¿Quieres ir a otro módulo?');
        setTimeout(() => {
          setIsFillingProfile(false);
          startListening();
        }, 1000);
      };

      recognition.start();
    }, 1000);
  }
}