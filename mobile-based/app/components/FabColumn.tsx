import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const floorOptions = ['GF', '-1F', '1F', '2F', '3F', '4F'];

export default function FabColumn({
  floor, setFloor, showFloorDropdown, setShowFloorDropdown,
  onAR, onVoice, onStartNav, bottomCardHeight
}) {
  return (
    <View style={[styles.fabCol, { bottom: bottomCardHeight + 6 }]}>
      <TouchableOpacity style={styles.floorSwitcher} onPress={() => setShowFloorDropdown(v => !v)}>
        <Text style={styles.floorSwitcherText}>{floor}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#234169" />
      </TouchableOpacity>
      <Modal visible={showFloorDropdown} transparent animationType="fade">
        <TouchableOpacity style={styles.floorDropdownMask} activeOpacity={1} onPress={() => setShowFloorDropdown(false)}>
          <View style={styles.floorDropdown}>
            {floorOptions.map(f => (
              <TouchableOpacity key={f} onPress={() => { setFloor(f); setShowFloorDropdown(false); }} style={styles.floorDropdownItem}>
                <Text style={styles.floorDropdownText}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity style={styles.fabBtn} onPress={onAR}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={28} color="#234169" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fabBtn} onPress={onVoice}>
        <MaterialIcons name="volume-up" size={28} color="#234169" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fabBtn} onPress={onStartNav}>
        <Ionicons name="navigate" size={28} color="#234169" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fabCol: { position: 'absolute', right: 18, zIndex: 30, alignItems: 'center' },
  fabBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', borderWidth: 2, borderColor: '#234169', alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  floorSwitcher: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#234169', width: 64, height: 36, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, paddingHorizontal: 8 },
  floorSwitcherText: { color: '#234169', fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginRight: 2 },
  floorDropdownMask: { flex: 1, backgroundColor: 'rgba(0,0,0,0.08)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  floorDropdown: { marginTop: 70, marginRight: 18, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#234169', zIndex: 40, minWidth: 80 },
  floorDropdownItem: { paddingHorizontal: 16, paddingVertical: 10 },
  floorDropdownText: { color: '#234169', fontSize: 16 },
});