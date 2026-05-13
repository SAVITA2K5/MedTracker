import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../../context/HealthContext';
import { COLORS } from '../../styles/colors';
import { getHealthScoreLabel } from '../../utils/validators';

const { width } = Dimensions.get('window');

export default function HealthScoreScreen() {
    const { healthScore, predictionHistory } = useHealth();
    const score = healthScore ?? 100;
    const label = getHealthScoreLabel(score);

    const scoreColor =
        score >= 80 ? COLORS.success :
            score >= 60 ? COLORS.warning : COLORS.danger;

    const arcAngle = (score / 100) * 180; // for visual arc approximation

    const categories = [
        { name: 'Diabetes Risk', value: score >= 60 ? 'Low' : 'High', icon: '🩸', color: score >= 60 ? COLORS.success : COLORS.danger },
        { name: 'Heart Health', value: score >= 70 ? 'Good' : 'Monitor', icon: '❤️', color: score >= 70 ? COLORS.success : COLORS.warning },
        { name: 'BMI Status', value: 'Normal', icon: '⚖️', color: COLORS.success },
        { name: 'Activity', value: 'Active', icon: '🏃', color: COLORS.success },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={[COLORS.navBg, COLORS.primary]} style={styles.header}>
                <Text style={styles.title}>Health Score</Text>
                <Text style={styles.subtitle}>Your comprehensive wellness rating</Text>

                {/* Score display */}
                <View style={styles.scoreContainer}>
                    <View style={[styles.scoreOuter, { borderColor: scoreColor + '33' }]}>
                        <View style={[styles.scoreInner, { borderColor: scoreColor }]}>
                            <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
                            <Text style={styles.scoreMax}>/100</Text>
                            <Text style={[styles.scoreLabel, { color: scoreColor }]}>{label}</Text>
                        </View>
                    </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBg}>
                    <LinearGradient
                        colors={[COLORS.success, COLORS.warning, COLORS.danger]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressTrack, { width: `${score}%` }]}
                    />
                </View>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabel}>0</Text>
                    <Text style={styles.progressLabel}>50</Text>
                    <Text style={styles.progressLabel}>100</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Category cards */}
                <Text style={styles.sectionTitle}>Health Categories</Text>
                <View style={styles.grid}>
                    {categories.map((cat) => (
                        <View key={cat.name} style={styles.catCard}>
                            <Text style={styles.catIcon}>{cat.icon}</Text>
                            <Text style={styles.catName}>{cat.name}</Text>
                            <Text style={[styles.catValue, { color: cat.color }]}>{cat.value}</Text>
                        </View>
                    ))}
                </View>

                {/* History */}
                {predictionHistory.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Prediction History</Text>
                        {predictionHistory.slice(0, 5).map((item, i) => (
                            <View key={i} style={styles.histRow}>
                                <Ionicons name="pulse" size={18} color={COLORS.accent} />
                                <Text style={styles.histDisease}>{item.disease}</Text>
                                <View style={styles.flex1} />
                                <Text style={[
                                    styles.histRisk,
                                    {
                                        color: item.risk_label === 'Low' ? COLORS.success :
                                            item.risk_label === 'Moderate' ? COLORS.warning : COLORS.danger
                                    }
                                ]}>
                                    {item.risk_label}
                                </Text>
                                <Text style={styles.histScore}>  {item.health_score}</Text>
                            </View>
                        ))}
                    </>
                )}

                {predictionHistory.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📊</Text>
                        <Text style={styles.emptyText}>Run your first prediction to see history here.</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.white },
    subtitle: { fontSize: 13, color: COLORS.lightGrey, marginTop: 4, marginBottom: 20 },
    scoreContainer: { marginBottom: 20 },
    scoreOuter: {
        width: 160, height: 160, borderRadius: 80, borderWidth: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    scoreInner: {
        width: 130, height: 130, borderRadius: 65, borderWidth: 4,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: COLORS.primary,
    },
    scoreNum: { fontSize: 42, fontWeight: '900' },
    scoreMax: { fontSize: 14, color: COLORS.lightGrey },
    scoreLabel: { fontSize: 14, fontWeight: '700', marginTop: 2 },
    progressBg: {
        width: width - 40, height: 8, backgroundColor: COLORS.cardBorder,
        borderRadius: 4, overflow: 'hidden',
    },
    progressTrack: { height: 8, borderRadius: 4 },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between', width: width - 40, marginTop: 4 },
    progressLabel: { fontSize: 10, color: COLORS.grey },
    scroll: { flex: 1, padding: 20 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.white, marginBottom: 12, marginTop: 8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    catCard: {
        width: (width - 52) / 2,
        backgroundColor: COLORS.cardBg,
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    catIcon: { fontSize: 26, marginBottom: 6 },
    catName: { fontSize: 12, color: COLORS.lightGrey, textAlign: 'center' },
    catValue: { fontSize: 14, fontWeight: '700', marginTop: 4 },
    histRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        gap: 10,
    },
    histDisease: { fontSize: 13, color: COLORS.lightGrey, textTransform: 'capitalize' },
    flex1: { flex: 1 },
    histRisk: { fontSize: 13, fontWeight: '700' },
    histScore: { fontSize: 12, color: COLORS.grey },
    emptyState: { alignItems: 'center', marginTop: 30, padding: 20 },
    emptyIcon: { fontSize: 48, marginBottom: 12 },
    emptyText: { color: COLORS.lightGrey, textAlign: 'center', fontSize: 14 },
});
