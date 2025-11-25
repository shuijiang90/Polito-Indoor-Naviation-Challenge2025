import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

interface HeaderSearchBarProps {
  showBack?: boolean;
  onBack?: () => void;
  search: string;
  setSearch: (text: string) => void;
  onSearch?: () => void;
  onVoice?: () => void;
  backgroundColor?: string;
  logoColor?: string;
  userIconColor?: string;
  langTextColor?: string;
  style?: ViewStyle;
  onLayout?: (e: LayoutChangeEvent) => void;
  onSearchBarLayout?: (layout: { x: number; y: number; width: number; height: number }) => void;
}

export default function HeaderSearchBar({
  showBack = false,
  onBack,
  search,
  setSearch,
  onSearch,
  onVoice,
  backgroundColor = '#fff',
  logoColor = '#3A3A3A',
  userIconColor = '#2D6BBA',
  langTextColor = '#222',
  style,
  onLayout,
  onSearchBarLayout,
}: HeaderSearchBarProps) {
  return (
    <View style={[styles.headerContainer, { backgroundColor }, style]} onLayout={onLayout}>
      <View style={styles.headerRow}>
        {showBack ? (
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backText}>&lt; Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.logo, { color: logoColor }]}> 
            <Text style={{ color: '#3A3A3A' }}>POLI</Text>
            <Text style={{ color: '#D97B3A' }}>TO</Text>
            <Text style={{ color: '#3A3A3A' }}> INMAP</Text>
          </Text>
        )}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langSwitcher}>
            <Text style={[styles.langText, { color: langTextColor }]}>EN</Text>
            <FontAwesome name="angle-down" size={16} color={userIconColor} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.userIcon}>
            <Ionicons name="person-circle-outline" size={28} color={userIconColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={styles.searchBarShadow}
        onLayout={e => {
          if (onSearchBarLayout) onSearchBarLayout(e.nativeEvent.layout);
        }}
      >
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.searchIconBtn} onPress={onSearch}>
            <FontAwesome name="search" size={18} color="#A3A3A3" style={{ marginRight: 6 }} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a building, room..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#A3A3A3"
          />
          <TouchableOpacity style={styles.voiceBtn} onPress={onVoice}>
            <MaterialIcons name="keyboard-voice" size={22} color="#A3A3A3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { paddingBottom: 0, paddingTop: 0, borderRadius: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logo: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5, fontFamily: 'Roboto', lineHeight: 18 },
  backText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langSwitcher: { flexDirection: 'row', alignItems: 'center', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 2, marginRight: 8, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#A3A3A3' },
  langText: { fontWeight: '500', fontSize: 12, fontFamily: 'Roboto' },
  userIcon: { marginLeft: 2 },
  searchBarShadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, borderRadius: 12, backgroundColor: '#fff', marginBottom: 26 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 10, height: 44, backgroundColor: '#F6F7F9' },
  searchInput: { flex: 1, height: 40, fontSize: 12, backgroundColor: 'transparent', borderWidth: 0, fontFamily: 'Roboto', color: '#222' },
  voiceBtn: { padding: 2 },
  searchIconBtn: { justifyContent: 'center', alignItems: 'center' },
}); 