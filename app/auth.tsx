import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register } from '../utils/auth';
import Colors from '../constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      let response;
      
      if (isLogin) {
        response = await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        response = await register(name, email, password);
      }
      
      if (response?.success && response?.token) {
        // Store token and user data
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        // Navigate to home screen
        router.replace('/(tabs)');
      } else {
        throw new Error(response?.error || 'Authentication failed');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  const buttonDisabled = 
    (isLogin && (!email || !password)) || 
    (!isLogin && (!name || !email || !password)) ||
    isLoading;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, { color: colors.text }]}>WakeMeUp</Text>
          <Text style={[styles.tagline, { color: colors.subtext }]}>Your Smart Travel Assistant</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.header, { color: colors.text }]}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="Your name"
                placeholderTextColor={colors.subtext}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Your email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Your password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          
          <TouchableOpacity
            style={[
              styles.button,
              buttonDisabled && styles.buttonDisabled
            ]}
            onPress={handleAuth}
            disabled={buttonDisabled}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, { color: colors.subtext }]}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleAuthMode}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  keyboardContainer: ViewStyle;
  logoContainer: ViewStyle;
  logo: TextStyle;
  tagline: TextStyle;
  formContainer: ViewStyle;
  header: TextStyle;
  inputContainer: ViewStyle;
  inputLabel: TextStyle;
  input: TextStyle;
  errorMessage: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  toggleContainer: ViewStyle;
  toggleText: TextStyle;
  toggleLink: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  header: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  errorMessage: {
    color: '#ff6b6b',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  buttonDisabled: {
    backgroundColor: '#94c6e7',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  toggleText: {
    fontSize: FONT_SIZE.sm,
    marginRight: SPACING.xs,
  },
  toggleLink: {
    color: '#3498db',
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
