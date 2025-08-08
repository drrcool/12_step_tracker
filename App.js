import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';

export default function App() {
    return (
        <SafeAreaProvider>
            <AppNavigator />
            <StatusBar style="auto" backgroundColor={theme.colors.background.primary} />
        </SafeAreaProvider>
    );
}