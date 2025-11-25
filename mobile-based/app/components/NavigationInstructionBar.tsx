import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type NavigationInstructionBarProps = {
  type: 'distance' | 'floor';
  distance?: number; // 单位：米
  direction?: 'straight' | 'left' | 'right'; // 可选，扩展用
  targetFloor?: string; // 如 '2F', 'GF'
};

export default function NavigationInstructionBar({ type, distance, targetFloor }: NavigationInstructionBarProps) {
  return (
    <View style={styles.bar}>
      {type === 'distance' ? (
        <>
          <MaterialIcons name="arrow-upward" size={20} color="#fff" style={{marginRight:8}} />
          <Text style={styles.text}>Go straight <Text style={styles.bold}>{distance}m</Text></Text>
        </>
      ) : (
        <>
          <MaterialCommunityIcons name="stairs" size={20} color="#fff" style={{marginRight:8}} />
          <Text style={styles.text}>Go upstairs to <Text style={styles.bold}>{targetFloor}</Text></Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#234169',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 16,
    marginTop: 80,
    alignSelf: 'stretch',
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: { color: '#fff', fontSize: 16 },
  bold: { fontWeight: 'bold', color: '#fff' },
}); 