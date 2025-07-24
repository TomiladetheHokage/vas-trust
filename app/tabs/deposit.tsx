import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../constants/colors';
let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export default function DepositPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      let profile;
      if (Platform.OS === 'web') {
        profile = localStorage.getItem('profile');
      } else {
        profile = await AsyncStorage.getItem('profile');
      }
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          setAccountNumber(parsed.account_number || '');
          setFullName((parsed.first_name && parsed.last_name) ? `${parsed.first_name} ${parsed.last_name}` : (parsed.full_name || ''));
        } catch {}
      }
    }
    fetchProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.infoMsg}>
        Use the details below to send money to your account. Share these details with anyone who wants to deposit funds for you.
      </Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput style={styles.input} value="Secure Bank" editable={false} selectTextOnFocus={false} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput style={styles.input} value={accountNumber} editable={false} selectTextOnFocus={false} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} editable={false} selectTextOnFocus={false} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 24,
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  infoMsg: {
    color: colors.text,
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 28,
    fontWeight: 'normal',
  },
  formGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
    textAlign: 'left',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'left',
  },
}); 