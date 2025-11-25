import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import RouteBottomCard from './components/RouteBottomCard';
import RouteEditModal, { AnchorLayout } from './components/RouteEditModal';
import RouteFabGroup from './components/RouteFabGroup';
import RouteMapArea from './components/RouteMapArea';
import RouteTopCard from './components/RouteTopCard';

const mockRouteData = {
  time: 15,
  arrival: '20:35',
  distance: 1000,
  desc: 'Most are flat roads',
  path: [[60, 180], [120, 120], [200, 200]],
};

const mockResults = [
  { name: 'Your location', type: 'Current' },
  { name: 'Aula 25', type: 'Classroom' },
  { name: 'Aula 3D', type: 'Classroom' },
  { name: 'Aula 2D', type: 'Classroom' },
  { name: 'Aula Magna', type: 'Lecture Hall' },
  { name: 'Aula 4D', type: 'Classroom' },
  { name: 'Aula 5D', type: 'Classroom' },
];

const FAB_BOTTOM_MARGIN = 6;

const transportModes: Record<string, { icon: string; desc: string }> = {
  car: { icon: 'car', desc: 'Car' },
  bus: { icon: 'bus', desc: 'Bus' },
  male: { icon: 'male', desc: 'Walk' },
  bicycle: { icon: 'bicycle', desc: 'Bicycle' },
};

export default function RouteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [start, setStart] = useState(params.start ? String(params.start) : 'Your location');
  const [end, setEnd] = useState(params.end ? String(params.end) : 'Aula 3D');
  const [mode, setMode] = useState(typeof params.mode === 'string' ? params.mode : 'car');
  const [modeDesc, setModeDesc] = useState(params.modeDesc || 'Car');
  const [duration, setDuration] = useState(params.duration || 0);
  const [arrival, setArrival] = useState(params.arrival || '');
  const [distance, setDistance] = useState(params.distance || 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<'start' | 'end' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [bottomCardHeight, setBottomCardHeight] = useState(0);
  const [anchorLayout, setAnchorLayout] = useState<AnchorLayout | null>(null);
  const [cardLayout, setCardLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const startRef = useRef<any>(null);
  const endRef = useRef<any>(null);

  const filteredResults = useMemo(
    () => inputValue.trim() ? mockResults.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase())) : [],
    [inputValue]
  );

  const handleSwap = () => {
    setStart(end);
    setEnd(start);
  };

  const handleCardLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setCardLayout({ x, y, width, height });
  };

  const handleEdit = (type: 'start' | 'end') => {
    setEditType(type);
    setInputValue(type === 'start' ? start : end);
    setModalVisible(true);
    if (cardLayout) {
      setAnchorLayout({
        x: cardLayout.x,
        y: cardLayout.y + cardLayout.height,
        width: cardLayout.width,
        height: 0,
      });
    } else {
      setAnchorLayout(null);
    }
  };

  const handleModalOk = () => {
    if (editType === 'start') setStart(inputValue || start);
    else if (editType === 'end') setEnd(inputValue || end);
    setModalVisible(false);
  };

  const handleSelectResult = (item: { name: string, type: string }) => {
    setInputValue(item.name);
    setModalVisible(false);
    if (editType === 'start') setStart(item.name);
    else if (editType === 'end') setEnd(item.name);
  };

  const handleAR = () => { alert('AR navigation feature'); };
  const handleVoice = () => { alert('Voice navigation feature'); };
  const handleStartNav = () => { alert('Start navigation'); };

  const routeData = {
    time: Number(duration),
    arrival: String(arrival),
    distance: Number(distance),
    desc: 'Most are flat roads',
    path: [[60, 180], [120, 120], [200, 200]],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>{'< Back'}</Text>
      </TouchableOpacity>
      <RouteTopCard
        start={start}
        end={end}
        onEdit={handleEdit}
        onSwap={handleSwap}
        onCardLayout={handleCardLayout}
      />
      <RouteMapArea>
        <RouteFabGroup
          bottom={bottomCardHeight + FAB_BOTTOM_MARGIN}
          onAR={handleAR}
          onVoice={handleVoice}
          onStartNav={handleStartNav}
        />
      </RouteMapArea>
      <RouteBottomCard
        end={end}
        routeData={routeData}
        mode={mode}
        onEnd={() => router.replace('/(tabs)')}
        onLayout={(e: { nativeEvent: { layout: { height: number } } }) => setBottomCardHeight(e.nativeEvent.layout.height)}
      />
      <RouteEditModal
        visible={modalVisible}
        editType={editType}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        filteredResults={filteredResults}
        onSelect={handleSelectResult}
        anchorLayout={anchorLayout}
      />
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
        <FontAwesome name={transportModes[mode as string]?.icon as any} size={22} color="#23406C" />
        <Text style={{fontSize:20,fontWeight:'bold',marginLeft:8}}>{modeDesc}</Text>
      </View>
      <Text>{duration} min</Text>
      <Text>Arrival time: {arrival}</Text>
      <Text>{distance}m</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E9ECEF' },
  backBtn: { position: 'absolute', top: 44, left: 16, zIndex: 20 },
  backText: { color: '#234169', fontSize: 15, fontFamily: 'Roboto', fontWeight: '500', marginLeft: 6},
});