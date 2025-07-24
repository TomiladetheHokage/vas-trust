import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

export default function TransferOptions() {
  const router = useRouter();
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);
  const [search, setSearch] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showBeneficiaries) {
      setLoading(true);
      setError('');
      fetch('http://localhost/vastrust/public/beneficiaries/39', {
        headers: {
          'Authorization': 'Basic dmFzdHJ1c3RfYXBpOjEyMzQ1Njc4OQ=='
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            setBeneficiaries(data.data);
          } else {
            setError(data.message || 'Failed to fetch beneficiaries');
          }
        })
        .catch(() => setError('Failed to fetch beneficiaries'))
        .finally(() => setLoading(false));
    }
  }, [showBeneficiaries]);

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.account_name.toLowerCase().includes(search.toLowerCase()) ||
    b.account_number.includes(search)
  );

  if (showBeneficiaries) {
    return (
      <View style={styles.container}>
        <View style={styles.beneficiaryHeaderRow}>
          <TouchableOpacity onPress={() => setShowBeneficiaries(false)} style={styles.backIconBtn}>
            <Feather name="chevron-left" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Saved Beneficiaries</Text>
        </View>
        <View style={styles.searchRow}>
          <Feather name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search beneficiaries"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : (
          <FlatList
            data={filteredBeneficiaries}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bankRow}
                activeOpacity={0.7}
                onPress={() => router.replace({ pathname: '/tabs/transfer', params: { toAccount: item.account_number, recipientName: item.account_name, selectedBank: item.external_bank } })}
              >
                <View style={styles.initialCircle}>
                  <Text style={styles.initialText}>{item.account_name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.beneficiaryName}>{item.account_name}</Text>
                  <Text style={styles.beneficiaryDetails}>{item.external_bank ? `${item.external_bank} • ` : ''}{item.account_number}</Text>
                </View>
                <View style={styles.radioCircle} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No beneficiaries found.</Text>}
          />
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowBeneficiaries(false)}>
          <Text style={styles.backBtnText}>Back to Options</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.replace('/tabs/home')} style={styles.backIconBtn}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Transfer Option</Text>
      </View>
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => router.push({ pathname: '/tabs/transfer', params: { type: 'domestic' } })}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Feather name="repeat" size={22} color={colors.primary} />
        </View>
        <Text style={styles.optionLabel}>Send to Domestic Account</Text>
        <Feather name="chevron-right" size={22} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => router.push({ pathname: '/tabs/transfer', params: { type: 'other' } })}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Feather name="credit-card" size={22} color={colors.primary} />
        </View>
        <Text style={styles.optionLabel}>Send to Other Local Banks</Text>
        <Feather name="chevron-right" size={22} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setShowBeneficiaries(true)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Feather name="plus" size={22} color={colors.primary} />
        </View>
        <Text style={styles.optionLabel}>Saved Beneficiaries</Text>
        <Feather name="chevron-right" size={22} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: Platform.OS === 'web' ? 32 : 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIconBtn: {
    marginRight: 10,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'left',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionLabel: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  beneficiaryRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  beneficiaryDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  backBtn: {
    marginTop: 28,
    alignItems: 'center',
  },
  backBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
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
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bbb',
    marginLeft: 8,
  },
  beneficiaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
}); 