import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthTabBar } from '@/components/auth/AuthTabBar';
import { authFormStyles } from '@/components/auth/authFormStyles';
import { DividerWithText } from '@/components/auth/DividerWithText';
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { InlineError } from '@/components/ui/InlineError';
import { FigmaButton } from '@/components/ui/FigmaButton';
import { Input } from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage, getValidationErrors } from '@/utils/getErrorMessage';

export default function LoginScreen() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('amit@foodio.in');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleLogin = async () => {
    setError(null);
    setValidationErrors([]);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
      setValidationErrors(getValidationErrors(err));
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AuthTabBar
          active="login"
          onLoginPress={() => undefined}
          onSignupPress={() => router.replace('/(auth)/signup')}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={authFormStyles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={authFormStyles.social}>
              <SocialAuthButton provider="facebook" />
              <SocialAuthButton provider="google" />
            </View>

            <View style={authFormStyles.section}>
              <DividerWithText label="Or continue with email" />
            </View>

            {error || validationErrors.length > 0 ? (
              <InlineError message={error ?? ''} errors={validationErrors} />
            ) : null}

            <View style={authFormStyles.field}>
              <Text style={authFormStyles.fieldLabel}>Email Address</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={authFormStyles.field}>
              <View style={authFormStyles.passwordHeader}>
                <Text style={authFormStyles.fieldLabel}>Password</Text>
                <Pressable accessibilityRole="link" hitSlop={8}>
                  <Text style={authFormStyles.forgot}>Forgot your password?</Text>
                </Pressable>
              </View>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <FigmaButton label="Log In" onPress={handleLogin} loading={isLoggingIn} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
});
