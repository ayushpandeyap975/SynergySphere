import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface User {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Signin = () => {
  const [user, setUser] = useState<User>({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(user.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(user.password);
    if (passwordError) newErrors.password = passwordError;
    
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
      console.log('Login successful:', user);
      
      // In a real app, you would handle successful login here
      // e.g., redirect to dashboard, store auth token, etc.
      
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography align="center" variant="h4">
        Sign In
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Welcome back! Let's continue with,
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

      <Divider sx={{ my: 4 }}>or Signin with</Divider>

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
          id="email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          variant="filled"
          placeholder="Your Email"
          autoComplete="email"
          fullWidth
          autoFocus
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
          autoComplete="current-password"
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

        <Stack mt={-2} alignItems="center" justifyContent="space-between">
          <FormControlLabel
            control={
              <Checkbox 
                id="rememberMe" 
                name="rememberMe" 
                size="small"
                checked={user.rememberMe}
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
            label="Remember me"
            sx={{ ml: -1 }}
          />
          <Link href={paths.forgotPassword} fontSize="body2.fontSize" sx={{ color: '#0077b6' }}>
            Forgot password?
          </Link>
        </Stack>

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
              <span style={{ opacity: 0 }}>Sign In</span>
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Don't have an account? <Link href={paths.signup} sx={{ color: '#0077b6' }}>Signup</Link>
      </Typography>
    </>
  );
};

export default Signin;
