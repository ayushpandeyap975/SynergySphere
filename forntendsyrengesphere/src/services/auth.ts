/**
 * Authentication service for managing user sessions and authentication state
 * Handles login, logout, session management, and authentication persistence
 */

import { handleApiError } from '../utils/errorHandling';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 10000; // 10 seconds

// Storage keys for session management
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'synergysphere_access_token',
  REFRESH_TOKEN: 'synergysphere_refresh_token',
  USER_DATA: 'synergysphere_user_data',
  SESSION_EXPIRY: 'synergysphere_session_expiry',
} as const;

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

/**
 * Generic API request function with authentication headers
 */
const authApiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
      };
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        name: 'NetworkError',
        message: 'Request timeout. Please try again.',
      };
    }
    
    throw error;
  }
};

/**
 * Get access token from storage
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || 
           sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get refresh token from storage
 */
export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || 
           sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Get user data from storage
 */
export const getUserData = (): User | null => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA) || 
                    sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (): boolean => {
  try {
    const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY) || 
                     sessionStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
    if (!expiryStr) return true;
    
    const expiry = parseInt(expiryStr, 10);
    return Date.now() > expiry;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return true;
  }
};

/**
 * Store authentication data in storage
 */
const storeAuthData = (
  authResponse: AuthResponse, 
  rememberMe: boolean = false
): void => {
  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    const expiryTime = Date.now() + (authResponse.expiresIn * 1000);

    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
    storage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = (): void => {
  try {
    // Clear from both localStorage and sessionStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  const userData = getUserData();
  return !!(token && userData && !isSessionExpired());
};

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await authApiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (response.success) {
      storeAuthData(response, credentials.rememberMe || false);
    }

    return response;
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};

/**
 * Logout user and clear session data
 */
export const logout = async (): Promise<void> => {
  try {
    const token = getAccessToken();
    
    // Call logout endpoint if token exists
    if (token) {
      try {
        await authApiRequest('/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed, continuing with local logout:', error);
      }
    }
  } catch (error) {
    console.warn('Error during logout API call:', error);
  } finally {
    // Always clear local auth data
    clearAuthData();
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApiRequest<{ accessToken: string; expiresIn: number }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update access token and expiry
    const storage = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ? localStorage : sessionStorage;
    const expiryTime = Date.now() + (response.expiresIn * 1000);
    
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    storage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());

    return response.accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    // Clear auth data if refresh fails
    clearAuthData();
    return null;
  }
};

/**
 * Get current authentication state
 */
export const getAuthState = (): AuthState => {
  const authenticated = isAuthenticated();
  const userData = authenticated ? getUserData() : null;

  return {
    isAuthenticated: authenticated,
    user: userData,
    loading: false,
  };
};

/**
 * Mock login for development/demo purposes
 */
export const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock validation
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }

  // Mock user data
  const mockUser: User = {
    id: '1',
    name: 'Alex Stanton',
    email: credentials.email,
    avatar: '/src/data/images/avatar3.png',
    role: 'manager',
  };

  const mockResponse: AuthResponse = {
    success: true,
    user: mockUser,
    accessToken: 'mock_access_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresIn: 3600, // 1 hour
    message: 'Login successful',
  };

  storeAuthData(mockResponse, credentials.rememberMe || false);
  return mockResponse;
};

/**
 * Authentication service object with all methods
 */
export const authService = {
  login: import.meta.env.VITE_USE_MOCK_DATA === 'true' ? mockLogin : login,
  logout,
  refreshAccessToken,
  isAuthenticated,
  getAuthState,
  getUserData,
  getAccessToken,
  clearAuthData,
};

export default authService;