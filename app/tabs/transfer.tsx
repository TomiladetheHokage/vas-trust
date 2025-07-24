import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const accounts = [
  { id: '1', type: 'Savings Account', masked: '2020XXXX37-NGN-B25', balance: '₦60,132.58' },
];

const nigerianBanks = [
  'Access Bank', 'Citibank', 'Ecobank', 'Fidelity Bank', 'First Bank', 'FCMB', 'Globus Bank', 'GTBank', 'Heritage Bank', 'Keystone Bank', 'Polaris Bank', 'Providus Bank', 'Stanbic IBTC', 'Standard Chartered', 'Sterling Bank', 'SunTrust Bank', 'Titan Trust Bank', 'Union Bank', 'UBA', 'Unity Bank', 'Wema Bank', 'Zenith Bank',
];

type Account = typeof accounts[number];

// Dynamic AsyncStorage import for native only
let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export default function Transfer() {
  const { type, selectedBank, toAccount: paramToAccount, recipientName: paramRecipientName } = useLocalSearchParams();
  const [fromAccount] = useState(accounts[0]);
  const [amount, setAmount] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);
  const [recipientBank, setRecipientBank] = useState(nigerianBanks[0]);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [toAccount, setToAccount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState('');
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  useEffect(() => {
    const getAccountAndBalance = async () => {
      let profileRaw;
      if (Platform.OS === 'web') {
        profileRaw = localStorage.getItem('profile');
      } else {
        profileRaw = await AsyncStorage.getItem('profile');
      }
      if (!profileRaw) return;
      try {
        const profile = JSON.parse(profileRaw);
        if (profile.account_number) {
          setAccountNumber(profile.account_number);
          setBalanceLoading(true);
          setBalanceError('');
          const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
            ? btoa('vastrust_api:123456789')
            : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
          );
          const res = await fetch(`http://localhost/vastrust/public/balance/${profile.account_number}`, {
            headers: { 'Authorization': BASIC_AUTH }
          });
          const data = await res.json();
          if (data.status === 'success') {
            setBalance(data.data.balance);
          } else {
            setBalanceError(data.message || 'Failed to fetch balance.');
          }
        }
      } catch (e) {
        setBalanceError('Failed to fetch balance.');
      } finally {
        setBalanceLoading(false);
      }
    };
    getAccountAndBalance();
  }, []);

  // Update recipientBank if selectedBank param is present
  useEffect(() => {
    if (selectedBank && typeof selectedBank === 'string') {
      setRecipientBank(selectedBank);
    }
  }, [selectedBank]);

  // Prefill fields if params are present (from beneficiary selection)
  useEffect(() => {
    if (paramToAccount && typeof paramToAccount === 'string') {
      setToAccount(paramToAccount);
    }
    if (paramRecipientName && typeof paramRecipientName === 'string') {
      setRecipientName(paramRecipientName);
    }
  }, [paramToAccount, paramRecipientName]);

  // Format amount with commas and two decimals
  const formatAmount = (val: string) => {
    if (!val) return '';
    // Remove non-numeric except dot
    let cleaned = val.replace(/[^\d.]/g, '');
    // Only allow one dot
    const parts = cleaned.split('.');
    if (parts.length > 2) cleaned = parts[0] + '.' + parts[1];
    // Format integer part with commas
    let [intPart, decPart] = cleaned.split('.');
    intPart = intPart.replace(/^0+(?!$)/, '');
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (decPart !== undefined) {
      decPart = decPart.slice(0,2);
      return intPart + '.' + decPart.padEnd(2, '0');
    } else {
      return intPart ? intPart + '.00' : '';
    }
  };

  const handleTransfer = async () => {
    setTransferLoading(true);
    setTransferError('');
    setTransferSuccess('');
    if (!accountNumber || !toAccount || !amount) {
      setTransferError('All fields are required.');
      setTransferLoading(false);
      return;
    }
    if (!pin || pin.trim().length !== 4 || !/^[0-9]{4}$/.test(pin.trim())) {
      setTransferError('PIN must be exactly 4 digits.');
      setTransferLoading(false);
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setTransferError('Amount must be a positive number.');
      setTransferLoading(false);
      return;
    }
    const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
      ? btoa('vastrust_api:123456789')
      : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
    );
    // Get userId for endpoint
    let userId;
    if (Platform.OS === 'web') {
      userId = localStorage.getItem('user_id');
    } else {
      userId = await AsyncStorage.getItem('user_id');
    }
    if (!userId) {
      setTransferError('User ID not found.');
      setTransferLoading(false);
      return;
    }
    let body: any = {
      user_id: userId,
      from_account: accountNumber,
      to_account: toAccount,
      amount: amount,
      pin: pin,
    };
    // Only add external_bank if type === 'other'
    if (type === 'other' && recipientBank && recipientBank.toLowerCase() !== 'secure bank') {
      body['external_bank'] = recipientBank;
    }
    try {
      const res = await fetch(`http://localhost/vastrust/public/transfer/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BASIC_AUTH,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setTransferSuccess(data.message || 'Transfer successful!');
        setTimeout(() => {
          setPin('');
          setPinModalVisible(false);
          setTransferSuccess('');
          router.replace('/tabs/home');
        }, 1500);
      } else {
        setTransferError(data.message || 'Transfer failed.');
      }
    } catch (e) {
      setTransferError('Network error.');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backArrow} onPress={() => router.push('/tabs/transfer-options')}>
          <Feather name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        {/* Blue Header with Amount */}
        <View style={styles.headerBg}>
          <View style={styles.headerAmountRow}>
            <Text style={styles.headerCurrency}>NGN</Text>
            <TextInput
              style={styles.headerAmountInput}
              value={amountFocused ? amount : formatAmount(amount)}
              onChangeText={val => {
                // Allow only numbers and dot
                const raw = val.replace(/[^\d.]/g, '');
                setAmount(raw);
              }}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              placeholder="0.00"
              placeholderTextColor="#b3d1e6"
              keyboardType="decimal-pad"
              textAlign="center"
            />
          </View>
        </View>

        {/* White Card Section: Select Account */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>SELECT ACCOUNT</Text>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View>
              <Text style={styles.rowMain}>{accountNumber || 'No account'}</Text>
              {balanceLoading ? (
                <Text style={styles.rowSub}>Loading balance...</Text>
              ) : balanceError ? (
                <Text style={[styles.rowSub, { color: 'red' }]}>{balanceError}</Text>
              ) : (
                <Text style={styles.rowSub}>NGN {balance !== null ? Number(balance).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--'}</Text>
              )}
            </View>
            <Feather name="chevron-right" size={22} color="#bbb" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* White Card Section: Beneficiary Bank */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>BENEFICIARY BANK</Text>
          {(type === 'other' || recipientBank !== nigerianBanks[0]) ? (
            <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/tabs/select-bank')}>
              <Text style={styles.rowMain}>{recipientBank}</Text>
              <Feather name="chevron-right" size={22} color="#bbb" />
            </TouchableOpacity>
          ) : (
            <View style={styles.row}>
              <Text style={styles.rowMain}>SECURE BANK</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />

        {/* White Card Section: Account Number */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>ACCOUNT NUMBER</Text>
          <TextInput
            style={[styles.rowMain, styles.fullWidthInput]}
            value={toAccount}
            onChangeText={setToAccount}
            placeholder="Account Number"
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor="#bbb"
          />
        </View>
        <View style={styles.divider} />

        {/* White Card Section: Beneficiary Name */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>BENEFICIARY NAME</Text>
          <TextInput
            style={[styles.rowMain, styles.fullWidthInput]}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Beneficiary Name"
            placeholderTextColor="#bbb"
          />
        </View>
        <View style={styles.divider} />

        {/* Note Field */}
        <View style={styles.sectionCard}>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note or #hashtag"
            placeholderTextColor="#bbb"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={() => setPinModalVisible(true)}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        {/* PIN Modal */}
        <Modal visible={pinModalVisible} transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '80%', alignItems: 'center', position: 'relative' }}>
              <Pressable onPress={() => { setPinModalVisible(false); setPin(''); setTransferError(''); setTransferSuccess(''); }} style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                <Text style={{ fontSize: 20, color: '#888' }}>×</Text>
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Enter Transaction PIN</Text>
              <TextInput
                secureTextEntry
                value={pin}
                onChangeText={setPin}
                placeholder="PIN"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%', textAlign: 'center', letterSpacing: 8 }}
                keyboardType="number-pad"
                maxLength={4}
              />
              {transferError ? <Text style={{ color: 'red', marginBottom: 8 }}>{transferError}</Text> : null}
              {transferSuccess ? <Text style={{ color: 'green', marginBottom: 8 }}>{transferSuccess}</Text> : null}
              <Button title={transferLoading ? 'Processing...' : 'Submit'} onPress={handleTransfer} disabled={transferLoading} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 32,
  },
  headerBg: {
    backgroundColor: '#1177A7',
    alignItems: 'center',
    paddingTop: 64, // increased to shift content down for back arrow
    paddingBottom: 36,
    marginBottom: 0,
  },
  headerAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 180, // visually shift to the right for mobile
  },
  headerCurrency: {
    color: '#b3d1e6',
    fontSize: 38,
    fontWeight: 'bold',
    marginRight: 2,
  },
  headerAmountInput: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 120,
    backgroundColor: 'transparent',
    borderWidth: 0,
    outlineWidth: 0,
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 0,
  },
  sectionLabel: {
    color: '#1177A7',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  rowMain: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 2,
  },
  divider: {
    height: 10,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  noteInput: {
    backgroundColor: '#fff',
    borderWidth: 0,
    fontSize: 15,
    color: '#bbb',
    paddingHorizontal: 0,
    paddingVertical: 18,
    marginTop: 0,
  },
  continueBtn: {
    backgroundColor: '#7ed957',
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    backgroundColor: colors.background,
    borderRadius: 12,
    // no marginBottom here
  },
  accountLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginRight: 18, // align with label
    marginBottom: 10, // add spacing below account number
  },
  accountSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fullWidthInput: {
    width: '100%',
    minWidth: 0,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  backArrow: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
}); 