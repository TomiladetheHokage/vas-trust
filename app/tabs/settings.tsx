import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

type FeatherIconName = 'lock' | 'user';
const settingsOptions: { label: string; icon: FeatherIconName; key: string }[] = [
  { label: 'Setup PIN', icon: 'lock', key: 'setup-pin' },
  { label: 'Change PIN', icon: 'lock', key: 'change-pin' },
  { label: 'Reset PIN', icon: 'lock', key: 'reset-pin' },
  { label: 'Change Password', icon: 'lock', key: 'change-password' },
];

export default function Settings() {
  const router = useRouter();
  const [showChangePin, setShowChangePin] = useState(false);
  const [showSetupPin, setShowSetupPin] = useState(false);
  const [showResetPin, setShowResetPin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [resetPin, setResetPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  // Add state for show/hide password
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [focusedField, setFocusedField] = useState<null | 'current' | 'new' | 'confirm'>(null);

  const currentPasswordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  useEffect(() => {
    async function getUserId() {
      let id;
      if (Platform.OS === 'web') {
        id = localStorage.getItem('user_id');
      } else {
        id = await AsyncStorage.getItem('user_id');
      }
      setUserId(id || '');
    }
    getUserId();
  }, []);

  const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
    ? btoa('vastrust_api:123456789')
    : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
  );

  const handleChangePin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New PINs do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost/vastrust/public/change-pin/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': BASIC_AUTH },
        body: JSON.stringify({
          old_pin: oldPassword,
          new_pin: newPassword,
          confirm_pin: confirmPassword
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('PIN changed successfully!');
        setTimeout(() => {
          setShowChangePin(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSuccess('');
          router.replace('/tabs/settings');
        }, 1200);
      } else {
        setError(data.message || 'Failed to change PIN.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for Setup PIN API call
  const handleSetupPin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!pin || !confirmPin) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      setLoading(false);
      return;
    }
    try {
      let profileRaw;
      if (Platform.OS === 'web') {
        profileRaw = localStorage.getItem('profile');
      } else {
        profileRaw = await AsyncStorage.getItem('profile');
      }
      let email = '';
      if (profileRaw) {
        try {
          const parsed = JSON.parse(profileRaw);
          email = parsed.email || '';
        } catch {}
      }
      if (!email) {
        setError('Could not retrieve user email.');
        setLoading(false);
        return;
      }
      const res = await fetch(`http://localhost/vastrust/public/setup-pin/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BASIC_AUTH
        },
        body: JSON.stringify({
          email,
          transaction_pin: pin,
          confirm_pin: confirmPin
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('PIN setup successfully!');
        setTimeout(() => {
          setShowSetupPin(false);
          setPin('');
          setConfirmPin('');
          setSuccess('');
        }, 1200);
      } else {
        setError(data.message || 'Failed to set up PIN.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };
  // Placeholder for Reset PIN API call
  const handleResetPin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let profileRaw;
      if (Platform.OS === 'web') {
        profileRaw = localStorage.getItem('profile');
      } else {
        profileRaw = await AsyncStorage.getItem('profile');
      }
      let email = '';
      if (profileRaw) {
        try {
          const parsed = JSON.parse(profileRaw);
          email = parsed.email || '';
        } catch {}
      }
      if (!email) {
        setError('Could not retrieve user email.');
        setLoading(false);
        return;
      }
      const res = await fetch(`http://localhost/vastrust/public/reset-pin/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BASIC_AUTH
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('Verification Email sent successfully!');
        setTimeout(() => {
          setShowResetPin(false);
          setResetPin('');
          setSuccess('');
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

  // Move the change password logic to its own modal
  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost/vastrust/public/change-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': BASIC_AUTH },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSuccess('Password changed successfully!');
        setTimeout(() => {
          setShowChangePassword(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSuccess('');
          router.replace('/tabs/settings');
        }, 1200);
      } else {
        setError(data.message || 'Failed to change password.');
      }
    } catch (e) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      {showSetupPin ? (
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="lock" size={22} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Setup PIN</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 24 }}>
            Please enter a 4-digit PIN and confirm it.
          </Text>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Confirm PIN</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
          {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
          {success ? <Text style={{ color: 'green', marginBottom: 12 }}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSetupPin} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Setup PIN</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => setShowSetupPin(false)}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : showResetPin ? (
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="lock" size={22} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Enter Your email</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 24 }}>
            Enter your email to receive a verification code for resetting your PIN.
          </Text>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={resetPin}
            onChangeText={setResetPin}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
          {success ? <Text style={{ color: 'green', marginBottom: 12 }}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={async () => {
            setLoading(true);
            setError('');
            setSuccess('');
            try {
              const res = await fetch(`http://localhost/vastrust/public/reset-pin/${userId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': BASIC_AUTH
                },
                body: JSON.stringify({ email: resetPin })
              });
              const data = await res.json();
              if (data.status === 'success') {
                setSuccess('Verification Email sent successfully!');
                setTimeout(() => {
                  setShowResetPin(false);
                  setResetPin('');
                  setSuccess('');
                  router.replace({ pathname: '/auth/reset-pin-code', params: { email: resetPin } });
                }, 800);
              } else {
                setError(data.message || 'Failed to reset PIN.');
              }
            } catch (e) {
              setError('Network error.');
            } finally {
              setLoading(false);
            }
          }} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Send Verification Email</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => setShowResetPin(false)}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : showChangePin ? (
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="lock" size={22} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Change PIN</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 24 }}>
            Please input your new PIN. It must be 4 digits.
          </Text>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Current PIN</Text>
          <Pressable onPress={() => currentPasswordRef.current && currentPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'current' ? '#000' : colors.border, marginBottom: 24, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={currentPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="Current PIN"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              blurOnSubmit={false}
            />
          </Pressable>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>New PIN</Text>
          <Pressable onPress={() => newPasswordRef.current && newPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'new' ? '#000' : colors.border, marginBottom: 24, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={newPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="New PIN"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPass}
              keyboardType="numeric"
              maxLength={4}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Pressable>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Confirm New PIN</Text>
          <Pressable onPress={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'confirm' ? '#000' : colors.border, marginBottom: 32, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={confirmPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="Confirm New PIN"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPass}
              keyboardType="numeric"
              maxLength={4}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
              <Feather name={showConfirmPass ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Pressable>
          {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
          {success ? <Text style={{ color: 'green', marginBottom: 12 }}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleChangePin} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Change PIN</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => setShowChangePin(false)}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : showChangePassword ? (
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="lock" size={22} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Change Password</Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 24 }}>
            Please input your new password. It must be at least 8 characters long and contain a mix of letters and numbers.
          </Text>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Current Password</Text>
          <Pressable onPress={() => currentPasswordRef.current && currentPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'current' ? '#000' : colors.border, marginBottom: 24, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={currentPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="Current Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              blurOnSubmit={false}
            />
          </Pressable>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>New Password</Text>
          <Pressable onPress={() => newPasswordRef.current && newPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'new' ? '#000' : colors.border, marginBottom: 24, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={newPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPass}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Pressable>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Confirm Password</Text>
          <Pressable onPress={() => confirmPasswordRef.current && confirmPasswordRef.current.focus()} style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: focusedField === 'confirm' ? '#000' : colors.border, marginBottom: 32, paddingHorizontal: 10 },
          ]}>
            <Feather name="lock" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              ref={confirmPasswordRef}
              style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0, backgroundColor: 'transparent', paddingHorizontal: 0 }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPass}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
              <Feather name={showConfirmPass ? 'eye-off' : 'eye'} size={18} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Pressable>
          {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
          {success ? <Text style={{ color: 'green', marginBottom: 12 }}>{success}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Change Password</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => setShowChangePassword(false)}>
            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {settingsOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => {
                if (option.key === 'setup-pin') setShowSetupPin(true);
                else if (option.key === 'reset-pin') setShowResetPin(true);
                else if (option.key === 'change-pin') setShowChangePin(true);
                else if (option.key === 'change-password') setShowChangePassword(true);
              }}
            >
              <View style={styles.iconBox}>
                <Feather name={option.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'web' ? 32 : 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
    marginTop: 8,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 34, // to balance the back arrow
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
    backgroundColor: colors.background,
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
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
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