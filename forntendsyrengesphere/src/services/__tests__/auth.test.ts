/**
 * Tests for authentication service
 */

import { authService, clearAuthData, isAuthenticated, getUserData } from '../auth';

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('Auth Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  describe('clearAuthData', () => {
    it('should clear all authentication data from both storages', () => {
      // Set some mock data
      localStorageMock.setItem('synergysphere_access_token', 'test_token');
      localStorageMock.setItem('synergysphere_user_data', '{"id":"1","name":"Test"}');
      sessionStorageMock.setItem('synergysphere_refresh_token', 'refresh_token');

      clearAuthData();

      expect(localStorageMock.getItem('synergysphere_access_token')).toBeNull();
      expect(localStorageMock.getItem('synergysphere_user_data')).toBeNull();
      expect(sessionStorageMock.getItem('synergysphere_refresh_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false when session is expired', () => {
      const expiredTime = Date.now() - 1000; // 1 second ago
      localStorageMock.setItem('synergysphere_access_token', 'test_token');
      localStorageMock.setItem('synergysphere_user_data', '{"id":"1","name":"Test"}');
      localStorageMock.setItem('synergysphere_session_expiry', expiredTime.toString());

      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when valid token and session exist', () => {
      const futureTime = Date.now() + 3600000; // 1 hour from now
      localStorageMock.setItem('synergysphere_access_token', 'test_token');
      localStorageMock.setItem('synergysphere_user_data', '{"id":"1","name":"Test"}');
      localStorageMock.setItem('synergysphere_session_expiry', futureTime.toString());

      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getUserData', () => {
    it('should return null when no user data exists', () => {
      expect(getUserData()).toBeNull();
    });

    it('should return parsed user data when it exists', () => {
      const userData = { id: '1', name: 'Test User', email: 'test@example.com', role: 'member' as const };
      localStorageMock.setItem('synergysphere_user_data', JSON.stringify(userData));

      expect(getUserData()).toEqual(userData);
    });

    it('should return null when user data is invalid JSON', () => {
      localStorageMock.setItem('synergysphere_user_data', 'invalid json');

      expect(getUserData()).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear all auth data', async () => {
      // Set some mock data
      localStorageMock.setItem('synergysphere_access_token', 'test_token');
      localStorageMock.setItem('synergysphere_user_data', '{"id":"1","name":"Test"}');
      sessionStorageMock.setItem('synergysphere_refresh_token', 'refresh_token');

      await authService.logout();

      expect(localStorageMock.getItem('synergysphere_access_token')).toBeNull();
      expect(localStorageMock.getItem('synergysphere_user_data')).toBeNull();
      expect(sessionStorageMock.getItem('synergysphere_refresh_token')).toBeNull();
    });
  });

  describe('getAuthState', () => {
    it('should return unauthenticated state when no auth data exists', () => {
      const state = authService.getAuthState();

      expect(state).toEqual({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    });

    it('should return authenticated state when valid auth data exists', () => {
      const userData = { id: '1', name: 'Test User', email: 'test@example.com', role: 'member' as const };
      const futureTime = Date.now() + 3600000; // 1 hour from now
      
      localStorageMock.setItem('synergysphere_access_token', 'test_token');
      localStorageMock.setItem('synergysphere_user_data', JSON.stringify(userData));
      localStorageMock.setItem('synergysphere_session_expiry', futureTime.toString());

      const state = authService.getAuthState();

      expect(state).toEqual({
        isAuthenticated: true,
        user: userData,
        loading: false,
      });
    });
  });
});