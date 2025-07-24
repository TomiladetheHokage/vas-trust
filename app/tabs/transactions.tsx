import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

let AsyncStorage;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

const allTransactions = [
  { id: 1, type: 'credit', title: 'Salary Payment', date: '2024-07-22', amount: '+₦2,500', status: 'completed' },
  { id: 2, type: 'debit', title: 'ATM Withdrawal', date: '2024-07-20', amount: '-₦150', status: 'completed' },
  { id: 3, type: 'credit', title: 'Refund', date: '2024-07-15', amount: '+₦500', status: 'completed' },
  { id: 4, type: 'debit', title: 'POS Purchase', date: '2024-06-25', amount: '-₦1,200', status: 'completed' },
  { id: 5, type: 'debit', title: 'Transfer to John Smith', date: '2024-06-10', amount: '-₦2,000', status: 'completed' },
  { id: 6, type: 'credit', title: 'Transfer from Jane Doe', date: '2024-05-09', amount: '+₦1,000', status: 'completed' },
];

type Transaction = typeof allTransactions[number];
type DateFilter = '7d' | '30d' | 'all';

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<DateFilter>('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost/vastrust/public/transactions/1188036538?page=1', {
      headers: {
        'Authorization': 'Basic dmFzdHJ1c3RfYXBpOjEyMzQ1Njc4OQ=='
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTransactions(data.data.transactions);
        } else {
          setError(data.message || 'Failed to fetch transactions');
        }
      })
      .catch(() => setError('Failed to fetch transactions'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((tx: any) => {
    const matchesSearch =
      search.trim() === '' ||
      (tx.description && tx.description.toLowerCase().includes(search.trim().toLowerCase())) ||
      (tx.sender_account && tx.sender_account.includes(search.trim())) ||
      (tx.receiver_account && tx.receiver_account.includes(search.trim()));

    if (activeFilter === 'all') {
      return matchesSearch;
    }

    const today = new Date();
    const txDate = new Date(tx.created_at);
    const daysDiff = (today.getTime() - txDate.getTime()) / (1000 * 3600 * 24);

    if (activeFilter === '7d' && daysDiff > 7) {
      return false;
    }
    if (activeFilter === '30d' && daysDiff > 30) {
      return false;
    }

    return matchesSearch;
  });

  const totalCredits = filtered
    .filter((tx: any) => tx.receiver_account === '1188036538')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const totalDebits = filtered
    .filter((tx: any) => tx.sender_account === '1188036538')
    .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

  const getIcon = (tx: any) => {
    if (tx.type === 'transfer' && tx.sender_account === '1188036538') return { icon: 'arrow-up-right' as const, color: colors.error, bg: '#fee2e2' };
    if (tx.type === 'transfer' && tx.receiver_account === '1188036538') return { icon: 'arrow-down-left' as const, color: colors.success, bg: '#d1fae5' };
    return { icon: 'repeat' as const, color: colors.primary, bg: colors.card };
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background, flex: 1 }} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Text style={styles.headerSubtitle}>View all your account transactions</Text>
      </View>

      <View style={styles.controlsRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={styles.dateFilterRow}>
        <TouchableOpacity 
          style={[styles.dateTag, activeFilter === '7d' && styles.dateTagActive]} 
          onPress={() => setActiveFilter('7d')}
        >
          <Text style={[styles.dateTagText, activeFilter === '7d' && styles.dateTagTextActive]}>Last 7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.dateTag, activeFilter === '30d' && styles.dateTagActive]} 
          onPress={() => setActiveFilter('30d')}
        >
          <Text style={[styles.dateTagText, activeFilter === '30d' && styles.dateTagTextActive]}>Last 30 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.dateTag, activeFilter === 'all' && styles.dateTagActive]} 
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.dateTagText, activeFilter === 'all' && styles.dateTagTextActive]}>All Time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryBox, styles.summaryBoxShadow, { backgroundColor: colors.success + '22' }]}> 
          <Text style={styles.summaryLabel}>Total Credits</Text>
          <Text style={styles.summaryValue}>₦{totalCredits.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryBox, styles.summaryBoxShadow, { backgroundColor: colors.error + '22' }]}> 
          <Text style={styles.summaryLabel}>Total Debits</Text>
          <Text style={styles.summaryValue}>₦{totalDebits.toLocaleString()}</Text>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        {loading ? (
          <Text style={{ color: colors.placeholder, textAlign: 'center', marginTop: 32 }}>Loading...</Text>
        ) : error ? (
          <Text style={{ color: colors.error, textAlign: 'center', marginTop: 32 }}>{error}</Text>
        ) : filtered.length === 0 ? (
          <Text style={{ color: colors.placeholder, textAlign: 'center', marginTop: 32 }}>No transactions found.</Text>
        ) : (
          filtered.map((tx: any) => {
            const icon = getIcon(tx);
            return (
              <View key={tx.id} style={styles.transactionRow}>
                <View style={[styles.iconCircle, { backgroundColor: icon.bg }]}> 
                  <Feather name={icon.icon} size={18} color={icon.color} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{tx.description || tx.type}</Text>
                  <Text style={styles.transactionDate}>{tx.created_at}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmountBlack}>{tx.sender_account === '1188036538' ? '-' : '+'}₦{parseFloat(tx.amount).toLocaleString()}</Text>
                  <Text style={[styles.transactionStatus, styles.transactionStatusGreen]}>{tx.status}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  headerSection: {
    marginTop: 24,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: colors.card,
    color: colors.text,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateTagText: {
    fontSize: 13,
    color: colors.text,
  },
  dateTagTextActive: {
    color: colors.background,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 10,
    padding: 18,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryBoxShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
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
  transactionAmountBlack: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  transactionStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '400',
  },
  transactionStatusGreen: {
    color: colors.success,
    fontWeight: 'bold',
  },
  transactionStatusRed: {
    color: colors.error,
    fontWeight: 'bold',
  },
}); 