import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const banks = [
  'Access Bank',
  'Citibank',
  'Ecobank',
  'Fidelity Bank',
  'First Bank',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Kuda Microfinance Bank',
  'Opay',
  'Rubies Microfinance Bank',
  'VFD Microfinance Bank',
  'Jaiz Bank',
  'TAJ Bank',
  'Parallex Bank',
  'Sparkle Microfinance Bank',
  'ALAT by Wema',
  'Mint Finex MFB',
  'FSDH Merchant Bank',
  'Rand Merchant Bank',
  'Nova Merchant Bank',
  'Coronation Merchant Bank',
  'SunTrust Bank',
  'Greenwich Merchant Bank',
  'Lotus Bank',
  'PremiumTrust Bank',
  'Signature Bank',
  'Providus Bank',
  'Globus Bank',
  'Polaris Bank',
  'Unity Bank',
  'CitiBank',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'GTBank',
  'Heritage Bank',
  'Keystone Bank',
  'Stanbic IBTC Bank',
  'Sterling Bank',
  'Union Bank',
  'United Bank for Africa',
  'Wema Bank',
  'Zenith Bank',
];

function getInitial(bank: string) {
  const match = bank.match(/^[A-Za-z0-9]+/);
  return match ? match[0][0].toUpperCase() : '?';
}

export default function SelectBank() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const filteredBanks = banks.filter(b => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={32} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select destination bank</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#bbb"
      />
      <ScrollView style={{ flex: 1 }}>
        {filteredBanks.map((bank, idx) => (
          <TouchableOpacity
            key={bank}
            style={styles.bankRow}
            onPress={() => {
              router.replace({ pathname: '/tabs/transfer', params: { selectedBank: bank } });
            }}
          >
            <View style={styles.initialCircle}>
              <Text style={styles.initialText}>{getInitial(bank)}</Text>
            </View>
            <Text style={styles.bankName}>{bank}</Text>
            <View style={styles.radioCircle} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 32,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: colors.text,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  initialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  initialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  bankName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    marginLeft: 8,
  },
}); 