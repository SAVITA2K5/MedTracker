import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

export default function LoginScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password.');
            return;
        }
        setLoading(true);
        try {
            const data = await login(email, password);
            signIn(data.user, data.access_token);
        } catch (err) {
            Alert.alert(
                'Login Failed',
                err.response?.data?.detail || 'Invalid email or password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryMid]}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.shieldIcon}>🛡️</Text>
                        <Text style={styles.title}>MEDTRACK</Text>
                        <Text style={styles.subtitle}>Sign in to your health guardian</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.grey} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor={COLORS.grey}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={18} color={COLORS.grey} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="••••••••"
                                placeholderTextColor={COLORS.grey}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPass}
                            />
                            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                                <Ionicons
                                    name={showPass ? 'eye-off-outline' : 'eye-outline'}
                                    size={18}
                                    color={COLORS.grey}
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.btnText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            style={styles.link}
                        >
                            <Text style={styles.linkText}>
                                Don't have an account?{' '}
                                <Text style={{ color: COLORS.accent, fontWeight: '700' }}>
                                    Register
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
    header: { alignItems: 'center', marginBottom: 36 },
    shieldIcon: { fontSize: 52, marginBottom: 12 },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: 5,
    },
    subtitle: { fontSize: 13, color: COLORS.lightGrey, marginTop: 6 },
    form: {
        backgroundColor: 'rgba(13,33,68,0.7)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    label: { fontSize: 13, color: COLORS.lightGrey, marginBottom: 6 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.navBg,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: COLORS.white, fontSize: 15 },
    btn: {
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
    link: { marginTop: 20, alignItems: 'center' },
    linkText: { color: COLORS.lightGrey, fontSize: 14 },
});
