import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import BookIcon from '../../assets/images/homepage design-book.png';
import ClassIcon from '../../assets/images/homepage design-class.png';
import HeaderSearchBar from '../components/HeaderSearchBar';

const mockResults = [
  { name: 'Aula 25', type: 'Classroom' },
  { name: 'Aula 3D', type: 'Classroom' },
  { name: 'Aula 2D', type: 'Classroom' },
  { name: 'Aula Magna', type: 'Lecture Hall' },
  { name: 'Aula 4D', type: 'Classroom' },
  { name: 'Aula 5D', type: 'Classroom' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const filtered = search.trim() ? mockResults.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : [];
  const onLayoutHeader = (e: any) => setHeaderHeight(e.nativeEvent.layout.height);
  const handleCloseDropdown = (e: any) => {
    if (filtered.length > 0 && showDropdown) setShowDropdown(false);
  };
  const schedule = [
    { time: '10:00', room: 'Aula 3D', prof: 'Prof.xxxxx' },
    { time: '14:00', room: 'Classroom 4', prof: 'Prof.xxx' },
  ];
  return (
    <TouchableWithoutFeedback onPress={handleCloseDropdown}>
      <ScrollView
        style={[styles.container, { position: 'relative' }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header + SearchBar */}
        <HeaderSearchBar
          search={search}
          setSearch={txt => { setSearch(txt); setShowDropdown(true); }}
          onSearch={() => { if (search.trim()) router.push({ pathname: '../route-preview', params: { room: search.trim() } }); }}
          onVoice={() => { if (search.trim()) router.push({ pathname: '../route-preview', params: { room: search.trim() } }); }}
          onSearchBarLayout={layout => setSearchBarLayout(layout)}
        />
        {/* dropdown options */}
        {filtered.length > 0 && showDropdown && (
          <TouchableWithoutFeedback onPress={handleCloseDropdown}>
            <View
              style={[
                styles.dropdownOuter,
                {
                  position: 'absolute',
                  left: searchBarLayout.x,
                  top: searchBarLayout.y + searchBarLayout.height,
                  width: searchBarLayout.width,
                  zIndex: 20,
                },
              ]}
            >
              <View style={styles.dropdown}>
                {filtered.map(item => (
                  <TouchableOpacity key={item.name} style={styles.dropdownItem} onPress={e => { e.stopPropagation(); setSearch(item.name); setShowDropdown(false); }}>
                    <Text style={styles.dropdownName}>{item.name}</Text>
                    <Text style={styles.dropdownType}>{item.type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        {/* Map Area */}
        <TouchableOpacity style={styles.mapShadow} onPress={() => router.push('../map-fullscreen')}>
          <View style={styles.mapArea}>
            {/* space for map */}
            <View style={styles.mapGrid} />
            <View style={styles.mapDot} />
          </View>
        </TouchableOpacity>
        {/* Quick Access Icons */}
        <View style={styles.quickBtnsRow}>
          <TouchableOpacity style={styles.quickBtnBox}>
            <Image source={ClassIcon} style={{ width: 32, height: 32, resizeMode: 'contain', marginBottom: 4 }} />
            <Text style={styles.quickBtnLabel}>Classroom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtnBox}>
            <Image source={BookIcon} style={{ width: 32, height: 32, resizeMode: 'contain', marginBottom: 4 }} />
            <Text style={styles.quickBtnLabel}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtnBox} onPress={() => router.push('/IndoorNavigation')}>
            <MaterialIcons name="accessible" size={35} color="#2D6BBA" />
            <Text style={styles.quickBtnLabel}>Accessibility</Text>
          </TouchableOpacity>
        </View>
        {/* Schedule */}
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.scheduleTable}>
          {schedule.map((item, idx) => (
            <View style={styles.scheduleRow} key={item.time}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <TouchableOpacity style={styles.scheduleFlexCell} onPress={() => router.push({ pathname: '../route-preview', params: { room: item.room } })}><Text style={styles.scheduleRoom}>{item.room}</Text></TouchableOpacity>
              <TouchableOpacity style={styles.scheduleFlexCell}><Text style={styles.scheduleProf}>{item.prof}</Text></TouchableOpacity>
            </View>
          ))}
        </View>
        {/* divider */}
        <View style={styles.divider} />
        {/* Last Navigation */}
        <View style={styles.lastNavRow}>
          <Text style={styles.lastNavTitle}>Last navigation</Text>
          <TouchableOpacity><Text style={styles.lastNavLink}>Main Gate</Text></TouchableOpacity>
        </View>
        <Text style={styles.lastNavText}>Main Gate to Aula 4D</Text>
        <View style={styles.divider} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20 },
  mapShadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, borderRadius: 16, backgroundColor: '#fff', marginBottom: 26 },
  mapArea: { width: '100%', aspectRatio: 16/9, maxHeight: 600, borderRadius: 16, backgroundColor: '#F3F6FA', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapGrid: { width: '100%', height: '100%', backgroundColor: '#E0E3E7' },
  mapDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#2D6BBA', borderWidth: 3, borderColor: '#fff', position: 'absolute', top: '50%', left: '50%', marginLeft: -8, marginTop: -8 },
  quickBtnsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  quickBtnBox: { flex: 1, alignItems: 'center', backgroundColor: '#F6F7F9', borderRadius: 12, marginHorizontal: 6, paddingVertical: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 1 },
  quickBtnLabel: { marginTop: 6, fontSize: 12, color: '#222', fontWeight: '400', fontFamily: 'Roboto' },
  sectionTitle: { fontWeight: 'bold', fontSize: 14, marginTop: 16, marginBottom: 6, color: '#222', fontFamily: 'Roboto' },
  scheduleTable: { marginBottom: 4 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  scheduleTime: { fontSize: 14, color: '#444', fontWeight: '400', fontFamily: 'Roboto', flex: 1, textAlign: 'left', lineHeight: 20 },
  scheduleFlexCell: { flex: 2, justifyContent: 'flex-start' },
  scheduleRoom: { color: '#2D6BBA', fontWeight: '500', fontSize: 14, fontFamily: 'Roboto', textAlign: 'left', lineHeight: 20 },
  scheduleProf: { color: '#2D6BBA', fontSize: 14, fontWeight: '400', fontFamily: 'Roboto', textAlign: 'left', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#E0E3E7', marginVertical: 10 },
  lastNavRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  lastNavTitle: { fontWeight: 'bold', fontSize: 14, color: '#222', fontFamily: 'Roboto', lineHeight: 20 },
  lastNavLink: { color: '#2D6BBA', fontWeight: '500', fontSize: 14, fontFamily: 'Roboto', lineHeight: 20 },
  lastNavText: { color: '#444', fontSize: 14, fontFamily: 'Roboto', marginBottom: 6, lineHeight: 20 },
  dropdownOuter: { position: 'absolute', left: 20, right: 20, zIndex: 20 },
  dropdown: { backgroundColor: '#fff', borderRadius: 16, padding: 12 },
  dropdownItem: { padding: 8 },
  dropdownName: { fontWeight: '500', color: '#222', fontSize: 12, fontFamily: 'Roboto' },
  dropdownType: { color: '#A3A3A3', fontSize: 10, fontFamily: 'Roboto' },
});
