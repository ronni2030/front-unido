import * as React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MotiView } from 'moti';
import { useEmergencyContacts } from '../hooks/useEmergencyContacts';

export const ContactsScreen = () => {
  const { contacts, readContacts, deleteContact } = useEmergencyContacts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CONTACTOS DE EMERGENCIA</Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100 }}
            style={styles.card}
          >
            <View style={styles.sideAccent} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}><Text style={styles.badgeText}>{index + 1}</Text></View>
                <Text style={styles.dateText}>04/01/2026</Text>
              </View>
              <Text style={styles.nameText}>{item.nombre} {item.apellido}</Text>
              <Text style={styles.subText}>{item.parentesco} • {item.telefono}</Text>
            </View>

            <TouchableOpacity onPress={() => deleteContact(item.id)} style={styles.deleteArea}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </MotiView>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.voiceBtn} onPress={readContacts}>
          <Text style={styles.voiceBtnText}>🎙️ LEER LISTA (VOZ)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1433' },
  header: { padding: 25, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  listPadding: { padding: 20 },
  card: {
    backgroundColor: '#D1D1D1',
    borderRadius: 20,
    flexDirection: 'row',
    height: 100,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4
  },
  sideAccent: { width: 12, backgroundColor: '#3D2C6D' },
  cardContent: { flex: 1, padding: 15, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  badge: { backgroundColor: '#BDBDBD', paddingHorizontal: 6, borderRadius: 4, marginRight: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#555' },
  dateText: { color: '#888', fontSize: 10 },
  nameText: { fontSize: 20, fontWeight: 'bold', color: '#1A1433' },
  subText: { color: '#666', fontSize: 13 },
  deleteArea: { width: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' },
  deleteIcon: { fontSize: 18 },
  footer: { padding: 25, backgroundColor: '#251B45', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  voiceBtn: { backgroundColor: '#6B599E', padding: 18, borderRadius: 30, alignItems: 'center' },
  voiceBtnText: { color: '#FFF', fontWeight: 'bold' }
});