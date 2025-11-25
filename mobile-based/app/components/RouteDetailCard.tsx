import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const transportModes: { icon: string; label: string; png: any }[] = [
  { icon: 'car', label: '5min', png: require('../../assets/images/car.png') },
  { icon: 'bus', label: '7min', png: require('../../assets/images/bus.png') },
  { icon: 'male', label: '15min', png: require('../../assets/images/walk.png') }, // walk
  { icon: 'bicycle', label: '10min', png: require('../../assets/images/bicycle.png') },
];

interface RouteDetailCardProps {
  selectedMode?: number;
  onModeChange?: (idx: number) => void;
  duration?: number;
  arrivalTime?: string;
  via?: string;
  distance?: number;
  roadDesc?: string;
  onStart?: () => void;
  onAddStopover?: () => void;
  onAR?: () => void;
}

export default function RouteDetailCard({
  selectedMode = 2, // 默认步行
  onModeChange,
  duration = 15,
  arrivalTime = '20:35',
  via = 'Via Passo Buole',
  distance = 1000,
  roadDesc = 'Most are flat roads',
  onStart,
  onAddStopover,
  onAR,
}: RouteDetailCardProps) {
  return (
    <View style={styles.card}>
      {/* 顶部Tab栏 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {transportModes.map((mode, idx) => (
          <TouchableOpacity key={mode.icon} onPress={() => onModeChange?.(idx)} style={styles.tabItem}>
            <Image
              source={mode.png}
              style={{ width: 20, height: 20, tintColor: idx === selectedMode ? '#F9B233' : '#fff' }}
            />
            <Text style={[styles.tabLabel, idx === selectedMode && styles.tabLabelActive]}>
              {mode.label}
            </Text>
            {idx === selectedMode && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* 主要信息 */}
      <Text style={styles.duration}>{duration} min</Text>
      <Text style={styles.arrival}>
        Arrival time: <Text style={styles.arrivalTime}>{arrivalTime}</Text> Passing through {via}
      </Text>
      <Text style={styles.distance}>{distance}m  <Text style={styles.roadDesc}>{roadDesc}</Text></Text>
      {/* 操作按钮 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <FontAwesome name="play" size={18} color="#2D6BBA" />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAddStopover}>
          <MaterialIcons name="add-location-alt" size={18} color="#2D6BBA" />
          <Text style={styles.buttonText}>Add a stopover point</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAR}>
          <MaterialIcons name="camera" size={18} color="#2D6BBA" />
          <Text style={styles.buttonText}>AR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#23406C',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    paddingBottom: 32,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    marginRight: 24,
    position: 'relative',
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#F9B233',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#F9B233',
    borderRadius: 2,
    width: 32,
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -16,
  },
  duration: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  arrival: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  arrivalTime: {
    color: '#F9B233',
    fontWeight: 'bold',
  },
  distance: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  roadDesc: {
    color: '#fff',
    fontSize: 13,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  buttonText: {
    color: '#2D6BBA',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
});