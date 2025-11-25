import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function RouteFabGroup({ bottom, onAR, onVoice, onStartNav }) {
  return (
    <View style={[styles.fabCol, { bottom }]}>
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
  fabCol: { position: 'absolute', right: 18, zIndex: 30 },
  fabBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', borderWidth: 2, borderColor: '#234169', alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
});