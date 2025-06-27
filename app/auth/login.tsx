import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

// Add onLogin prop
interface LoginScreenProps {
  onLogin?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        console.log({ email, password });
        if (onLogin) {
          onLogin();
        } else {
          router.replace('/tabs/home');
        }
    };

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

                <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <Text style={styles.bottomText}>
                    Don't have an account?
                    <Text style={styles.signUp} onPress={() => router.push('./register')}> Sign Up</Text>
                </Text>
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
        marginTop: 20,
        fontSize: 12,
        color: colors.textSecondary
    },
    signUp: {
        color: colors.primary,
        fontWeight: 'bold'
    }
});

export default LoginScreen;
