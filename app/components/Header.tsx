import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <View style={styles.logoBox}>
          <Feather name="credit-card" size={22} color="#fff" />
        </View>
        <Text style={styles.brand}>SecureBank</Text>
      </View>
      {onLogout ? (
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Feather name="log-out" size={22} color="#222" />
        </TouchableOpacity>
      ) : (
        <Feather name="chevron-right" size={22} color="#222" style={styles.chevron} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    // paddingTop: Platform.OS === 'ios' ? 54 : 24,
    paddingTop: 8, // Just enough breathing room
    paddingBottom: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: '#2f66f8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111',
  },
  chevron: {
    marginLeft: 10,
  },
  logoutBtn: {
    marginLeft: 10,
    padding: 4,
  },
}); 