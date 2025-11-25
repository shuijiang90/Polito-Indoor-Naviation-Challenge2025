import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RouteTopCardProps {
  start: string;
  end: string;
  onEdit: (type: 'start' | 'end') => void;
  onSwap: () => void;
  onStartLayout?: (e: LayoutChangeEvent) => void;
  onEndLayout?: (e: LayoutChangeEvent) => void;
  onCardLayout?: (e: LayoutChangeEvent) => void;
}

export default function RouteTopCard({ start, end, onEdit, onSwap, onStartLayout, onEndLayout, onCardLayout }: RouteTopCardProps) {
  return (
    <View style={styles.routeCard} onLayout={onCardLayout}>
      <View style={styles.routeRow}>
        <FontAwesome name="circle" size={16} color="#234169" style={{marginRight:10}} />
        <TouchableOpacity onPress={() => onEdit('start')} onLayout={onStartLayout}>
          <Text style={styles.routeText}>{start}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft:'auto', marginRight:2}}>
          <MaterialIcons name="more-vert" size={18} color="#234169" />
        </TouchableOpacity>
      </View>
      <View style={styles.routeDivider} />
      <View style={styles.routeRow}>
        <FontAwesome name="map-marker" size={20} color="#234169" style={{marginRight:12}} />
        <TouchableOpacity onPress={() => onEdit('end')} onLayout={onEndLayout}>
          <Text style={styles.routeText}>{end}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft:'auto', marginRight:2}} onPress={onSwap}>
          <MaterialIcons name="swap-vert" size={20} color="#234169" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  routeCard: { position: 'absolute', top: 80, left: 24, right: 24, backgroundColor: '#fff', borderRadius: 10, borderWidth:2, borderColor:'#234169', padding: 12, zIndex: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  routeText: { fontSize: 14, color: '#234169', fontFamily: 'Roboto', fontWeight: '500' },
  routeDivider: { height: 1, backgroundColor: '#E9ECEF', marginVertical: 12, marginLeft: 24, marginRight: 24 },
});