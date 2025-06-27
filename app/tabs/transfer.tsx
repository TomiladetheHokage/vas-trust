import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const accounts = [
  { id: '1', type: 'Savings Account', balance: '₦25,000.50' },
  { id: '2', type: 'Current Account', balance: '₦15,750.25' },
];

const nigerianBanks = [
  'Access Bank',
  'Citibank',
  'Ecobank',
  'Fidelity Bank',
  'First Bank',
  'FCMB',
  'Globus Bank',
  'GTBank',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC',
  'Standard Chartered',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank',
  'UBA',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
];

type Account = typeof accounts[number];

export default function Transfer() {
  const [activeTab, setActiveTab] = useState('SecureBank');
  const [fromAccount, setFromAccount] = useState(accounts[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recipientBank, setRecipientBank] = useState(nigerianBanks[0]);
  const [recipientBankDropdownOpen, setRecipientBankDropdownOpen] = useState(false);
  const [recipientBankSearch, setRecipientBankSearch] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('₦0.00');
  const [description, setDescription] = useState('');

  const handleSelectAccount = (account: Account) => {
    setFromAccount(account);
    setDropdownOpen(false);
  };

  const handleSelectBank = (bank: string) => {
    setRecipientBank(bank);
    setRecipientBankDropdownOpen(false);
  };

  const filteredBanks = nigerianBanks.filter(bank =>
    bank.toLowerCase().includes(recipientBankSearch.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        style={{ backgroundColor: '#fff', flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-up" size={28} color="#222" style={{ transform: [{ translateY: -2 }] }} />
          </View>
          <Text style={styles.headerTitle}>Transfer Money</Text>
          <Text style={styles.headerSubtitle}>Send money quickly and securely.</Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'SecureBank' && styles.tabButtonActive]}
            onPress={() => setActiveTab('SecureBank')}
          >
            <Ionicons name="card" size={16} color={activeTab === 'SecureBank' ? '#fff' : '#222'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabButtonText, activeTab === 'SecureBank' && styles.tabButtonTextActive]}>SecureBank</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, styles.tabButtonInactive, activeTab === 'Other Banks' && styles.tabButtonActive]}
            onPress={() => setActiveTab('Other Banks')}
          >
            <Ionicons name="card-outline" size={16} color={activeTab === 'Other Banks' ? '#fff' : '#222'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabButtonText, activeTab === 'Other Banks' && styles.tabButtonTextActive]}>Other Banks</Text>
          </TouchableOpacity>
        </View>

        {/* Transfer Details Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Transfer Details</Text>
          <Text style={styles.formSubtitle}>
            {activeTab === 'SecureBank'
              ? 'Transfer to another SecureBank account.'
              : 'Transfer to an account in another bank.'}
          </Text>

          {/* From Account Dropdown */}
          <Text style={styles.inputLabel}>From Account</Text>
          <View style={{ zIndex: 10 }}>
            <Pressable
              style={[styles.inputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => setDropdownOpen((open) => !open)}
            >
              <Text style={{ color: '#222', fontWeight: 'bold' }}>{fromAccount.type}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#222', marginRight: 8 }}>{fromAccount.balance}</Text>
                <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
              </View>
            </Pressable>
            {dropdownOpen && (
              <View style={styles.dropdownMenu}>
                {accounts.map((account, idx) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.dropdownItem,
                      fromAccount.id === account.id && styles.dropdownItemSelected,
                      idx !== accounts.length - 1 && styles.dropdownDivider,
                    ]}
                    onPress={() => handleSelectAccount(account)}
                  >
                    <Text style={styles.dropdownType}>{account.type}</Text>
                    <Text style={styles.dropdownBalance}>{account.balance}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Recipient Bank Dropdown (only for Other Banks) */}
          {activeTab === 'Other Banks' && (
            <View style={{ zIndex: 9 }}>
              <Text style={styles.inputLabel}>Recipient Bank</Text>
              <Pressable
                style={[styles.inputField, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setRecipientBankDropdownOpen((open) => !open)}
              >
                <Text style={{ color: '#222' }}>{recipientBank}</Text>
                <Ionicons name={recipientBankDropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#888" />
              </Pressable>
              {recipientBankDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {/* Search input */}
                  <TextInput
                    style={styles.dropdownSearch}
                    placeholder="Search bank..."
                    placeholderTextColor="#888"
                    value={recipientBankSearch}
                    onChangeText={setRecipientBankSearch}
                    autoFocus
                  />
                  {filteredBanks.length === 0 ? (
                    <Text style={styles.dropdownNoResult}>No banks found</Text>
                  ) : (
                    filteredBanks.map((bank, idx) => (
                      <TouchableOpacity
                        key={bank}
                        style={[
                          styles.dropdownItem,
                          recipientBank === bank && styles.dropdownItemSelected,
                          idx !== filteredBanks.length - 1 && styles.dropdownDivider,
                        ]}
                        onPress={() => {
                          setRecipientBankSearch('');
                          handleSelectBank(bank);
                        }}
                      >
                        <Text style={styles.dropdownType}>{bank}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          )}

          {/* To Account Number */}
          <Text style={styles.inputLabel}>To Account Number</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter 10-digit account number"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={10}
            value={toAccount}
            onChangeText={setToAccount}
          />

          {/* Recipient Name */}
          <Text style={styles.inputLabel}>Recipient Name</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter recipient's full name"
            placeholderTextColor="#888"
            value={recipientName}
            onChangeText={setRecipientName}
          />

          {/* Amount */}
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.inputField2}
            placeholder="₦0.00"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Description (Optional) */}
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={[styles.inputField, { minHeight: 40 }]}
            placeholder="What's this transfer for?"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Transfer Button */}
          <TouchableOpacity style={styles.transferBtn}>
            <Text style={styles.transferBtnText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingBottom: 32,
    minHeight: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 18,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.background,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabButtonInactive: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: colors.background,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 22,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  inputField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 2,
  },
  inputField2: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.card,
    marginBottom: 2,
  },
  dropdownMenu: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    marginTop: 2,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
  },
  dropdownItemSelected: {
    backgroundColor: colors.card,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  dropdownDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownType: {
    color: colors.text,
    fontSize: 13,
  },
  dropdownBalance: {
    color: colors.text,
    fontSize: 13,
  },
  dropdownSearch: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    fontSize: 13,
    margin: 8,
    marginBottom: 4,
    backgroundColor: colors.card,
    color: colors.text,
  },
  dropdownNoResult: {
    color: colors.placeholder,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
  },
  transferBtn: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferBtnText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
}); 