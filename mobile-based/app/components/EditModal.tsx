import React from 'react';
import { Button, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditModal({
  visible, editType, inputValue, setInputValue, onCancel, onOk, mockResults, onSelect
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)'}}>
        <View style={{backgroundColor:'#fff', borderRadius:12, padding:24, width:280, alignItems:'center'}}>
          <Text style={{fontSize:16, marginBottom:12}}>
            {editType === 'start' ? 'Edit Start' : 'Edit Destination'}
          </Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            style={{borderWidth:1, borderColor:'#ccc', borderRadius:8, width:'100%', padding:8, marginBottom:12}}
            autoFocus
          />
          <FlatList
            data={mockResults.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))}
            keyExtractor={item => item}
            style={{maxHeight:120, width:'100%', marginBottom:12}}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => onSelect(item)} style={{paddingVertical:8, paddingHorizontal:4}}>
                <Text style={{fontSize:15}}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={{flexDirection:'row', justifyContent:'flex-end', width:'100%'}}>
            <Button title="Cancel" onPress={onCancel} />
            <View style={{width:12}} />
            <Button title="OK" onPress={onOk} />
          </View>
        </View>
      </View>
    </Modal>
  );
}