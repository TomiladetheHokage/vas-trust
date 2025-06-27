import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { top } = useSafeAreaInsets();

  return (
      <View style={[styles.header,
        Platform.OS === 'android' && { paddingTop: top + 12 },
        Platform.OS === 'ios' && { paddingTop: 6 }
      ]}>
        <View style={styles.leftContainer}>
          <View style={styles.logoBox}>
            <Feather name="credit-card" size={22} color={colors.background} />
          </View>
          <Text style={styles.brand}>SecureBank</Text>
        </View>
        {onLogout ? (
            <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
              <Feather name="log-out" size={22} color={colors.text} />
            </TouchableOpacity>
        ) : (
            <Feather name="chevron-right" size={22} color={colors.text} style={styles.chevron} />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingBottom: 12,
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
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.text,
  },
  chevron: {
    marginLeft: 10,
  },
  logoutBtn: {
    marginLeft: 10,
    padding: 4,
  },
});