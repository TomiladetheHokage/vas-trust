import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

// // Define a type for the form state
// type RegisterForm = {
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   bvn: string;
//   transaction_pin: string;
//   nok_first_name: string;
//   nok_last_name: string;
//   nok_phone: string;
//   nok_address: string;
// };



// Define a type for the form state
type RegisterForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  dob: string;
  address: string;
  phone_number: string;
  bvn: string;
};

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    address: '',
    phone_number: '',
    bvn: '',
    // Removed: occupation, transaction_pin, nok_first_name, nok_last_name, nok_phone_number, nok_address
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (key: keyof RegisterForm, value: string) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
        ? btoa('vastrust_api:123456789')
        : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
      );
      const res = await fetch('http://localhost/vastrust/public/register', {
        method: 'POST',
        headers: {
          'Authorization': BASIC_AUTH,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess(data.message || 'Registration successful! You will now be taken to the login page.');
        const userId = data.data?.user_id || data.data?.id || data.data?.user?.id;
        if (userId) {
          if (Platform.OS === 'web') {
            localStorage.setItem('user_id', String(userId));
          } else {
            AsyncStorage.setItem('user_id', String(userId));
          }
        }
        setTimeout(() => {
          router.push({ pathname: '/auth/confirm-email', params: { email: form.email } });
        }, 1200);
      } else {
        const messages = [];
        if (data.message) messages.push(data.message);
        if (data.errors) messages.push(...Object.values(data.errors).flat());
        if (messages.length === 0) messages.push('An unknown error occurred.');
        setError(messages.join('\n'));
      }
    } catch (e) {
      setError('Connection Error: Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to register</Text>
        {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{error}</Text> : null}
        {success ? <Text style={{ color: 'green', textAlign: 'center', marginBottom: 8 }}>{success}</Text> : null}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={form.email} onChangeText={v => handleChange('email', v)} placeholder="Email" placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={form.password} onChangeText={v => handleChange('password', v)} placeholder="Password" placeholderTextColor={colors.placeholder} secureTextEntry />
        </View>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={form.first_name} onChangeText={v => handleChange('first_name', v)} placeholder="First Name" placeholderTextColor={colors.placeholder} />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={form.last_name} onChangeText={v => handleChange('last_name', v)} placeholder="Last Name" placeholderTextColor={colors.placeholder} />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={styles.label}>Date of birth (YYYY/ MM / DD)</Text>
            <TextInput style={styles.input} value={form.dob} onChangeText={v => handleChange('dob', v)} placeholder="Date of birth" placeholderTextColor={colors.placeholder} keyboardType="number-pad" />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={form.address} onChangeText={v => handleChange('address', v)} placeholder="Address" placeholderTextColor={colors.placeholder} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={form.phone_number} onChangeText={v => handleChange('phone_number', v)} placeholder="Phone Number" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>BVN</Text>
          <TextInput style={styles.input} value={form.bvn} onChangeText={v => handleChange('bvn', v)} placeholder="BVN" placeholderTextColor={colors.placeholder} keyboardType="number-pad" />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.push('/auth/login')}>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Already have an account?
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}> Login</Text>
          </Text>
        </TouchableOpacity>

       
      </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 18,
    marginBottom: 6,
  },
  formGroup: {
    marginBottom: 14,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passportBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 8,
  },
  passportBtnText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 15,
  },
  passportImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});


// email
// password
// first_name
// last_name
// age
// address
// phone_number
// bvn