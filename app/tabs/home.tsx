// import React from 'react';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';


import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BankingDashboard() {
  const [showSavingsBalance, setShowSavingsBalance] = useState(false);
  const [showCurrentBalance, setShowCurrentBalance] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const transactions = [
    { id: 1, type: 'credit', title: 'Salary Payment', date: '2024-01-15', amount: '+₦2,500', status: 'completed' },
    { id: 2, type: 'debit', title: 'ATM Withdrawal', date: '2024-01-14', amount: '-₦150', status: 'completed' },
    { id: 3, type: 'credit', title: 'Refund', date: '2024-01-13', amount: '+₦500', status: 'completed' },
    { id: 4, type: 'debit', title: 'POS Purchase', date: '2024-01-12', amount: '-₦1,200', status: 'completed' },
  ];

  return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle} />
          <View style={styles.headerText}>
            <Text style={styles.welcome}>Welcome back, John!</Text>
            <Text style={styles.subtext}>Manage your finances with ease.</Text>
          </View>
        </View>

        {/* Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Accounts</Text>
            <TouchableOpacity style={styles.addAccountBtn}>
              <Text style={styles.addAccountText}>+ Add Account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Savings Account</Text>
              <View style={styles.accountType}><Text style={styles.accountTypeText}>Savings</Text></View>
            </View>
            <Text style={styles.accountNumber}>****7890</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {showSavingsBalance ? '₦25,000.50' : '•••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowSavingsBalance(!showSavingsBalance)} style={{ padding: 4 }}>
                <Feather name={showSavingsBalance ? 'eye-off' : 'eye'} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Current Account</Text>
              <View style={styles.accountTypeGray}><Text style={styles.accountTypeTextGray}>Current</Text></View>
            </View>
            <Text style={styles.accountNumber}>****4321</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balance}>
                {showCurrentBalance ? '₦15,750.25' : '•••••••'}
              </Text>
              <TouchableOpacity onPress={() => setShowCurrentBalance(!showCurrentBalance)} style={{ padding: 4 }}>
                <Feather name={showCurrentBalance ? 'eye-off' : 'eye'} size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.transferBtn}>
              <Text style={styles.transferText}>↗ Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawBtn}>
              <Text style={styles.withdrawText}>↙ Withdraw</Text>
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

          {/* Transaction Item 1 */}
          {(showAllTransactions ? transactions : transactions.slice(0, 2)).map((tx) => (
              <View key={tx.id} style={styles.transactionRow}>
                <View style={tx.type === 'credit' ? styles.iconCircleGreen : styles.iconCircleRed}>
                  <Text style={styles.iconArrow}>{tx.type === 'credit' ? '↩' : '↪'}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionDate}>{tx.date}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={tx.type === 'credit' ? styles.transactionAmountGreen : styles.transactionAmountRed}>
                    {tx.amount}
                  </Text>
                  <Text style={styles.transactionStatus}>{tx.status}</Text>
                </View>
              </View>
          ))}
        </View>

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f9f9f9', padding: 16 },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', marginRight: 12,
  },
  headerText: { flex: 1 },
  welcome: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subtext: { color: '#dbeafe', fontSize: 16 },

  section2: { marginTop: 24, marginBottom: 50},
  section: { marginTop: 24},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // pushes them to opposite ends
    marginBottom: 10,
  },

  sectionTitle: { fontSize: 16, fontWeight: '600' },
  addAccountBtn: {
    borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  addAccountText: { fontSize: 12, color: '#374151' },

  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  accountType: {
    backgroundColor: 'black', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
  },
  accountTypeGray: {
    backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
  },
  accountTypeText: { color: 'white', fontSize: 12 , fontWeight: 'bold',},
  accountTypeTextGray: { color: '#111827', fontSize: 12, fontWeight: 'bold', },
  accountNumber: { marginTop: 4, color: '#6b7280' },
  balance: { marginTop: 10, fontSize: 20, fontWeight: 'bold' },

  actions: {
    flexDirection: 'row', gap: 12, marginTop: 24
  },
  transferBtn: {
    backgroundColor: '#3b82f6', paddingVertical: 12, flex: 1, borderRadius: 8,
    alignItems: 'center',
  },
  withdrawBtn: {
    borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 12, flex: 1, borderRadius: 8,
    alignItems: 'center',
  },
  transferText: { color: 'white', fontWeight: 'bold' },
  withdrawText: { color: '#1f2937', fontWeight: 'bold' },

  viewAll: { fontSize: 12, color: '#6b7280' },
  // transactionCard: {
  //   backgroundColor: 'white', padding: 16, borderRadius: 10, marginBottom: 12,
  // },
  // transactionTitle: { fontWeight: '600', marginBottom: 4 },
  // transactionAmountGreen: { color: '#16a34a', fontWeight: 'bold' },
  // transactionAmountRed: { color: '#dc2626', fontWeight: 'bold' },
  // transactionDate: { fontSize: 12, color: '#6b7280' },
  // transactionStatus: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  transactionRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  iconCircleGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconCircleRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconArrow: {
    fontSize: 16,
    color: '#111827',
  },

  transactionDetails: {
    flex: 1,
  },

  transactionTitle: {
    fontWeight: '600',
    fontSize: 14,
  },

  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },

  transactionRight: {
    alignItems: 'flex-end',
  },

  transactionAmountGreen: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 14,
  },

  transactionAmountRed: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 14,
  },

  transactionStatus: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
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


});
