import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const transportModes = [
  { icon: 'car', label: '5min', desc: 'Car', duration: 5, arrival: '20:10', distance: 1200, png: require('../../assets/images/car.png') },
  { icon: 'bus', label: '7min', desc: 'Bus', duration: 7, arrival: '20:12', distance: 1100, png: require('../../assets/images/bus.png') },
  { icon: 'male', label: '15min', desc: 'Walk', duration: 15, arrival: '20:20', distance: 1000, png: require('../../assets/images/walk.png') },
  { icon: 'bicycle', label: '10min', desc: 'Bicycle', duration: 10, arrival: '20:15', distance: 1050, png: require('../../assets/images/bicycle.png') },
];

export default function RoutePreviewCard({
  selectedMode: selectedModeProp = 2,
  onModeChange,
  duration,
  arrivalTime,
  via = 'Via Passo Buole',
  distance,
  roadDesc = 'Most are flat roads',
  onStart,
  onAddStopover,
  onAR,
}: {
  selectedMode?: number;
  onModeChange?: (idx: number) => void;
  duration?: number;
  arrivalTime?: string;
  via?: string;
  distance?: number;
  roadDesc?: string;
  onStart?: (selectedMode: number) => void;
  onAddStopover?: () => void;
  onAR?: () => void;
}) {
  const [internalSelected, setInternalSelected] = useState(selectedModeProp ?? 0);
  useEffect(() => {
    setInternalSelected(selectedModeProp ?? 0);
  }, [selectedModeProp]);
  const selectedMode = onModeChange ? selectedModeProp : internalSelected;
  const handleTabPress = (idx: number) => {
    if (onModeChange) onModeChange(idx);
    else setInternalSelected(idx);
  };
  const mode = transportModes[selectedMode];
  return (
    <View style={styles.outerCard}>
      {/* 顶部白色部分 */}
      <View style={styles.topWhite}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{mode.desc}</Text>
          <View style={styles.topActions}>
            <TouchableOpacity><FontAwesome name="send" size={20} color="#23406C" /></TouchableOpacity>
            <TouchableOpacity><FontAwesome name="close" size={20} color="#23406C" /></TouchableOpacity>
          </View>
        </View>
        {/* tab栏 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
          {transportModes.map((mode, idx) => (
            <TouchableOpacity
              key={mode.icon}
              onPress={() => handleTabPress(idx)}
              style={[styles.tabItem, idx === selectedMode && styles.tabItemActive]}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={mode.png}
                  style={{ width: 25, height: 25, tintColor: idx === selectedMode ? '#F9B233' : '#23406C' }}
                />
                <Text style={[styles.tabLabel, idx === selectedMode && styles.tabLabelActive, { marginLeft: 8, marginTop: 0 }]}>
                  {mode.label}
                </Text>
              </View>
              {idx === selectedMode && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* 下半部分蓝色 */}
      <View style={styles.bottomBlue}>
        <Text style={styles.duration}>{mode.duration} min</Text>
        <Text style={styles.arrival}>
          Arrival time: <Text style={styles.arrivalTime}>{mode.arrival}</Text> Passing through {via}
        </Text>
        <Text style={styles.distance}>{mode.distance}m  <Text style={styles.roadDesc}>{roadDesc}</Text></Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => onStart?.(selectedMode)}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outerCard: {
    marginHorizontal: 0,
    marginBottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  topWhite: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#23406C',
  },
  topActions: {
    flexDirection: 'row',
    gap: 12,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 4,
    paddingBottom: 20
  },
  tabItem: {
    alignItems: 'center',
    marginRight: 24,
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabItemActive: {
    // backgroundColor: '#FFF7E0', // 移除高亮背景色
  },
  tabLabel: {
    color: '#23406C',
    fontSize: 12,
  },
  tabLabelActive: {
    color: '#F9B233',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 3,
    backgroundColor: '#F9B233',
    borderRadius: 2,
    width: '100%',
    position: 'absolute',
    bottom: -18,
    },
  bottomBlue: {
    backgroundColor: '#23406C',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 1,
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