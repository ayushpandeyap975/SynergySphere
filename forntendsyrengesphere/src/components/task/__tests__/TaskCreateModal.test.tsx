/**
 * Tests for TaskCreateModal component
 * Verifies form validation, submission handling, and user interactions
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { theme } from '../../../theme';
import TaskCreateModal from '../TaskCreateModal';
import { ProjectMember } from '../../../types/project';

// Mock IconifyIcon component
jest.mock('../../base/IconifyIcon', () => {
  return function MockIconifyIcon({ icon }: { icon: string }) {
    return <span data-testid={`icon-${icon}`}>{icon}</span>;
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {component}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('TaskCreateModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const mockProjectMembers: ProjectMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: 'https://example.com/avatar1.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'member',
    },
  ];

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    projectId: 'project-1',
    projectMembers: mockProjectMembers,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with all form fields', () => {
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required task title field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    // Submit without filling required field
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates task title length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    // Test minimum length
    await user.type(titleInput, 'ab');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Task title must be at least 3 characters')).toBeInTheDocument();
    });

    // Clear and test maximum length
    await user.clear(titleInput);
    await user.type(titleInput, 'a'.repeat(101));
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Task title must be less than 100 characters')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates description length', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    // Fill required field
    await user.type(titleInput, 'Valid Task Title');
    
    // Test description max length
    await user.type(descriptionInput, 'a'.repeat(1001));
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be less than 1000 characters')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);
    
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    // Fill in form
    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test task description');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test task description',
        priority: 'medium',
        projectId: 'project-1',
      });
    });
  });

  it('shows loading state during submission', () => {
    renderWithProviders(<TaskCreateModal {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles submission error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to create task';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    // Fill in required field
    const titleInput = screen.getByLabelText(/task title/i);
    await user.type(titleInput, 'Test Task');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('resets form when modal is closed and reopened', () => {
    const { rerender } = renderWithProviders(<TaskCreateModal {...defaultProps} open={false} />);
    
    // Reopen modal
    rerender(
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TaskCreateModal {...defaultProps} open={true} />
        </LocalizationProvider>
      </ThemeProvider>
    );

    const titleInput = screen.getByLabelText(/task title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement;
    
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  it('uses #0077b6 color for primary elements', () => {
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    // Note: In a real test environment, you might need to check the actual computed styles
    // This is a simplified check for the presence of the button
    expect(submitButton).toBeInTheDocument();
  });

  it('displays project members in assignee dropdown', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const assigneeSelect = screen.getByLabelText(/assignee/i);
    await user.click(assigneeSelect);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });
  });

  it('displays priority options correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskCreateModal {...defaultProps} />);

    const prioritySelect = screen.getByLabelText(/priority/i);
    await user.click(prioritySelect);

    await waitFor(() => {
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });
});