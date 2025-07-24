import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const navItems = [
  { key: 'home', label: 'Home', icon: 'grid' },
  { key: 'transfer', label: 'Transfer', icon: 'arrow-right' },
  { key: 'history', label: 'History', icon: 'rotate-ccw' },
  { key: 'profile', label: 'Profile', icon: 'user' },
];

interface FooterProps {
  selected?: string;
  onSelect?: (key: string) => void;
}

export default function Footer({ selected = 'home', onSelect = () => {} }: FooterProps) {
  return (
    <View style={styles.footer}>
      {navItems.map(item => {
        const isSelected = selected === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.item, isSelected && styles.selectedItem]}
            onPress={() => onSelect(item.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, isSelected && styles.selectedIconBox]}>
              <Feather
                name={item.icon}
                size={20}
                color={isSelected ? colors.background : colors.text}
              />
            </View>
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'web' ? 8 : 30,
    elevation: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  selectedItem: {},
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  selectedIconBox: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 11,
    color: colors.text,
    marginTop: 0,
  },
  selectedLabel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
}); 