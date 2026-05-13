import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Animated,
    Vibration,
    ScrollView,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { triggerSOS, addEmergencyContact, getEmergencyContacts } from '../../services/sosService';

export default function SOSScreen() {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [location, setLocation] = useState(null);
    const [sosActive, setSOSActive] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        loadContacts();
        requestLocation();
    }, []);

    // Pulse animation when SOS active
    useEffect(() => {
        if (sosActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [sosActive]);

    const loadContacts = async () => {
        if (!user) return;
        try {
            const data = await getEmergencyContacts(user.id);
            setContacts(data || []);
        } catch { /* no contacts yet */ }
    };

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        }
    };

    const handleSOS = async () => {
        if (contacts.length === 0) {
            Alert.alert('No Contacts', 'Please add emergency contacts first.');
            return;
        }
        Alert.alert(
            '🚨 SOS Alert',
            'This will send an emergency alert to all your contacts. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send SOS',
                    style: 'destructive',
                    onPress: async () => {
                        Vibration.vibrate([200, 100, 200, 100, 200]);
                        setSOSActive(true);
                        try {
                            const result = await triggerSOS(user.id, location?.latitude, location?.longitude);
                            Alert.alert('✅ SOS Sent', `Alerted ${result.contacts_notified} contact(s).`);
                        } catch {
                            Alert.alert('Error', 'Failed to send SOS. Check your network.');
                        } finally {
                            setTimeout(() => setSOSActive(false), 3000);
                        }
                    },
                },
            ]
        );
    };

    const handleAddContact = async () => {
        if (!newContact.name || !newContact.phone) {
            Alert.alert('Error', 'Name and phone are required.');
            return;
        }
        try {
            await addEmergencyContact(user.id, newContact);
            setNewContact({ name: '', phone: '', relationship: '' });
            setShowAddForm(false);
            loadContacts();
        } catch {
            Alert.alert('Error', 'Failed to add contact.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#3D0000', COLORS.primary]} style={styles.header}>
                <Ionicons name="warning" size={28} color={COLORS.danger} />
                <Text style={styles.title}>Emergency SOS</Text>
                <Text style={styles.subtitle}>One tap to alert all emergency contacts</Text>
            </LinearGradient>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* SOS Button */}
                <View style={styles.sosButtonWrapper}>
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <TouchableOpacity
                            style={[styles.sosButton, sosActive && styles.sosButtonActive]}
                            onPress={handleSOS}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="warning" size={40} color={COLORS.white} />
                            <Text style={styles.sosButtonText}>
                                {sosActive ? 'SENDING...' : 'SOS'}
                            </Text>
                            <Text style={styles.sosButtonSub}>Hold to activate</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Location status */}
                <View style={styles.locCard}>
                    <Ionicons
                        name={location ? 'location' : 'location-outline'}
                        size={18}
                        color={location ? COLORS.success : COLORS.grey}
                    />
                    <Text style={[styles.locText, { color: location ? COLORS.success : COLORS.grey }]}>
                        {location
                            ? `📍 Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                            : 'Location not available'}
                    </Text>
                </View>

                {/* Contacts */}
                <View style={styles.contactsHeader}>
                    <Text style={styles.sectionTitle}>Emergency Contacts ({contacts.length})</Text>
                    <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)} style={styles.addBtn}>
                        <Ionicons name="add-circle" size={22} color={COLORS.accent} />
                        <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {showAddForm && (
                    <View style={styles.addForm}>
                        {[
                            { label: 'Full Name *', field: 'name' },
                            { label: 'Phone *', field: 'phone' },
                            { label: 'Relationship', field: 'relationship' },
                        ].map((f) => (
                            <View key={f.field} style={styles.formField}>
                                <Text style={styles.formLabel}>{f.label}</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={newContact[f.field]}
                                    onChangeText={(v) => setNewContact((c) => ({ ...c, [f.field]: v }))}
                                    placeholderTextColor={COLORS.grey}
                                    placeholder={f.label}
                                />
                            </View>
                        ))}
                        <TouchableOpacity style={styles.saveBtn} onPress={handleAddContact}>
                            <Text style={styles.saveBtnText}>Save Contact</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {contacts.map((c, i) => (
                    <View key={i} style={styles.contactCard}>
                        <View style={styles.contactAvatar}>
                            <Text style={{ fontSize: 18 }}>👤</Text>
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactName}>{c.name}</Text>
                            <Text style={styles.contactPhone}>{c.phone}</Text>
                            {c.relationship && <Text style={styles.contactRel}>{c.relationship}</Text>}
                        </View>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    </View>
                ))}

                {contacts.length === 0 && !showAddForm && (
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>📱</Text>
                        <Text style={styles.emptyText}>Add at least one emergency contact to use SOS.</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, alignItems: 'center', gap: 8 },
    title: { fontSize: 24, fontWeight: '900', color: COLORS.white, letterSpacing: 1 },
    subtitle: { fontSize: 13, color: COLORS.lightGrey },
    scroll: { flex: 1, padding: 20 },
    sosButtonWrapper: { alignItems: 'center', marginBottom: 20 },
    sosButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.danger,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.danger,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 16,
    },
    sosButtonActive: { backgroundColor: '#AA0000' },
    sosButtonText: { color: COLORS.white, fontSize: 24, fontWeight: '900', marginTop: 6 },
    sosButtonSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
    locCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    locText: { fontSize: 12 },
    contactsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.white },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addBtnText: { color: COLORS.accent, fontWeight: '600' },
    addForm: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    formField: { marginBottom: 12 },
    formLabel: { fontSize: 12, color: COLORS.lightGrey, marginBottom: 4 },
    formInput: {
        backgroundColor: COLORS.navBg,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: COLORS.white,
        fontSize: 14,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    saveBtn: {
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    saveBtnText: { color: COLORS.white, fontWeight: '700' },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        gap: 14,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    contactAvatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.accent + '22',
        justifyContent: 'center', alignItems: 'center',
    },
    contactInfo: { flex: 1 },
    contactName: { fontSize: 14, fontWeight: '700', color: COLORS.white },
    contactPhone: { fontSize: 12, color: COLORS.lightGrey, marginTop: 2 },
    contactRel: { fontSize: 11, color: COLORS.accent, marginTop: 1 },
    empty: { alignItems: 'center', padding: 30 },
    emptyIcon: { fontSize: 40, marginBottom: 10 },
    emptyText: { color: COLORS.lightGrey, textAlign: 'center', fontSize: 14, lineHeight: 22 },
});
