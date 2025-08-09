import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { theme } from './src/theme';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" backgroundColor={theme.colors.background.primary} />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;