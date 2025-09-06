import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    acceptTerms: false 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

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

  const validateTerms = (acceptTerms: boolean): string | undefined => {
    if (!acceptTerms) {
      return 'You must accept the terms and conditions';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const nameError = validateName(user.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(user.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(user.password);
    if (passwordError) newErrors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(user.confirmPassword, user.password);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    
    const termsError = validateTerms(user.acceptTerms);
    if (termsError) newErrors.acceptTerms = termsError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setUser({ ...user, [name]: newValue });
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success
      console.log('Signup successful:', user);
      
      // Redirect to dashboard after successful signup
      navigate('/');
      
    } catch (error) {
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign Up
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Let's Join us! create account with,
      </Typography>

      <Stack mt={3} spacing={1.75} width={1}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:google-icon" />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<IconifyIcon icon="logos:apple" sx={{ mb: 0.5 }} />}
          sx={{ bgcolor: 'info.main', '&:hover': { bgcolor: 'info.main' } }}
        >
          Apple
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }}>or Signup with</Divider>

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
          id="name"
          name="name"
          type="text"
          value={user.name}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Name"
          autoComplete="name"
          fullWidth
          autoFocus
          required
          error={!!errors.name}
          helperText={errors.name}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:user-circle-02" />
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
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Email"
          autoComplete="email"
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:mail-at-sign-02" />
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
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Password"
          autoComplete="new-password"
          fullWidth
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
                  opacity: user.password ? 1 : 0,
                  pointerEvents: user.password ? 'auto' : 'none',
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
          value={user.confirmPassword}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Confirm Password"
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
                  opacity: user.confirmPassword ? 1 : 0,
                  pointerEvents: user.confirmPassword ? 'auto' : 'none',
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

        <Stack mt={1} alignItems="flex-start">
          <FormControlLabel
            control={
              <Checkbox 
                id="acceptTerms" 
                name="acceptTerms" 
                size="small"
                checked={user.acceptTerms}
                onChange={handleInputChange}
                disabled={loading}
                sx={{
                  color: 'neutral.main',
                  '&.Mui-checked': {
                    color: '#0077b6',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                I accept the{' '}
                <Link href="#" sx={{ color: '#0077b6', textDecoration: 'underline' }}>
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="#" sx={{ color: '#0077b6', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ ml: -1, alignItems: 'flex-start' }}
          />
          {errors.acceptTerms && (
            <Typography 
              variant="caption" 
              color="error" 
              sx={{ ml: 1, mt: 0.5 }}
            >
              {errors.acceptTerms}
            </Typography>
          )}
        </Stack>

        <Button 
          type="submit" 
          variant="contained" 
          size="medium" 
          fullWidth
          disabled={loading}
          sx={{ 
            mt: 1.5,
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
              <span style={{ opacity: 0 }}>Sign Up</span>
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Already have an account? <Link href={paths.signin} sx={{ color: '#0077b6' }}>Signin</Link>
      </Typography>
    </>
  );
};

export default Signup;