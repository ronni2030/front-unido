import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const ContactForm = ({ onSave }: any) => {
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', parentesco: '' });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>NUEVO CONTACTO</Text>
      <TextInput 
        placeholder="Nombre" 
        style={styles.input} 
        placeholderTextColor="#B0A7C9"
        onChangeText={(v) => setForm({...form, nombre: v})}
      />
      <TextInput 
        placeholder="Parentesco (Ej: Madre)" 
        style={styles.input} 
        placeholderTextColor="#B0A7C9"
        onChangeText={(v) => setForm({...form, parentesco: v})}
      />
      <TextInput 
        placeholder="Teléfono" 
        keyboardType="phone-pad"
        style={styles.input} 
        placeholderTextColor="#B0A7C9"
        onChangeText={(v) => setForm({...form, telefono: v})}
      />
      <TouchableOpacity style={styles.btn} onPress={() => onSave(form)}>
        <Text style={styles.btnText}>GUARDAR CONTACTO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1433', padding: 30 },
  label: { color: 'white', fontSize: 18, marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
  input: { backgroundColor: '#3D2C6D', color: 'white', padding: 18, borderRadius: 15, marginBottom: 15, fontSize: 16 },
  btn: { backgroundColor: '#FF4C4C', padding: 20, borderRadius: 35, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});