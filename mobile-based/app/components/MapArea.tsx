import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MapArea() {
  // you can pass route data as props
  const routeW = 200;
  const routeH = 100;
  return (
    <View style={styles.mapArea}>
      <View style={styles.mockMapBG} />
      <View style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: routeW,
        height: routeH,
        transform: [{ translateX: -routeW/2 }, { translateY: -routeH/2 }],
      }}>
        <View style={[styles.mapDot, {left: 0, top: routeH/2-9}]} />
        <View style={{position:'absolute', left:0, top:0}}>
          <View style={{position:'absolute', left:18, top:routeH/2, width:80, height:2, backgroundColor:'#234169', opacity:0.3, borderRadius:1, borderStyle:'dashed'}} />
          <View style={{position:'absolute', left:98, top:routeH/2, width:2, height:20, backgroundColor:'#234169', opacity:0.3, borderRadius:1, borderStyle:'dashed'}} />
          <View style={{position:'absolute', left:98, top:routeH/2+20, width:70, height:2, backgroundColor:'#234169', opacity:0.3, borderRadius:1, borderStyle:'dashed'}} />
        </View>
        <FontAwesome name="map-marker" size={30} color="#234169" style={{position:'absolute', left: routeW-30, top: routeH/2-15}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: { flex: 1, width: '100%', height: '100%', position:'relative', justifyContent:'flex-end' },
  mockMapBG: { ...StyleSheet.absoluteFillObject, backgroundColor: '#E9ECEF', opacity:0.7 },
  mapDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#234169', borderWidth: 4, borderColor: '#fff', position: 'absolute' },
});