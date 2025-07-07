import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

// Cross-platform alert
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Define a type for the form state
type RegisterForm = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age: string;
  occupation: string;
  address: string;
  phone_number: string;
  bvn: string;
  transaction_pin: string;
  nok_first_name: string;
  nok_last_name: string;
  nok_phone_number: string;
  nok_address: string;
};

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    age: '',
    occupation: '',
    address: '',
    phone_number: '',
    bvn: '',
    transaction_pin: '',
    nok_first_name: '',
    nok_last_name: '',
    nok_phone_number: '',
    nok_address: '',
  });
  const [passport, setPassport] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (key: keyof RegisterForm, value: string) => setForm({ ...form, [key]: value });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPassport(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (passport) {
        formData.append('passport_photo', {
          uri: passport.uri,
          name: 'passport.jpg',
          type: 'image/jpeg',
        } as any);
      }
      const res = await fetch('http://localhost/vastrust/public/api/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        showAlert('Success', data.message || 'Registration successful! You will now be taken to the login page.');
        router.push('/auth/login');
      } else {
        const messages = [];
        if (data.message) messages.push(data.message);
        if (data.errors) messages.push(...Object.values(data.errors).flat());
        if (messages.length === 0) messages.push('An unknown error occurred.');
        showAlert('Registration Failed', messages.join('\n'));
      }
    } catch (e) {
      console.log('❌ Register error:', e);
      showAlert('Connection Error', 'Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to register</Text>
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
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} value={form.age} onChangeText={v => handleChange('age', v)} placeholder="Age" placeholderTextColor={colors.placeholder} keyboardType="number-pad" />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={styles.label}>Occupation</Text>
            <TextInput style={styles.input} value={form.occupation} onChangeText={v => handleChange('occupation', v)} placeholder="Occupation" placeholderTextColor={colors.placeholder} />
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
          <Text style={styles.label}>Passport Photo</Text>
          <TouchableOpacity style={styles.passportBtn} onPress={pickImage}>
            <Text style={styles.passportBtnText}>{passport ? 'Change Photo' : 'Select Photo'}</Text>
          </TouchableOpacity>
          {passport && <Image source={{ uri: passport.uri }} style={styles.passportImg} />}
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>BVN</Text>
          <TextInput style={styles.input} value={form.bvn} onChangeText={v => handleChange('bvn', v)} placeholder="BVN" placeholderTextColor={colors.placeholder} keyboardType="number-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Transaction PIN</Text>
          <TextInput style={styles.input} value={form.transaction_pin} onChangeText={v => handleChange('transaction_pin', v)} placeholder="Transaction PIN" placeholderTextColor={colors.placeholder} keyboardType="number-pad" secureTextEntry />
        </View>
        <Text style={styles.sectionTitle}>Next of Kin</Text>
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 6 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={form.nok_first_name} onChangeText={v => handleChange('nok_first_name', v)} placeholder="First Name" placeholderTextColor={colors.placeholder} />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 6 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={form.nok_last_name} onChangeText={v => handleChange('nok_last_name', v)} placeholder="Last Name" placeholderTextColor={colors.placeholder} />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={form.nok_phone_number} onChangeText={v => handleChange('nok_phone_number', v)} placeholder="Phone Number" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={form.nok_address} onChangeText={v => handleChange('nok_address', v)} placeholder="Address" placeholderTextColor={colors.placeholder} />
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
// occupation
// address
// phone_number
// bvn
// transaction_pin
// nok_first_name
// nok_last_name
// nok_phone_number
// nok_address
// passport_photo (for the uploaded image)