import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const services = [
  { label: 'Settings', icon: 'shield', key: 'settings' },
  // { label: 'Manage Beneficiaries', icon: 'settings', key: 'beneficiaries' },
  // { label: 'Full Statement', icon: 'file-text', key: 'statement' },
  // { label: 'Locate Us', icon: 'map-pin', key: 'locate' },
  // { label: 'Contact Us', icon: 'users', key: 'contact' },
];

export default function Profile() {
  const router = useRouter();
  // Simulate fetched profile data
  const profile = {
    fullName: 'Yemi-Oyebola Tomilade',
    accountDetails: 'Account details',
    photo: null, // Replace with photo URL if available
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileRow}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={32} color="#bbb" />
        </View>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.fullName}>{profile.fullName}</Text>
          <Text style={styles.accountDetails}>{profile.accountDetails}</Text>
        </View>
      </View>
      {/* Services List */}
      <View style={styles.servicesList}>
        {services.map((item, idx) => (
          <TouchableOpacity
            key={item.key}
            style={styles.serviceRow}
            activeOpacity={0.7}
            onPress={item.key === 'settings' ? () => router.push('/tabs/settings') : undefined}
          >
            <View style={styles.serviceIconBox}>
              {item.iconLib === 'MaterialIcons' ? (
                <MaterialIcons name={item.icon} size={22} color={colors.primary} />
              ) : (
                <Feather name={item.icon} size={22} color={colors.primary} />
              )}
            </View>
            <Text style={styles.serviceLabel}>{item.label}</Text>
            <Feather name="chevron-right" size={22} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 32 : 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  accountDetails: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  servicesList: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    backgroundColor: colors.background,
  },
  serviceIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
}); 