import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import colors from '../../constants/colors';
// Add AsyncStorage import for native

const { width, height } = Dimensions.get('window');

// Dynamic AsyncStorage import for native only
let AsyncStorage: any;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Add onLogin prop
interface LoginScreenProps {
  onLogin?: () => void;
}



const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
        ? btoa('vastrust_api:123456789')
        : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
    );

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('http://localhost/vastrust/public/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': BASIC_AUTH
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            console.log('Login response:', data);
            if (data.status === 'success') {
                const userId = data.data?.user_id || data.data?.id || data.data?.user?.id;
                if (userId) {
                if (Platform.OS === 'web') {
                    localStorage.setItem('user_id', String(userId));
                } else {
                    await AsyncStorage.setItem('user_id', String(userId));
                  }
                }
                setSuccess(data.message || 'Login successful!');
                setTimeout(() => {
                  router.replace('/tabs/home');
                }, 1200);
            } else {
                const messages = [];
                if (data.message) messages.push(data.message);
                if (data.errors) messages.push(...Object.values(data.errors).flat());
                if (messages.length === 0) messages.push('An unknown error occurred.');
                setError(messages.join('\n'));
            }
        } catch (e) {
            console.log('❌ Login error:', e);
            setError('Connection Error: Could not connect to the server. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setForgotLoading(true);
        setForgotError('');
        setForgotSuccess('');
        try {
            const res = await fetch('http://localhost/vastrust/public/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setOtpSent(true);
                setForgotSuccess('OTP sent to your email.');
            } else {
                setForgotError(data.message || 'Failed to send OTP.');
            }
        } catch (e) {
            setForgotError('Network error.');
        } finally {
            setForgotLoading(false);
        }
    };
    const handleConfirmReset = async () => {
        setForgotLoading(true);
        setForgotError('');
        setForgotSuccess('');
        try {
            const res = await fetch('http://localhost/vastrust/public/confirm-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp, new_password: newPassword }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setForgotSuccess('Password reset successful! You can now log in.');
                setTimeout(() => {
                    setShowForgotModal(false);
                    setOtpSent(false);
                    setForgotEmail('');
                    setOtp('');
                    setNewPassword('');
                    setForgotSuccess('');
                }, 2000);
            } else {
                setForgotError(data.message || 'Failed to reset password.');
            }
        } catch (e) {
            setForgotError('Network error.');
        } finally {
            setForgotLoading(false);
        }
    };

    // Example function for future API requests
async function fetchWithBasicAuth(url: string, options: any = {}) {
    let basicAuth;
    if (Platform.OS === 'web') {
        basicAuth = localStorage.getItem('basicAuth');
    } else {
        basicAuth = await AsyncStorage.getItem('basicAuth');
    }
    const headers = {
        ...(options.headers || {}),
        'Authorization': basicAuth,
        'Content-Type': 'application/json',
    };
    return fetch(url, { ...options, headers });
}


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Branding Section */}
            {/* <View style={styles.brandingContainer}>
                <View style={styles.logoCircle}>
                    <Feather name="credit-card" size={30} color="#fff" />
                </View>
                <Text style={styles.bankName}>SecureBank</Text>
                <Text style={styles.tagline}>If ur aza no reach 2k this is the bank for you</Text>
            </View> */}

            {/* Login Card */}
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account to continue</Text>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                    <Feather name="mail" size={18} color="#999" style={styles.icon} />
                    <TextInput
                        placeholder="Enter your email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <Feather name="lock" size={18} color="#999" style={styles.icon} />
                    <TextInput
                        placeholder="Enter your password"
                        style={styles.input}
                        secureTextEntry={!showPass}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <Feather name={showPass ? 'eye-off' : 'eye'} size={18} color="#999" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotContainer} onPress={() => router.push('./reset-password')}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {success ? <Text style={styles.successText}>{success}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Sign In</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.push('/auth/register')}>
                    <Text style={styles.bottomText}>
                        Don't have an account?
                        <Text style={styles.signUp}> Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        alignItems: 'center',
        paddingTop: 180,
        paddingBottom: 40,
        minHeight: height
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: 30
    },
    logoCircle: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 50,
        marginBottom: 10
    },
    bankName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text
    },
    tagline: {
        fontSize: 13,
        color: colors.textSecondary
    },
    card: {
        width: width * 0.9,
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 24,
        elevation: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
        color: colors.text
    },
    subtitle: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.textSecondary,
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
        color: colors.text
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15
    },
    icon: {
        marginRight: 6
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        color: colors.text
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20
    },
    forgot: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '500'
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 8
    },
    buttonText: {
        color: colors.background,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bottomText: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary
    },
    signUp: {
        color: colors.primary,
        fontWeight: 'bold'
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        backgroundColor: colors.background,
        padding: 24,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        position: 'relative',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
        fontSize: 13,
    },
    successText: {
        color: 'green',
        marginBottom: 8,
        fontSize: 13,
    },
});

export default LoginScreen;
