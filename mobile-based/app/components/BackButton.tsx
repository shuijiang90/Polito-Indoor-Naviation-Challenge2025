import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.backBtn} onPress={onPress}>
      <Text style={styles.backText}>{'< Back'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: { position: 'absolute', top: 44, left: 16, zIndex: 20 },
  backText: { color: '#234169', fontSize: 15, fontFamily: 'Roboto', fontWeight: '500' },
});