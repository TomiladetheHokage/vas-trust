import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

export default function AllAccounts() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: colors.background, flex: 1 }} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>MY ACCOUNTS</Text>
      </View>
      <View style={styles.accountCard}>
        <View>
          <Text style={styles.accountType}>Savings Account</Text>
          <Text style={styles.accountNumber}>2020013537</Text>
          <Text style={styles.balanceLabel}>NGN 88,850.84</Text>
          <Text style={styles.availableBalance}>Available balance</Text>
        </View>
        <View style={styles.iconCircle} />
      </View>
      <TouchableOpacity style={styles.addAccountBtn}>
        <Text style={styles.addAccountText}>Add a new account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  accountCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  accountType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  accountNumber: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#0077B6',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  availableBalance: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  addAccountBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 40,
  },
  addAccountText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
}); 