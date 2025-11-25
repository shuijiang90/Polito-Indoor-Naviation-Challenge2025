import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import BackButton from './components/BackButton';
import BottomCard from './components/BottomCard';
import EditModal from './components/EditModal';
import FabColumn from './components/FabColumn';
import MapArea from './components/MapArea';
import NavigationInstructionBar from './components/NavigationInstructionBar';

const mockRouteData = {
  time: 15,
  arrival: '20:35',
  distance: 1000,
  desc: 'Most are flat roads',
  path: [[60, 180], [120, 120], [200, 200]],
};

const mockResults = [
  'Your location',
  'Aula 25',
  'Aula 3D',
  'Aula 2D',
  'Aula Magna',
  'Aula 4D',
  'Aula 5D',
];

export default function IndoorNavigation() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [start, setStart] = useState('Your location');
  const [end, setEnd] = useState(params.room ? String(params.room) : 'Aula 3D');
  const [modalVisible, setModalVisible] = useState(false);
  const [editType, setEditType] = useState<'start' | 'end' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [bottomCardHeight, setBottomCardHeight] = useState(0);
  const [floor, setFloor] = useState('GF');
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);

  // AR/Voice/Start  悬浮按钮事件
  const handleAR = () => { alert('AR navigation feature'); };
  const handleVoice = () => { alert('Voice navigation feature'); };
  const handleStartNav = () => { alert('Start navigation'); };

  // start/end 编辑起点/终点
  const handleEdit = (type: 'start' | 'end') => {
    setEditType(type);
    setInputValue(type === 'start' ? start : end);
    setModalVisible(true);
  };
  const handleModalOk = () => {
    if (editType === 'start') setStart(inputValue || start);
    else if (editType === 'end') setEnd(inputValue || end);
    setModalVisible(false);
  };
  const handleModalSelect = (item: string) => {
    setInputValue(item);
    setModalVisible(false);
    if (editType === 'start') setStart(item);
    else if (editType === 'end') setEnd(item);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E9ECEF' }}>
      <NavigationInstructionBar type="distance" distance={6} />
      <BackButton onPress={() => router.back()} />
      <MapArea />
      <FabColumn
        floor={floor}
        setFloor={setFloor}
        showFloorDropdown={showFloorDropdown}
        setShowFloorDropdown={setShowFloorDropdown}
        onAR={handleAR}
        onVoice={handleVoice}
        onStartNav={handleStartNav}
        bottomCardHeight={bottomCardHeight}
      />
      <BottomCard
        end={end}
        routeData={mockRouteData}
        onEnd={() => router.replace('/(tabs)')}
        onLayout={e => setBottomCardHeight(e.nativeEvent.layout.height)}
      />
      <EditModal
        visible={modalVisible}
        editType={editType}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        mockResults={mockResults}
        onSelect={handleModalSelect}
      />
    </View>
  );
}