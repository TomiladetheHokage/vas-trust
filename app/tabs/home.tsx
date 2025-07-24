// import React from 'react';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import colors from '../../constants/colors';

import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dynamic AsyncStorage import for native only
let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

type Profile = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  passport_photo: string | null;
  age: number;
  occupation: string;
  address: string;
  phone_number: string;
  bvn: string;
  nok_first_name: string;
  nok_last_name: string;
  nok_phone_number: string;
  nok_address: string;
  created_at: string;
  role: string;
  transaction_pin: string;
  account_number: string;
  balance?: string;
};

// Add a helper to format the balance
function formatNairaBalance(balance?: string) {
  if (!balance) return '₦0';
  // Remove any non-digit/decimal except dot
  const num = parseFloat(balance.replace(/[^\d.]/g, ''));
  if (isNaN(num)) return balance.startsWith('₦') ? balance : `₦${balance}`;
  return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BankingDashboard() {
  const [showSavingsBalance, setShowSavingsBalance] = useState(false);
  const [showCurrentBalance, setShowCurrentBalance] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      let userId;
      if (Platform.OS === 'web') {
        userId = localStorage.getItem('user_id');
      } else {
        userId = await AsyncStorage.getItem('user_id');
      }
      if (!userId) {
        setError('No user ID found. Please log in again.');
          setLoading(false);
          return;
        }
      const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
        ? btoa('vastrust_api:123456789')
        : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
        );
      try {
        const res = await fetch(`http://localhost/vastrust/public/profile/${userId}`, {
          headers: { 'Authorization': BASIC_AUTH }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setProfile(data.data);
          if (Platform.OS === 'web') {
            localStorage.setItem('profile', JSON.stringify(data.data));
          } else {
            await AsyncStorage.setItem('profile', JSON.stringify(data.data));
          }
        } else {
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch (e) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setTransactionsLoading(true);
      let accountNumber;
      // Try to get account number from profile state first
      if (profile && profile.account_number) {
        accountNumber = profile.account_number;
      } else {
        let profileRaw;
        if (Platform.OS === 'web') {
          profileRaw = localStorage.getItem('profile');
        } else {
          profileRaw = await AsyncStorage.getItem('profile');
        }
        if (profileRaw) {
          try {
            const parsed = JSON.parse(profileRaw);
            accountNumber = parsed.account_number;
          } catch {}
        }
      }
      if (!accountNumber) {
        setTransactions([]);
        setTransactionsLoading(false);
        return;
      }
      const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
        ? btoa('vastrust_api:123456789')
        : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
      );
      try {
        const res = await fetch(`http://localhost/vastrust/public/transactions/${accountNumber}?page=1`, {
          headers: { 'Authorization': BASIC_AUTH }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setTransactions(data.data.transactions || []);
        } else {
          setTransactions([]);
        }
      } catch (e) {
        setTransactions([]);
      } finally {
        setTransactionsLoading(false);
      }
    };
    fetchTransactions();
  }, [profile]);

  return (
      <ScrollView style={styles.container}>
        {/* Subtle notification to complete profile */}
        <TouchableOpacity style={styles.profileNotice} onPress={() => router.push('/tabs/settings')}>
          <Text style={styles.profileNoticeText}>Tap here to complete your profile</Text>
        </TouchableOpacity>
        {/* Header */}
        <View style={[styles.header, Platform.OS === 'web' && { marginTop: 8 }]}>
          <View style={styles.logoCircle} />
          <View style={styles.headerText}>
            {profile ? (
              <>
                <Text style={styles.welcome}>Welcome back, {profile.first_name} {profile.last_name}</Text>
                {error && (
                  <Text style={{ color: 'orange', fontSize: 12, marginTop: 4 }}>
                    Offline: showing last saved data
                  </Text>
                )}
              </>
            ) : loading ? (
              <Text style={styles.welcome}>Loading...</Text>
            ) : (
              <Text style={[styles.welcome, { color: 'red', fontSize: 14 }]}>
                {error || 'No profile data available.'}
              </Text>
            )}
            <Text style={styles.subtext}>Manage your finances with ease.</Text>
          </View>
        </View>

        {/* Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Accounts</Text>
            <TouchableOpacity style={styles.addAccountBtn} onPress={() => setShowPasswordModal(true)}>
              <Text style={styles.addAccountText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Savings Account</Text>
              <View style={styles.accountType}><Text style={styles.accountTypeText}>Savings</Text></View>
            </View>
            <Text style={styles.accountNumber}>
              Account number: {profile?.account_number || 'No account number'}
            </Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {showSavingsBalance ? formatNairaBalance(profile?.balance) : '•••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowSavingsBalance(!showSavingsBalance)} style={{ padding: 4 }}>
                <Feather name={showSavingsBalance ? 'eye-off' : 'eye'} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Current Account</Text>
              <View style={styles.accountTypeGray}><Text style={styles.accountTypeTextGray}>Current</Text></View>
            </View>
            <Text style={styles.accountNumber}>****4321</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {showCurrentBalance ? '₦15,000,000' : '•••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowCurrentBalance(!showCurrentBalance)} style={{ padding: 4 }}>
                <Feather name={showCurrentBalance ? 'eye-off' : 'eye'} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View> */}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.transferBtn} onPress={() => router.push('/tabs/transfer-options')}>
              <Text style={styles.transferText}>↗ Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawBtn} onPress={() => router.push('/tabs/deposit')}>
              <Text style={styles.withdrawText}>↙ Deposit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section2}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => setShowAllTransactions(!showAllTransactions)}>
              <Text style={styles.viewAll}>
                {showAllTransactions ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          {transactionsLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            (showAllTransactions ? transactions : transactions.slice(0, 10)).length === 0 ? (
              <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 24 }}>No recent transactions</Text>
            ) : (
              (showAllTransactions ? transactions : transactions.slice(0, 10)).map((tx, idx) => {
                // Determine credit or debit
                const isCredit = tx.receiver_account === profile?.account_number;
                const isDebit = tx.sender_account === profile?.account_number;
                // Counterparty account
                const counterparty = isCredit ? tx.sender_account : tx.receiver_account;
                // Title/description
                const description = tx.description || (isCredit ? `From ${counterparty}` : `To ${counterparty}`);
                return (
                  <View key={tx.id || idx} style={styles.transactionRow}>
                    <View style={[styles.iconCircle, { backgroundColor: isCredit ? colors.success + '22' : colors.error + '22' }]}> 
                  <Feather
                        name={isCredit ? 'arrow-down-left' : 'arrow-up-right'}
                    size={18}
                        color={isCredit ? colors.success : colors.error}
                  />
                </View>
                <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle}>{description}</Text>
                      <Text style={styles.transactionDate}>{tx.created_at || tx.date || ''}</Text>
                </View>
                <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>{(isCredit ? '+' : '-') + '₦' + Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                      <Text style={styles.transactionStatus}>{tx.status || (isCredit ? 'credit' : 'debit')}</Text>
                </View>
              </View>
                );
              })
            )
          )}
        </View>

        <Modal visible={showPasswordModal} transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '80%', alignItems: 'center', position: 'relative' }}>
              <Pressable onPress={() => { setShowPasswordModal(false); setInputPassword(''); setPasswordError(''); }} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <Text style={{ fontSize: 20, color: '#888' }}>×</Text>
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Enter your password</Text>
              <TextInput
                secureTextEntry
                value={inputPassword}
                onChangeText={setInputPassword}
                placeholder="Password"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%' }}
              />
              {passwordError ? <Text style={{ color: 'red', marginBottom: 8 }}>{passwordError}</Text> : null}
              <Button title="Submit" onPress={async () => {
                let storedPassword;
                if (Platform.OS === 'web') {
                  storedPassword = localStorage.getItem('password');
                } else {
                  storedPassword = await AsyncStorage.getItem('password');
                }
                if (inputPassword === storedPassword) {
                  setShowPasswordModal(false);
                  setInputPassword('');
                  setPasswordError('');
                  router.push('/tabs/all-accounts');
                } else {
                  setPasswordError('Incorrect password');
                }
              }} />
            </View>
          </View>
        </Modal>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
    ...(Platform.OS === 'web' ? { paddingBottom: 56 } : {}), // Add extra bottom padding for web
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { marginTop: 24 } : {}),
  },
  logoCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, marginRight: 12,
  },
  headerText: { flex: 1 },
  welcome: { color: colors.background, fontSize: 24, fontWeight: 'bold' },
  subtext: { color: colors.accent, fontSize: 16 },

  section2: { marginTop: 24, marginBottom: 50},
  section: { marginTop: 24},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  addAccountBtn: {
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  addAccountText: { fontSize: 12, color: colors.textSecondary },

  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  accountType: {
    backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
  },
  accountTypeGray: {
    backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
  },
  accountTypeText: { color: colors.background, fontSize: 12 , fontWeight: 'bold',},
  accountTypeTextGray: { color: colors.text, fontSize: 12, fontWeight: 'bold', },
  accountNumber: { marginTop: 4, color: colors.textSecondary },
  balance: { marginTop: 10, fontSize: 20, fontWeight: 'bold', color: colors.text },

  actions: {
    flexDirection: 'row', gap: 12, marginTop: 24
  },
  transferBtn: {
    backgroundColor: colors.primary, paddingVertical: 12, flex: 1, borderRadius: 8,
    alignItems: 'center',
  },
  withdrawBtn: {
    borderWidth: 1, borderColor: colors.primary, paddingVertical: 12, flex: 1, borderRadius: 8,
    alignItems: 'center',
  },
  transferText: { color: colors.background, fontWeight: 'bold' },
  withdrawText: { color: colors.primary, fontWeight: 'bold' },

  viewAll: { fontSize: 12, color: colors.textSecondary },
  transactionRow: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.success + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  transactionDetails: {
    flex: 1,
  },

  transactionTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.text,
  },

  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  transactionRight: {
    alignItems: 'flex-end',
  },

  transactionAmount: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },

  transactionStatus: {
    fontSize: 11,
    color: colors.success,
    marginTop: 2,
    fontWeight: '400',
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  eyeIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  profileNotice: {
    backgroundColor: '#FFF9C4', // light yellow
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEB3B', // yellow border
  },
  profileNoticeText: {
    color: '#795200', // dark yellow/brown for contrast
    fontSize: 13,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
