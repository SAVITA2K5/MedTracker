import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { COLORS, RISK_COLORS } from '../../styles/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const { user, signOut } = useAuth();
    const { latestPrediction, healthScore } = useHealth();

    const score = healthScore ?? 100;
    const scoreColor =
        score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.danger;

    const quickActions = [
        { icon: 'analytics', label: 'Check Diabetes', screen: 'Predict', color: COLORS.accent },
        { icon: 'heart', label: 'Heart Check', screen: 'Predict', color: COLORS.danger },
        { icon: 'chatbubble-ellipses', label: 'Ask MedAI', screen: 'Chatbot', color: COLORS.success },
        { icon: 'warning', label: 'SOS Alert', screen: 'SOS', color: '#FF6E00' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.navBg, COLORS.primaryLight]}
                style={styles.header}
            >
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.greeting}>Good day,</Text>
                        <Text style={styles.name}>{user?.full_name?.split(' ')[0]} 👋</Text>
                    </View>
                    <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={22} color={COLORS.lightGrey} />
                    </TouchableOpacity>
                </View>

                {/* Health Score Circle */}
                <View style={styles.scoreCard}>
                    <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
                        <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
                        <Text style={styles.scoreLabel}>Health Score</Text>
                    </View>
                    <View style={styles.scoreInfo}>
                        <Text style={styles.scoreTitle}>Your Wellness</Text>
                        <Text style={styles.scoreSubtitle}>
                            {score >= 80 ? '🟢 Excellent – Keep it up!' :
                                score >= 60 ? '🟡 Good – Monitor closely.' :
                                    '🔴 At Risk – Take action!'}
                        </Text>
                        {latestPrediction && (
                            <View style={[
                                styles.riskBadge,
                                { backgroundColor: RISK_COLORS[latestPrediction.risk_label] + '33' }
                            ]}>
                                <Text style={[styles.riskText, { color: RISK_COLORS[latestPrediction.risk_label] }]}>
                                    Last: {latestPrediction.disease} – {latestPrediction.risk_label}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {quickActions.map((action) => (
                        <TouchableOpacity
                            key={action.label}
                            style={styles.actionCard}
                            onPress={() => navigation.navigate(action.screen)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color + '22' }]}>
                                <Ionicons name={action.icon} size={26} color={action.color} />
                            </View>
                            <Text style={styles.actionLabel}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tips Banner */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>💡</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.tipTitle}>Daily Health Tip</Text>
                        <Text style={styles.tipBody}>
                            Staying hydrated reduces blood viscosity and lowers heart disease risk by up to 46%.
                        </Text>
                    </View>
                </View>

                {/* Recent prediction */}
                {latestPrediction && (
                    <View style={styles.predCard}>
                        <Text style={styles.sectionTitle}>Latest Prediction</Text>
                        <View style={styles.predRow}>
                            <Ionicons name="pulse" size={20} color={COLORS.accent} />
                            <Text style={styles.predText}>
                                {latestPrediction.disease} · Risk:{' '}
                                <Text style={{ color: RISK_COLORS[latestPrediction.risk_label] }}>
                                    {latestPrediction.risk_label}
                                </Text>
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.viewBtn}
                            onPress={() => navigation.navigate('Result')}
                        >
                            <Text style={styles.viewBtnText}>View Details →</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    greeting: { fontSize: 13, color: COLORS.lightGrey },
    name: { fontSize: 22, fontWeight: '800', color: COLORS.white, marginTop: 2 },
    logoutBtn: { padding: 8 },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(10,22,40,0.5)',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    scoreCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    scoreNum: { fontSize: 28, fontWeight: '900' },
    scoreLabel: { fontSize: 10, color: COLORS.lightGrey },
    scoreInfo: { flex: 1 },
    scoreTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
    scoreSubtitle: { fontSize: 12, color: COLORS.lightGrey, marginTop: 4, lineHeight: 18 },
    riskBadge: { marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start' },
    riskText: { fontSize: 11, fontWeight: '600' },
    scroll: { flex: 1, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.white, marginTop: 22, marginBottom: 12 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: {
        width: (width - 52) / 2,
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    actionIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.white, textAlign: 'center' },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#1A2F1A',
        borderRadius: 14,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.success + '44',
        gap: 12,
        alignItems: 'flex-start',
    },
    tipIcon: { fontSize: 22 },
    tipTitle: { fontSize: 13, fontWeight: '700', color: COLORS.success, marginBottom: 4 },
    tipBody: { fontSize: 12, color: COLORS.lightGrey, lineHeight: 18 },
    predCard: { backgroundColor: COLORS.cardBg, borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: COLORS.cardBorder },
    predRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
    predText: { color: COLORS.lightGrey, fontSize: 14 },
    viewBtn: { marginTop: 12, alignSelf: 'flex-end' },
    viewBtnText: { color: COLORS.accent, fontSize: 13, fontWeight: '700' },
});
