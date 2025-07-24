import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

export default function ResetPassword() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
    ? btoa('vastrust_api:123456789')
    : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
  );

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost/vastrust/public/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': BASIC_AUTH },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStep('otp');
        setSuccess('OTP sent to your email.');
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost/vastrust/public/update-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': BASIC_AUTH },
        body: JSON.stringify({ email, otp, new_password: newPassword, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('Password reset successful! Redirecting to home...');
        setTimeout(() => {
          router.replace('/tabs/home');
        }, 1200);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {step === 'email' ? (
        <>
          <Text style={styles.label}>Enter your email to receive an OTP</Text>
          <Text style={styles.codeExpiry}>Code expires in 10 minutes.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Send OTP</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter the OTP sent to your email and your new password</Text>
          <Text style={styles.codeExpiry}>Code expires in 10 minutes.</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Reset Password</Text>}
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={{ marginTop: 24 }} onPress={() => router.replace('./login')}>
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