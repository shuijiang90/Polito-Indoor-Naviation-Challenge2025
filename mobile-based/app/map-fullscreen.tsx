import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderSearchBar from './components/HeaderSearchBar';

const mockResults = [
  { name: 'Aula 25', type: 'Classroom' },
  { name: 'Aula 3D', type: 'Classroom' },
  { name: 'Aula 2D', type: 'Classroom' },
  { name: 'Aula Magna', type: 'Lecture Hall' },
  { name: 'Aula 4D', type: 'Classroom' },
  { name: 'Aula 5D', type: 'Classroom' },
];

export default function MapFullscreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState({ x: 24, y: 0, width: 0, height: 0 });
  const filtered = search.trim() ? mockResults.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : [];
  return (
    <View style={[styles.container, { position: 'relative' }]}>
      <HeaderSearchBar
        showBack
        onBack={() => router.replace('/(tabs)')}
        search={search}
        setSearch={txt => { setSearch(txt); setShowDropdown(true); }}
        onSearch={() => { if (search.trim()) router.push({ pathname: '../route-preview', params: { room: search.trim() } }); }}
        onVoice={() => {}}
        backgroundColor="#234169"
        logoColor="#fff"
        userIconColor="#fff"
        langTextColor="#fff"
        style={{ paddingTop: 36, paddingHorizontal: 24 }}
        onLayout={e => setHeaderHeight(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
        onSearchBarLayout={layout => setSearchBarLayout(layout)}
      />
      {/* dropdown options */}
      {filtered.length > 0 && showDropdown && (
        <View style={[
          styles.dropdownOuter,
          {
            position: 'absolute',
            left: searchBarLayout.x,
            top: searchBarLayout.y + searchBarLayout.height,
            width: searchBarLayout.width,
            zIndex: 20,
          },
        ]}>
          <View style={styles.dropdown}>
            {filtered.map(item => (
              <TouchableOpacity key={item.name} style={styles.dropdownItem} onPress={e => { e.stopPropagation(); setSearch(item.name); setShowDropdown(false); }}>
                <Text style={styles.dropdownName}>{item.name}</Text>
                <Text style={styles.dropdownType}>{item.type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {/* map fullscreen area */}
      <View style={styles.mapArea}>
        {/* here is the map */}
        <Text style={{color:'#bbb', alignSelf:'center', marginTop:20}}>[Map Fullscreen Placeholder]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  headerWrapper: { backgroundColor: '#234169', overflow: 'hidden', paddingBottom: 12, paddingTop: 36, marginBottom: 0, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 0 },
  backText: { color: '#fff', fontSize: 15, fontFamily: 'Roboto', fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langSwitcher: { flexDirection: 'row', alignItems: 'center', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8, borderWidth: 1, borderColor: '#fff', backgroundColor: 'transparent' },
  langText: { fontWeight: '500', color: '#fff', fontSize: 12, fontFamily: 'Roboto' },
  userIcon: { marginLeft: 2 },
  searchBarShadow: { width: '100%', marginTop: 24, marginBottom: 0, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, backgroundColor: '#fff' },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 12, height: 44, backgroundColor: '#F6F7F9' },
  searchInput: { flex: 1, height: 40, fontSize: 12, backgroundColor: 'transparent', borderWidth: 0, fontFamily: 'Roboto', color: '#222' },
  voiceBtn: { padding: 2 },
  dropdownOuter: { position: 'absolute', left: 24, right: 24, zIndex: 20, width: 'auto' },
  mapArea: { flex: 1, backgroundColor: '#E9ECEF' },
  dropdown: { backgroundColor: '#fff', borderRadius: 16, padding: 12 },
  dropdownItem: { padding: 8 },
  dropdownName: { fontWeight: '500', color: '#222', fontSize: 12, fontFamily: 'Roboto' },
  dropdownType: { color: '#A3A3A3', fontSize: 10, fontFamily: 'Roboto' },
  searchIconBtn: { justifyContent: 'center', alignItems: 'center' },
}); 