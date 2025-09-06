import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from 'services';
import paths from 'routes/paths';

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        // Clear any stale auth data
        authService.clearAuthData();
        // Redirect to login
        navigate(paths.signin, { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return {
    isAuthenticated: authService.isAuthenticated(),
    user: authService.getUserData(),
  };
};

/**
 * Hook to redirect authenticated users away from auth pages
 * Redirects to dashboard if user is already authenticated
 */
export const useGuestGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        // Redirect to dashboard if already authenticated
        navigate('/', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return {
    isAuthenticated: authService.isAuthenticated(),
  };
};

export default useAuthGuard;