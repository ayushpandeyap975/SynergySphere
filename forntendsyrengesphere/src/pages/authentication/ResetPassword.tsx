import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [form, setForm] = useState<ResetPasswordForm>({ 
    password: '', 
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        // Simulate token validation API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, consider token valid if it exists
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword, form.password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setForm({ ...form, [name]: value });
    
    // Clear field-specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success
      console.log('Password reset successful');
      setSuccess(true);
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        navigate(paths.signin);
      }, 3000);
      
    } catch (error) {
      setErrors({ general: 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <Stack spacing={3} alignItems="center">
        <CircularProgress sx={{ color: '#0077b6' }} />
        <Typography variant="body2" color="text.secondary">
          Validating reset link...
        </Typography>
      </Stack>
    );
  }

  // Invalid or expired token
  if (tokenValid === false) {
    return (
      <>
        <Typography align="center" variant="h4" color="error">
          Invalid Reset Link
        </Typography>
        <Typography mt={1.5} align="center" variant="body2" color="text.secondary">
          This password reset link is invalid or has expired. Please request a new one.
        </Typography>

        <Stack mt={4} spacing={2} alignItems="center">
          <Button
            variant="contained"
            href={paths.forgotPassword}
            sx={{
              backgroundColor: '#0077b6',
              '&:hover': {
                backgroundColor: '#005a8a',
              },
            }}
          >
            Request New Reset Link
          </Button>
          
          <Link 
            href={paths.signin} 
            sx={{ 
              color: '#0077b6',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Back to Sign In
          </Link>
        </Stack>
      </>
    );
  }

  // Success state
  if (success) {
    return (
      <>
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 119, 182, 0.1)',
              mb: 2,
            }}
          >
            <IconifyIcon 
              icon="hugeicons:checkmark-circle-02" 
              sx={{ 
                fontSize: 48, 
                color: '#0077b6' 
              }} 
            />
          </Box>
          
          <Typography variant="h4" textAlign="center" color="text.primary">
            Password Reset Successful
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary"
            sx={{ maxWidth: 400, lineHeight: 1.6 }}
          >
            Your password has been successfully reset. You will be redirected to the sign in page in a few seconds.
          </Typography>
        </Stack>

        <Stack mt={4} alignItems="center">
          <Link 
            href={paths.signin} 
            sx={{ 
              color: '#0077b6',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign In Now
          </Link>
        </Stack>
      </>
    );
  }

  // Reset password form
  return (
    <>
      <Typography align="center" variant="h4">
        Reset Password
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Enter your new password below.
      </Typography>

      <Stack component="form" mt={3} onSubmit={handleSubmit} direction="column" gap={2}>
        {errors.general && (
          <Typography 
            variant="body2" 
            color="error" 
            sx={{ 
              textAlign: 'center',
              backgroundColor: 'error.lighter',
              padding: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'error.main'
            }}
          >
            {errors.general}
          </Typography>
        )}
        
        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="New Password"
          autoComplete="new-password"
          fullWidth
          autoFocus
          required
          error={!!errors.password}
          helperText={errors.password}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:lock-key" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: form.password ? 1 : 0,
                  pointerEvents: form.password ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                  disabled={loading}
                >
                  <IconifyIcon
                    icon={showPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiFilledInput-root': {
              '&.Mui-focused': {
                backgroundColor: 'rgba(0, 119, 182, 0.04)',
              },
              '&.Mui-focused .MuiFilledInput-underline:after': {
                borderBottomColor: '#0077b6',
              },
            },
          }}
        />
        
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Confirm New Password"
          autoComplete="new-password"
          fullWidth
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:lock-key" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  opacity: form.confirmPassword ? 1 : 0,
                  pointerEvents: form.confirmPassword ? 'auto' : 'none',
                }}
              >
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  sx={{ border: 'none', bgcolor: 'transparent !important' }}
                  edge="end"
                  disabled={loading}
                >
                  <IconifyIcon
                    icon={showConfirmPassword ? 'fluent-mdl2:view' : 'fluent-mdl2:hide-3'}
                    color="neutral.light"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiFilledInput-root': {
              '&.Mui-focused': {
                backgroundColor: 'rgba(0, 119, 182, 0.04)',
              },
              '&.Mui-focused .MuiFilledInput-underline:after': {
                borderBottomColor: '#0077b6',
              },
            },
          }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          size="medium" 
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: '#0077b6',
            '&:hover': {
              backgroundColor: '#005a8a',
            },
            '&:disabled': {
              backgroundColor: 'rgba(0, 119, 182, 0.5)',
            },
            position: 'relative',
          }}
        >
          {loading ? (
            <>
              <CircularProgress 
                size={20} 
                sx={{ 
                  color: 'white',
                  position: 'absolute',
                  left: '50%',
                  marginLeft: '-10px',
                }} 
              />
              <span style={{ opacity: 0 }}>Reset Password</span>
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Remember your password? <Link href={paths.signin} sx={{ color: '#0077b6' }}>Sign In</Link>
      </Typography>
    </>
  );
};

export default ResetPassword;