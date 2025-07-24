import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export default function ResetPinCode() {
  const router = useRouter();
  const { email, userId: paramUserId } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(paramUserId || '');

  useEffect(() => {
    async function fetchUserId() {
      if (!userId) {
        let id;
        if (Platform.OS === 'web') {
          id = localStorage.getItem('user_id');
        } else {
          id = await AsyncStorage.getItem('user_id');
        }
        setUserId(id || '');
      }
    }
    fetchUserId();
  }, []);

  const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
    ? btoa('vastrust_api:123456789')
    : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
  );

  const handleResetPin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPin !== confirmPin) {
      setError('PINs do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost/vastrust/public/update-reset-pin/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': BASIC_AUTH },
        body: JSON.stringify({ email, otp, new_pin: newPin, confirm_pin: confirmPin }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('PIN reset successful! Redirecting to login...');
        setTimeout(() => {
          router.replace('/auth/login');
        }, 1200);
      } else {
        setError(data.message || 'Failed to reset PIN.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Transaction PIN</Text>
      <Text style={styles.label}>Enter the code sent to your email and your new PIN</Text>
      <Text style={styles.codeExpiry}>Code expires in 10 minutes.</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP Code"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="New PIN"
        value={newPin}
        onChangeText={setNewPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {success ? <Text style={styles.successText}>{success}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleResetPin} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Reset PIN</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={{ marginTop: 24 }} onPress={() => router.replace('/auth/login')}>
        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
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
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  codeExpiry: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
}); 