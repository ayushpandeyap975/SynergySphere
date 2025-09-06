import { useState, ChangeEvent, FormEvent } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import IconifyIcon from 'components/base/IconifyIcon';
import paths from 'routes/paths';

interface FormErrors {
  email?: string;
  general?: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    
    // Clear email error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
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
      console.log('Password reset email sent to:', email);
      setSubmitted(true);
      
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
            Check Your Email
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary"
            sx={{ maxWidth: 400, lineHeight: 1.6 }}
          >
            We've sent a password reset link to{' '}
            <Typography 
              component="span" 
              variant="body2" 
              sx={{ 
                color: '#0077b6', 
                fontWeight: 'medium' 
              }}
            >
              {email}
            </Typography>
            . Please check your inbox and follow the instructions to reset your password.
          </Typography>
          
          <Typography 
            variant="body2" 
            textAlign="center" 
            color="text.secondary"
            sx={{ fontSize: '0.875rem' }}
          >
            Didn't receive the email? Check your spam folder or try again.
          </Typography>
        </Stack>

        <Stack mt={4} spacing={2} alignItems="center">
          <Button
            onClick={() => {
              setSubmitted(false);
              setEmail('');
              setErrors({});
            }}
            variant="outlined"
            sx={{ 
              color: '#0077b6',
              borderColor: '#0077b6',
              '&:hover': {
                borderColor: '#005a8a',
                backgroundColor: 'rgba(0, 119, 182, 0.04)',
              },
            }}
          >
            Send Another Email
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

  return (
    <>
      <Typography align="center" variant="h4">
        Forgot Password?
      </Typography>
      <Typography mt={1.5} align="center" variant="body2">
        Enter your email address and we'll send you a link to reset your password.
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
          id="email"
          name="email"
          type="email"
          value={email}
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
              <span style={{ opacity: 0 }}>Send Reset Link</span>
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </Stack>

      <Typography mt={5} variant="body2" color="text.secondary" align="center" letterSpacing={0.25}>
        Remember your password? <Link href={paths.signin} sx={{ color: '#0077b6' }}>Sign In</Link>
      </Typography>
    </>
  );
};

export default ForgotPassword;