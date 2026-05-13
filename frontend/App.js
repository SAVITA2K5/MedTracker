// MEDTRACK App Entry Point
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    return (
        <AuthProvider>
            <HealthProvider>
                <StatusBar style="light" backgroundColor="#0A1628" />
                <AppNavigator />
            </HealthProvider>
        </AuthProvider>
    );
}
