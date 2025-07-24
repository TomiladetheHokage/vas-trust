import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';



export default function VerifyEmailScreen() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputs = Array.from({ length: 6 }, () => useRef(null));
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const BASIC_AUTH = 'Basic ' + (Platform.OS === 'web'
        ? btoa('vastrust_api:123456789')
        : require('buffer').Buffer.from('vastrust_api:123456789').toString('base64')
    );

    React.useEffect(() => {
        if (email) {
            if (Platform.OS === 'web') {
                localStorage.setItem('verify_email', String(email));
            } else {
                AsyncStorage.setItem('verify_email', String(email));
            }
        }
    }, [email]);

    const handleChange = (text: string, idx: number) => {
        if (!/^[0-9]*$/.test(text)) return;
        const newCode = [...code];
        newCode[idx] = text.slice(-1);
        setCode(newCode);
        if (text && idx < 5) {
            // @ts-ignore
            inputs[idx + 1].current.focus();
        }
        if (!text && idx > 0) {
            // @ts-ignore
            inputs[idx - 1].current.focus();
        }
    };

    const handleResendEmail = async () => {
        if (timer > 0) {
            setError('Please wait for the timer.');
            return;
        }
        setResending(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('http://localhost/vastrust/public/resend-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': BASIC_AUTH,
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSuccess('Verification email resent!');
                setTimer(60);
                timerRef.current = setInterval(() => {
                    setTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError(data.message || 'Could not resend code.');
            }
        } catch (e) {
            setError('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };
    React.useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const handleVerify = async () => {
        const codeStr = code.join('');
        if (codeStr.length !== 6) {
            setError('Code must be 6 digits.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('http://localhost/vastrust/public/register-verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': BASIC_AUTH,
                },
                body: JSON.stringify({ email: String(email), code: codeStr }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setSuccess('Verification successful! Redirecting...');
                setTimeout(() => {
                    router.replace('/tabs/home');
                }, 1500);
            } else {
                setError(data.message || 'Could not verify code.');
            }
        } catch (e) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
                Enter the 6-digit code sent to <Text style={{ fontWeight: 'bold' }}>{email}</Text>
            </Text>
            <View style={styles.otpRow}>
                {code.map((digit, idx) => (
            <TextInput
                        key={idx}
                        ref={inputs[idx]}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={text => handleChange(text, idx)}
                keyboardType="number-pad"
                        maxLength={1}
                        returnKeyType="next"
                        autoFocus={idx === 0}
            />
                ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                {loading ? <ActivityIndicator color={colors.background} /> : <Text style={styles.buttonText}>Verify Code</Text>}
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.resendButton, (resending || timer > 0) && { opacity: 0.5 }]}
                onPress={handleResendEmail}
                disabled={resending || timer > 0}
            >
                {resending ? (
                    <ActivityIndicator color={colors.primary} />
                ) : timer > 0 ? (
                    <Text style={styles.resendButtonText}>Resend Code ({timer}s)</Text>
                ) : (
                    <Text style={styles.resendButtonText}>Resend Code</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={{ marginTop: 28, alignItems: 'center' }}
                onPress={() => router.push('/auth/register')}
            >
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    Missed something?
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}> Back to Register</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    title: { fontSize: 22, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 18 },
    otpRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 8 },
    otpInput: {
        width: 44,
        height: 54,
        borderRadius: 8,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        textAlign: 'center',
        fontSize: 22,
        color: colors.text,
        marginHorizontal: 3,
    },
    button: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
    buttonText: { color: colors.background, fontWeight: 'bold', fontSize: 16 },
    resendButton: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 18,
    },
    resendButtonText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: { color: 'red', marginBottom: 8, fontSize: 13, textAlign: 'center' },
    successText: { color: 'green', marginBottom: 8, fontSize: 13, textAlign: 'center' },
});