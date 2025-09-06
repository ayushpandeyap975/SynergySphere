import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ResetPassword from '../ResetPassword';

const theme = createTheme();

// Mock useSearchParams
const mockSearchParams = new URLSearchParams();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockSearchParams],
  useNavigate: () => jest.fn(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ResetPassword', () => {
  beforeEach(() => {
    mockSearchParams.set('token', 'valid-token');
  });

  test('renders reset password form with valid token', async () => {
    renderWithProviders(<ResetPassword />);
    
    await waitFor(() => {
      expect(screen.getByText('Reset Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
    });
  });

  test('validates password requirements', async () => {
    renderWithProviders(<ResetPassword />);
    
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('validates password confirmation', async () => {
    renderWithProviders(<ResetPassword />);
    
    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('New Password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /reset password/i });
      
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('shows invalid token message when no token provided', async () => {
    mockSearchParams.delete('token');
    renderWithProviders(<ResetPassword />);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
    });
  });
});