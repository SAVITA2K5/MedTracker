import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useHealth } from '../../context/HealthContext';
import { COLORS, RISK_COLORS } from '../../styles/colors';

const { width } = Dimensions.get('window');

export default function ResultScreen({ navigation }) {
    const { latestPrediction } = useHealth();

    if (!latestPrediction) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.lightGrey, fontSize: 16 }}>No prediction data yet.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>← Run a Prediction</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { disease, risk_label, probability, health_score, shap_features, recommendations } = latestPrediction;
    const riskColor = RISK_COLORS[risk_label] || COLORS.accent;
    const pct = Math.round((probability || 0) * 100);

    return (
        <View style={styles.container}>
            {/* Hero banner */}
            <LinearGradient
                colors={[COLORS.navBg, COLORS.primary]}
                style={styles.hero}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.heroLabel}>{disease?.replace('_', ' ').toUpperCase()} ASSESSMENT</Text>

                {/* Risk ring */}
                <View style={[styles.ring, { borderColor: riskColor }]}>
                    <Text style={[styles.ringPct, { color: riskColor }]}>{pct}%</Text>
                    <Text style={styles.ringLabel}>Risk</Text>
                </View>

                <View style={[styles.riskBadge, { backgroundColor: riskColor + '33' }]}>
                    <Text style={[styles.riskBadgeText, { color: riskColor }]}>
                        {risk_label} Risk
                    </Text>
                </View>
                <Text style={styles.heroSub}>Health Score: {health_score}/100</Text>
            </LinearGradient>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* SHAP Features */}
                {shap_features && shap_features.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔍 Key Factors (XAI)</Text>
                        {shap_features.slice(0, 5).map((f, i) => (
                            <View key={i} style={styles.shapRow}>
                                <Text style={styles.shapFeature}>{f.feature}</Text>
                                <View style={styles.shapBarBg}>
                                    <View
                                        style={[
                                            styles.shapBar,
                                            {
                                                width: `${Math.min(Math.abs(f.shap_value) * 200, 100)}%`,
                                                backgroundColor: f.impact === 'positive' ? COLORS.danger : COLORS.success,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[
                                    styles.shapImpact,
                                    { color: f.impact === 'positive' ? COLORS.danger : COLORS.success }
                                ]}>
                                    {f.impact === 'positive' ? '↑ Risk' : '↓ Risk'}
                                </Text>
                            </View>
                        ))}
                        <Text style={styles.xaiNote}>
                            💡 XAI powered by SHAP – shows each factor's contribution to your risk score.
                        </Text>
                    </View>
                )}

                {/* Recommendations */}
                {recommendations && recommendations.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Recommendations</Text>
                        {recommendations.map((rec, i) => (
                            <View key={i} style={styles.recRow}>
                                <View style={styles.recBullet}>
                                    <Text style={styles.recNum}>{i + 1}</Text>
                                </View>
                                <Text style={styles.recText}>{rec}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* SOS reminder for high risk */}
                {risk_label === 'High' && (
                    <TouchableOpacity
                        style={styles.sosCard}
                        onPress={() => navigation.navigate('SOS')}
                    >
                        <Ionicons name="warning" size={24} color={COLORS.danger} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.sosTitle}>High Risk Detected!</Text>
                            <Text style={styles.sosSub}>Tap to activate SOS or contact your emergency contact.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    hero: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, alignItems: 'center' },
    back: { position: 'absolute', top: 56, left: 20, padding: 6 },
    heroLabel: { fontSize: 12, color: COLORS.lightGrey, letterSpacing: 2, marginBottom: 16 },
    ring: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    ringPct: { fontSize: 32, fontWeight: '900' },
    ringLabel: { fontSize: 12, color: COLORS.lightGrey },
    riskBadge: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 99, marginBottom: 8 },
    riskBadgeText: { fontSize: 15, fontWeight: '800' },
    heroSub: { fontSize: 13, color: COLORS.lightGrey },
    scroll: { flex: 1, padding: 20 },
    section: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white, marginBottom: 14 },
    shapRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    shapFeature: { width: 100, fontSize: 12, color: COLORS.lightGrey },
    shapBarBg: { flex: 1, height: 6, backgroundColor: COLORS.primaryLight, borderRadius: 3, marginHorizontal: 10 },
    shapBar: { height: 6, borderRadius: 3 },
    shapImpact: { fontSize: 11, fontWeight: '600', width: 54 },
    xaiNote: { fontSize: 11, color: COLORS.grey, marginTop: 10, fontStyle: 'italic' },
    recRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    recBullet: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: COLORS.accent,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 12, marginTop: 1,
    },
    recNum: { color: COLORS.white, fontSize: 11, fontWeight: '800' },
    recText: { flex: 1, fontSize: 13, color: COLORS.lightGrey, lineHeight: 20 },
    sosCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.danger + '1A',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.danger + '55',
        marginBottom: 16,
    },
    sosTitle: { fontSize: 14, fontWeight: '700', color: COLORS.danger },
    sosSub: { fontSize: 12, color: COLORS.lightGrey, marginTop: 2 },
    backBtn: { marginTop: 20 },
    backBtnText: { color: COLORS.accent, fontSize: 16 },
});
