import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

export default function SignupScreen() {
  const { register, verifyOtp, login } = useAuth();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleRegister = async () => {
    setError(null);
    setValidationErrors([]);
    setLoading(true);
    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    try {
      await register({
        name,
        email: email.trim(),
        password,
        ...(mobile.trim() ? { phone: mobile.trim() } : {}),
      });
      setStep('verify');
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
      setValidationErrors(getValidationErrors(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setValidationErrors([]);
    setLoading(true);
    try {
      await verifyOtp({ email: email.trim(), code: otp.trim() });
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (err) {
      setError(getErrorMessage(err, 'Verification failed'));
      setValidationErrors(getValidationErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AuthTabBar
          active="signup"
          onSignupPress={() => undefined}
          onLoginPress={() => router.replace('/(auth)/login')}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={authFormStyles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {step === 'register' ? (
              <>
                <View style={authFormStyles.social}>
                  <SocialAuthButton provider="facebook" />
                  <SocialAuthButton provider="google" />
                </View>

                <View style={authFormStyles.section}>
                  <DividerWithText label="Or continue with email" />
                </View>
              </>
            ) : (
              <Text style={authFormStyles.verifyHint}>
                Enter the OTP sent to your email (check backend logs in dev)
              </Text>
            )}

            {error || validationErrors.length > 0 ? (
              <InlineError message={error ?? ''} errors={validationErrors} />
            ) : null}

            {step === 'register' ? (
              <>
                <View style={authFormStyles.nameRow}>
                  <View style={authFormStyles.nameColumn}>
                    <Text style={authFormStyles.fieldLabel}>First name</Text>
                    <Input
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </View>
                  <View style={authFormStyles.nameColumn}>
                    <Text style={authFormStyles.fieldLabel}>Last name</Text>
                    <Input
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </View>
                </View>

                <View style={authFormStyles.signupField}>
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

                <View style={authFormStyles.signupField}>
                  <Text style={authFormStyles.fieldLabel}>Mobile number</Text>
                  <Input
                    value={mobile}
                    onChangeText={setMobile}
                    placeholder="Enter your mobile number"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                  />
                </View>

                <View style={authFormStyles.signupField}>
                  <Text style={authFormStyles.fieldLabel}>Password</Text>
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    autoComplete="new-password"
                  />
                </View>

                <FigmaButton label="Sign Up" onPress={handleRegister} loading={loading} />

                <Text style={authFormStyles.terms}>
                  By clicking sign up, continue with Facebook or Google, you agree to our{' '}
                  <Text style={authFormStyles.termsLink}>Terms and Conditions</Text> and{' '}
                  <Text style={authFormStyles.termsLink}>Privacy Statement</Text>
                </Text>
              </>
            ) : (
              <>
                <View style={authFormStyles.field}>
                  <Text style={authFormStyles.fieldLabel}>OTP Code</Text>
                  <Input
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter verification code"
                    keyboardType="number-pad"
                  />
                </View>
                <FigmaButton label="Verify & Continue" onPress={handleVerify} loading={loading} />
              </>
            )}
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
