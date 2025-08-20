import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    preferences: any;
  };
  error?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  preferences: any;
}

// Register a new user
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Registration failed',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error during registration',
    };
  }
}

// Login user
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error during login',
    };
  }
}

// Logout user
export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userData');
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    console.log('[auth.ts] isAuthenticated: checking for token...');
    const timeout = new Promise<boolean>((resolve) =>
      setTimeout(() => {
        console.error('[auth.ts] isAuthenticated: TIMEOUT');
        resolve(false);
      }, 5000)
    );
    const tokenPromise = AsyncStorage.getItem('token').then((token) => {
      console.log('[auth.ts] isAuthenticated: token value:', token);
      return !!token;
    });
    return await Promise.race([tokenPromise, timeout]);
  } catch (e) {
    console.error('[auth.ts] isAuthenticated: error reading token:', e);
    return false;
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const userData = await AsyncStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

// Get auth token
export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('token');
}

// Get auth header
export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
