import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/colors';
import { predictDiabetes, predictHeart } from '../../services/predictionService';
import { useHealth } from '../../context/HealthContext';

const DISEASES = ['Diabetes', 'Heart Disease'];

const Field = ({ label, value, onChange, keyboard, hint }) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboard || 'numeric'}
            placeholder={hint || '0'}
            placeholderTextColor={COLORS.grey}
        />
    </View>
);

export default function PredictionForm({ navigation }) {
    const { savePrediction } = useHealth();
    const [disease, setDisease] = useState('Diabetes');
    const [loading, setLoading] = useState(false);

    // Diabetes fields
    const [diabetesForm, setDiabetesForm] = useState({
        pregnancies: '0', glucose: '', blood_pressure: '',
        skin_thickness: '0', insulin: '0', bmi: '',
        diabetes_pedigree: '0.5', age: '',
    });

    // Heart fields
    const [heartForm, setHeartForm] = useState({
        age: '', sex: '1', cp: '0', trestbps: '',
        chol: '', fbs: '0', restecg: '0', thalach: '',
        exang: '0', oldpeak: '0', slope: '1', ca: '0', thal: '2',
    });

    const updateDiabetes = (k, v) => setDiabetesForm((f) => ({ ...f, [k]: v }));
    const updateHeart = (k, v) => setHeartForm((f) => ({ ...f, [k]: v }));

    const numify = (obj) => Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, isNaN(v) ? v : Number(v)])
    );

    const handlePredict = async () => {
        setLoading(true);
        try {
            let result;
            if (disease === 'Diabetes') {
                result = await predictDiabetes(numify(diabetesForm));
            } else {
                result = await predictHeart(numify(heartForm));
            }
            savePrediction(result);
            navigation.navigate('Result');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.detail || 'Prediction failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Risk Assessment</Text>
                <Text style={styles.subtitle}>Enter your health metrics below</Text>

                {/* Disease toggle */}
                <View style={styles.toggle}>
                    {DISEASES.map((d) => (
                        <TouchableOpacity
                            key={d}
                            style={[styles.toggleBtn, disease === d && styles.toggleActive]}
                            onPress={() => setDisease(d)}
                        >
                            <Text style={[styles.toggleText, disease === d && styles.toggleTextActive]}>
                                {d === 'Diabetes' ? '🩸 ' : '❤️ '}{d}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {disease === 'Diabetes' ? (
                    <>
                        <Field label="Age" value={diabetesForm.age} onChange={(v) => updateDiabetes('age', v)} />
                        <Field label="Glucose (mg/dL)" value={diabetesForm.glucose} onChange={(v) => updateDiabetes('glucose', v)} />
                        <Field label="BMI" value={diabetesForm.bmi} onChange={(v) => updateDiabetes('bmi', v)} />
                        <Field label="Blood Pressure (mmHg)" value={diabetesForm.blood_pressure} onChange={(v) => updateDiabetes('blood_pressure', v)} />
                        <Field label="Insulin (µU/mL)" value={diabetesForm.insulin} onChange={(v) => updateDiabetes('insulin', v)} />
                        <Field label="Skin Thickness (mm)" value={diabetesForm.skin_thickness} onChange={(v) => updateDiabetes('skin_thickness', v)} />
                        <Field label="Diabetes Pedigree" value={diabetesForm.diabetes_pedigree} onChange={(v) => updateDiabetes('diabetes_pedigree', v)} hint="0.0 – 2.5" />
                        <Field label="Pregnancies" value={diabetesForm.pregnancies} onChange={(v) => updateDiabetes('pregnancies', v)} />
                    </>
                ) : (
                    <>
                        <Field label="Age" value={heartForm.age} onChange={(v) => updateHeart('age', v)} />
                        <Field label="Resting BP (mmHg)" value={heartForm.trestbps} onChange={(v) => updateHeart('trestbps', v)} />
                        <Field label="Cholesterol (mg/dL)" value={heartForm.chol} onChange={(v) => updateHeart('chol', v)} />
                        <Field label="Max Heart Rate" value={heartForm.thalach} onChange={(v) => updateHeart('thalach', v)} />
                        <Field label="ST Depression" value={heartForm.oldpeak} onChange={(v) => updateHeart('oldpeak', v)} />
                        <Field label="Sex (0=F, 1=M)" value={heartForm.sex} onChange={(v) => updateHeart('sex', v)} />
                        <Field label="Chest Pain Type (0-3)" value={heartForm.cp} onChange={(v) => updateHeart('cp', v)} />
                        <Field label="Fasting BS >120 (0/1)" value={heartForm.fbs} onChange={(v) => updateHeart('fbs', v)} />
                        <Field label="Exercise Angina (0/1)" value={heartForm.exang} onChange={(v) => updateHeart('exang', v)} />
                        <Field label="Slope (0-2)" value={heartForm.slope} onChange={(v) => updateHeart('slope', v)} />
                        <Field label="CA (0-4)" value={heartForm.ca} onChange={(v) => updateHeart('ca', v)} />
                        <Field label="Thal (0-3)" value={heartForm.thal} onChange={(v) => updateHeart('thal', v)} />
                    </>
                )}

                <TouchableOpacity
                    style={styles.predictBtn}
                    onPress={handlePredict}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <Ionicons name="pulse" size={20} color={COLORS.white} />
                            <Text style={styles.predictBtnText}>Run AI Prediction</Text>
                        </>
                    )}
                </TouchableOpacity>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    header: { backgroundColor: COLORS.navBg, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: '800', color: COLORS.white },
    subtitle: { fontSize: 13, color: COLORS.lightGrey, marginTop: 4 },
    toggle: { flexDirection: 'row', marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 12, padding: 4 },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    toggleActive: { backgroundColor: COLORS.accent },
    toggleText: { color: COLORS.lightGrey, fontSize: 13, fontWeight: '600' },
    toggleTextActive: { color: COLORS.white },
    scroll: { flex: 1, padding: 20 },
    fieldGroup: { marginBottom: 14 },
    label: { fontSize: 13, color: COLORS.lightGrey, marginBottom: 6 },
    input: {
        backgroundColor: COLORS.navBg,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: COLORS.white,
        fontSize: 15,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    predictBtn: {
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    predictBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
