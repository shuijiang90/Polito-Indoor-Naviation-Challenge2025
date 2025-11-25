import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import RouteEditModal, { AnchorLayout } from './components/RouteEditModal';
import RouteMapArea from './components/RouteMapArea';
import RoutePreviewCard from './components/RoutePreviewCard';
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

export default function RouteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [start, setStart] = useState('Your location');
  const [end, setEnd] = useState(params.room ? String(params.room) : 'Aula 3D');
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/map-fullscreen')}>
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
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 88,
            zIndex: 10
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 2,
              borderColor: '#234169',
            }}
            onPress={handleVoice}
          >
            <MaterialIcons name="volume-up" size={28} color="#234169" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 2,
              borderColor: '#234169',
            }}
            onPress={handleStartNav}
          >
            <Ionicons name="navigate" size={28} color="#234169" />
          </TouchableOpacity>
        </View>
      </RouteMapArea>
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
      <RoutePreviewCard
        duration={15}
        arrivalTime="20:35"
        via="Via Passo Buole"
        distance={1000}
        roadDesc="Most are flat roads"
        onStart={(selectedMode) => {
          const mode = [
            { icon: 'car', desc: 'Car', duration: 5, arrival: '20:10', distance: 1200 },
            { icon: 'bus', desc: 'Bus', duration: 7, arrival: '20:12', distance: 1100 },
            { icon: 'male', desc: 'Walk', duration: 15, arrival: '20:20', distance: 1000 },
            { icon: 'bicycle', desc: 'Bicycle', duration: 10, arrival: '20:15', distance: 1050 },
          ][selectedMode];
          router.push({
            pathname: '/route',
            params: {
              start,
              end,
              mode: mode.icon,
              modeDesc: mode.desc,
              duration: mode.duration,
              arrival: mode.arrival,
              distance: mode.distance,
            }
          });
        }}
        onAddStopover={() => {}}
        onAR={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E9ECEF' },
  backBtn: { position: 'absolute', top:44, left: 16, zIndex: 20 },
  backText: { color: '#234169', fontSize: 15, fontFamily: 'Roboto', fontWeight: '500', marginLeft: 6},
});