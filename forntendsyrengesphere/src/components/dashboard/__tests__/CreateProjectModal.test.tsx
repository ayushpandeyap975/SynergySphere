/**
 * Tests for CreateProjectModal component
 * Verifies form validation, submission handling, and user interactions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../theme';
import CreateProjectModal from '../CreateProjectModal';
import { CreateProjectData } from '../../../types';

// Mock IconifyIcon component
jest.mock('../../base/IconifyIcon', () => {
  return function MockIconifyIcon({ icon }: { icon: string }) {
    return <span data-testid={`icon-${icon}`}>{icon}</span>;
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('CreateProjectModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with all form fields', () => {
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add team member by email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  it('validates required project name field', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create project/i });
    
    // Submit button should be disabled when name is empty
    expect(submitButton).toBeDisabled();

    // Enter a name that's too short
    const nameInput = screen.getByLabelText(/project name/i);
    await user.type(nameInput, 'ab');
    
    // Try to submit
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/project name must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('validates email addresses for team members', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const emailInput = screen.getByLabelText(/add team member by email/i);
    const addButton = screen.getByRole('button', { name: '' }); // Add button

    // Enter invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('adds and removes team members correctly', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const emailInput = screen.getByLabelText(/add team member by email/i);
    const addButton = screen.getByRole('button', { name: '' }); // Add button

    // Add valid email
    await user.type(emailInput, 'test@example.com');
    await user.click(addButton);

    // Check if chip is added
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    // Remove the chip
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });
  });

  it('prevents duplicate email addresses', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const emailInput = screen.getByLabelText(/add team member by email/i);
    const addButton = screen.getByRole('button', { name: '' }); // Add button

    // Add email first time
    await user.type(emailInput, 'test@example.com');
    await user.click(addButton);

    // Try to add same email again
    await user.type(emailInput, 'test@example.com');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/this email is already added/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    // Fill in form
    await user.type(screen.getByLabelText(/project name/i), 'Test Project');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    
    // Add team member
    const emailInput = screen.getByLabelText(/add team member by email/i);
    const addButton = screen.getByRole('button', { name: '' }); // Add button
    await user.type(emailInput, 'test@example.com');
    await user.click(addButton);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Test description',
        members: ['test@example.com'],
      });
    });
  });

  it('shows loading state during submission', () => {
    renderWithTheme(<CreateProjectModal {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /create project/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to create project';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    // Fill in required field
    await user.type(screen.getByLabelText(/project name/i), 'Test Project');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets form when modal is closed and reopened', () => {
    const { rerender } = renderWithTheme(<CreateProjectModal {...defaultProps} open={false} />);
    
    // Reopen modal
    rerender(
      <ThemeProvider theme={theme}>
        <CreateProjectModal {...defaultProps} open={true} />
      </ThemeProvider>
    );

    // Form should be reset
    expect(screen.getByLabelText(/project name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/add team member by email/i)).toHaveValue('');
  });

  it('uses #0077b6 color for primary elements', () => {
    renderWithTheme(<CreateProjectModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create project/i });
    expect(submitButton).toHaveStyle('background-color: rgb(0, 119, 182)');
  });
});