import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../styles/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate to Login after 2.5 s
        const timer = setTimeout(() => navigation.replace('Login'), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight, COLORS.navBg]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Animated.View
                style={[
                    styles.logoContainer,
                    { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                ]}
            >
                {/* Shield icon (text-based for Phase 1) */}
                <View style={styles.shield}>
                    <Text style={styles.shieldIcon}>🛡️</Text>
                </View>

                <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                    <Text style={styles.appName}>MEDTRACK</Text>
                    <Text style={styles.tagline}>MedAI Guardian</Text>
                    <Text style={styles.sub}>AI-Powered Health Risk Prediction</Text>
                </Animated.View>
            </Animated.View>

            {/* Pulse dot loader */}
            <View style={styles.loader}>
                {[0, 1, 2].map((i) => (
                    <PulseDot key={i} delay={i * 200} />
                ))}
            </View>
        </LinearGradient>
    );
}

function PulseDot({ delay }) {
    const anim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.dot, { opacity: anim }]} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    shield: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(30, 144, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: COLORS.accent,
    },
    shieldIcon: {
        fontSize: 48,
    },
    appName: {
        fontSize: 40,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: 6,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: COLORS.accent,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
        letterSpacing: 2,
    },
    sub: {
        fontSize: 13,
        color: COLORS.lightGrey,
        textAlign: 'center',
        marginTop: 8,
    },
    loader: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 60,
        gap: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
        marginHorizontal: 4,
    },
});
