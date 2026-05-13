import React from 'react';
import {
    NavigationContainer,
    DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/colors';

// ── Screens ───────────────────────────────────────────────────
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PredictionForm from '../screens/Prediction/PredictionForm';
import ResultScreen from '../screens/Prediction/ResultScreen';
import ChatbotScreen from '../screens/Chatbot/ChatbotScreen';
import HealthScoreScreen from '../screens/Health/HealthScoreScreen';
import SOSScreen from '../screens/SOS/SOSScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Nav theme ─────────────────────────────────────────────────
const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.primary,
        card: COLORS.navBg,
        text: COLORS.white,
        border: COLORS.cardBorder,
    },
};

// ── Bottom tab icon helper ────────────────────────────────────
const tabIcon = (name) => ({ color, size }) =>
    <Ionicons name={name} size={size} color={color} />;

// ── Authenticated tab navigator ───────────────────────────────
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.navBg,
                    borderTopColor: COLORS.cardBorder,
                    paddingBottom: 6,
                    height: 60,
                },
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.grey,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ tabBarIcon: tabIcon('home'), title: 'Home' }}
            />
            <Tab.Screen
                name="Predict"
                component={PredictionForm}
                options={{ tabBarIcon: tabIcon('analytics'), title: 'Predict' }}
            />
            <Tab.Screen
                name="Chatbot"
                component={ChatbotScreen}
                options={{ tabBarIcon: tabIcon('chatbubble-ellipses'), title: 'MedAI' }}
            />
            <Tab.Screen
                name="Health"
                component={HealthScoreScreen}
                options={{ tabBarIcon: tabIcon('heart'), title: 'Health' }}
            />
            <Tab.Screen
                name="SOS"
                component={SOSScreen}
                options={{ tabBarIcon: tabIcon('warning'), title: 'SOS', tabBarActiveTintColor: COLORS.danger }}
            />
        </Tab.Navigator>
    );
}

// ── Root navigator ────────────────────────────────────────────
export default function AppNavigator() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    // ── Auth flow ──────────────────────────────────────
                    <>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    // ── Main app flow ──────────────────────────────────
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="Result" component={ResultScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
