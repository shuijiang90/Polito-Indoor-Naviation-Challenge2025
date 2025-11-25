import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export interface AnchorLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResultItem {
  name: string;
  type: string;
}

export interface RouteEditModalProps {
  visible: boolean;
  editType: 'start' | 'end' | null;
  inputValue: string;
  setInputValue: (v: string) => void;
  onCancel: () => void;
  onOk: () => void;
  filteredResults: ResultItem[];
  onSelect: (item: ResultItem) => void;
  anchorLayout: AnchorLayout | null;
}

export default function RouteEditModal({
  visible, editType, inputValue, setInputValue, onCancel, onOk, filteredResults, onSelect, anchorLayout
}: RouteEditModalProps) {
  if (!visible || !anchorLayout) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.mask} />
      </TouchableWithoutFeedback>
      <View style={[styles.card,
        {
          position: 'absolute',
          left: anchorLayout.x,
          top: anchorLayout.y + 10,
          width: anchorLayout.width,
        }
      ]}>
        <Text style={styles.title}>
          {editType === 'start' ? 'Edit Start' : 'Edit Destination'}
        </Text>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.input}
          autoFocus
          placeholder="Type to search..."
          placeholderTextColor="#A3A3A3"
        />
        {filteredResults.length > 0 && (
          <View style={styles.listOuter}>
            <View style={styles.listInner}>
              <FlatList
                data={filteredResults}
                keyExtractor={item => item.name}
                keyboardShouldPersistTaps="handled"
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => onSelect(item)} style={styles.listItem}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <Text style={styles.listType}>{item.type}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={onCancel}><Text style={styles.btn}>Cancel</Text></TouchableOpacity>
          <View style={{width:12}} />
          <TouchableOpacity onPress={onOk}><Text style={styles.btn}>OK</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 99,
  },
  card: {
    backgroundColor:'#fff',
    borderRadius: 10,
    borderWidth:0,
    borderColor:'#234169',
    padding: 16,
    zIndex: 100,
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},
    shadowOpacity:0.06,
    shadowRadius:4,
    elevation:2,
    alignItems:'center',
  },
  title: {fontSize:16, marginBottom:12, fontWeight:'bold', color:'#234169', fontFamily:'Roboto'},
  input: {borderWidth:1, borderColor:'#ccc', borderRadius:8, width:'100%', padding:8, marginBottom:12, fontFamily:'Roboto', fontSize:14, color:'#222'},
  listOuter: { width:'100%' },
  listInner: { backgroundColor: '#fff', borderRadius: 16, padding: 4 },
  listItem: { padding: 8 },
  listName: { fontWeight: '500', color: '#222', fontSize: 12, fontFamily: 'Roboto' },
  listType: { color: '#A3A3A3', fontSize: 10, fontFamily: 'Roboto' },
  btnRow: {flexDirection:'row', justifyContent:'flex-end', width:'100%', marginTop:12},
  btn: {fontSize:15, color:'#2D6BBA', fontWeight:'bold', fontFamily:'Roboto'},
});