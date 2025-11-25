import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BicycleIcon from '../../assets/images/bicycle.png';
import BusIcon from '../../assets/images/bus.png';
import CarIcon from '../../assets/images/car.png';
import WalkIcon from '../../assets/images/walk.png';

const transportIcons: Record<string, any> = {
  car: CarIcon,
  bus: BusIcon,
  male: WalkIcon,
  bicycle: BicycleIcon,
};

export default function RouteBottomCard({ end, routeData, mode = 'male', onEnd, onLayout }) {
  return (
    <View style={styles.bottomCard} onLayout={onLayout}>
      <View style={styles.bottomBar} />
      <View style={styles.bottomContentRow}>
        <View style={styles.infoCol}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.bottomTitle}>{end}</Text>
            <Text style={styles.bottomTitleInvisible}>{routeData.arrival}</Text>
          </View>
          <View style={styles.rowSpaceBetween}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={styles.bottomTime}>{routeData.time} min</Text>
              <Image
                source={transportIcons[mode]}
                style={{ width: 25, height: 25, tintColor: '#fff', marginLeft: 6 }}
              />
            </View>
            <Text style={styles.bottomTimeInvisible}>{routeData.arrival}</Text>
          </View>
          <View style={styles.rowTight}>
            <Text style={styles.bottomSub}>{routeData.distance}m</Text>
            <Text style={styles.bottomSub}>  {routeData.arrival}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.endBtn} onPress={onEnd}>
          <Text style={styles.endBtnText}>END</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomCard: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#234169', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36, zIndex: 40 },
  bottomBar: { alignSelf:'center', width: 48, height: 5, borderRadius: 3, backgroundColor: '#fff', opacity:0.25, marginBottom: 12 },
  bottomContentRow: { flexDirection:'row', alignItems:'flex-end' },
  infoCol: { flex:1, alignItems:'flex-start', justifyContent:'center' },
  rowSpaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  rowTight: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  bottomTitle: { color:'#fff', fontSize:28, fontWeight:'bold', fontFamily:'Roboto' },
  bottomTitleInvisible: { color:'transparent', fontSize:28, fontWeight:'bold', fontFamily:'Roboto' },
  bottomTime: { color:'#fff', fontSize:20, fontWeight:'400', fontFamily:'Roboto' },
  bottomTimeInvisible: { color:'transparent', fontSize:20, fontWeight:'400', fontFamily:'Roboto' },
  bottomSub: { color:'#fff', fontSize:16, fontWeight:'bold', fontFamily:'Roboto' },
  endBtn: { backgroundColor:'#fff', borderRadius:20, paddingHorizontal:28, paddingVertical:10, marginLeft:16, alignSelf:'flex-end', marginBottom:2 },
  endBtnText: { color:'#234169', fontWeight:'bold', fontSize:18, fontFamily:'Roboto' },
});