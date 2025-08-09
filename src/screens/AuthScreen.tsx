import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { Input, Button } from '../components';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, resetPassword, error, clearError } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isLogin && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    clearError();

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        error.message || 'An error occurred during authentication',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await resetPassword(email);
      Alert.alert(
        'Reset Email Sent',
        'Check your email for password reset instructions',
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="flower-outline"
                size={60}
                color={theme.colors.primary[500]}
              />
            </View>
            <Text style={styles.title}>12 Step Tracker</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back' : 'Start your journey'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <Input
                placeholder="Display Name (Optional)"
                value={displayName}
                onChangeText={setDisplayName}
                icon="person-outline"
              />
            )}

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock-closed-outline"
            />

            {!isLogin && (
              <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon="lock-closed-outline"
              />
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              title={isLogin ? 'Sign In' : 'Sign Up'}
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              style={styles.submitButton}
            />

            {isLogin && (
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleButton}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recovery Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
                            "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would."
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.recovery.serenity,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  forgotButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.md,
  },
  forgotText: {
    fontSize: 14,
    color: theme.colors.primary[500],
    textDecorationLine: 'underline',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.xs,
  },
  toggleButton: {
    fontSize: 14,
    color: theme.colors.primary[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  messageContainer: {
    backgroundColor: theme.colors.recovery.gratitude,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    color: theme.colors.error || '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
});

export default AuthScreen;
