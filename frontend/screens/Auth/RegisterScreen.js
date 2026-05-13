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
import { register } from '../../services/authService';

const Field = ({ icon, placeholder, value, onChangeText, keyboard, secure }) => (
    <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color={COLORS.grey} style={styles.icon} />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.grey}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboard || 'default'}
            secureTextEntry={secure}
            autoCapitalize="none"
        />
    </View>
);

export default function RegisterScreen({ navigation }) {
    const { signIn } = useAuth();
    const [form, setForm] = useState({
        full_name: '', email: '', password: '', phone: '', gender: 'Other',
    });
    const [loading, setLoading] = useState(false);

    const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleRegister = async () => {
        if (!form.full_name || !form.email || !form.password) {
            Alert.alert('Error', 'Name, email, and password are required.');
            return;
        }
        if (form.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const data = await register(form);
            signIn(data.user, data.access_token);
        } catch (err) {
            Alert.alert('Registration Failed', err.response?.data?.detail || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={[COLORS.primary, COLORS.primaryMid]} style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.emoji}>🏥</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.sub}>Join the MedAI Guardian family</Text>
                    </View>

                    <View style={styles.form}>
                        <Field icon="person-outline" placeholder="Full Name" value={form.full_name} onChangeText={(v) => update('full_name', v)} />
                        <Field icon="mail-outline" placeholder="Email Address" value={form.email} onChangeText={(v) => update('email', v)} keyboard="email-address" />
                        <Field icon="lock-closed-outline" placeholder="Password (min 6 chars)" value={form.password} onChangeText={(v) => update('password', v)} secure />
                        <Field icon="call-outline" placeholder="Phone Number (optional)" value={form.phone} onChangeText={(v) => update('phone', v)} keyboard="phone-pad" />

                        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.btnText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
                            <Text style={styles.linkText}>
                                Already have an account?{' '}
                                <Text style={{ color: COLORS.accent, fontWeight: '700' }}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
    header: { alignItems: 'center', marginBottom: 28 },
    emoji: { fontSize: 48, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
    sub: { fontSize: 13, color: COLORS.lightGrey, marginTop: 4 },
    form: {
        backgroundColor: 'rgba(13,33,68,0.75)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.navBg,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    icon: { marginRight: 10 },
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
    btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    link: { marginTop: 20, alignItems: 'center' },
    linkText: { color: COLORS.lightGrey, fontSize: 14 },
});
