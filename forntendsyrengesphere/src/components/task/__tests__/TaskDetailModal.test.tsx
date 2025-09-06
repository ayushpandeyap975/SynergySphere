/**
 * TaskDetailModal Component Tests
 * Tests for task detail modal functionality including viewing, editing, deletion, and status changes
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme } from '@mui/material/styles';
import TaskDetailModal from '../TaskDetailModal';
import { Task, TaskStatus } from '../../../types/task';
import { ProjectMember } from '../../../types/project';

// Mock the IconifyIcon component
jest.mock('../../base/IconifyIcon', () => {
  return function MockIconifyIcon({ icon }: { icon: string }) {
    return <span data-testid={`icon-${icon}`}>{icon}</span>;
  };
});

const theme = createTheme();

const mockTask: Task = {
  id: 'task-1',
  title: 'Test Task',
  description: 'This is a test task description',
  status: 'todo',
  priority: 'high',
  assigneeId: 'user-1',
  assigneeName: 'John Doe',
  assigneeAvatar: 'https://example.com/avatar.jpg',
  dueDate: '2024-12-25',
  createdAt: '2024-12-15T10:00:00Z',
  updatedAt: '2024-12-15T10:00:00Z',
  projectId: 'project-1',
};

const mockProjectMembers: ProjectMember[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar1.jpg',
    role: 'member',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar2.jpg',
    role: 'admin',
  },
];

const defaultProps = {
  open: true,
  task: mockTask,
  onClose: jest.fn(),
  onUpdate: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
  projectMembers: mockProjectMembers,
  loading: false,
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {ui}
      </LocalizationProvider>
    </ThemeProvider>
  );
};

describe('TaskDetailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('renders task details correctly', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      expect(screen.getByText('Task Details')).toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('This is a test task description')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });

    it('shows unassigned when no assignee', () => {
      const taskWithoutAssignee = { ...mockTask, assigneeId: undefined, assigneeName: undefined };
      renderWithProviders(
        <TaskDetailModal {...defaultProps} task={taskWithoutAssignee} />
      );

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('shows no description when description is empty', () => {
      const taskWithoutDescription = { ...mockTask, description: undefined };
      renderWithProviders(
        <TaskDetailModal {...defaultProps} task={taskWithoutDescription} />
      );

      expect(screen.getByText('No description provided')).toBeInTheDocument();
    });

    it('displays due date correctly', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      expect(screen.getByText(/Dec 25, 2024/)).toBeInTheDocument();
    });

    it('shows no due date when not set', () => {
      const taskWithoutDueDate = { ...mockTask, dueDate: undefined };
      renderWithProviders(
        <TaskDetailModal {...defaultProps} task={taskWithoutDueDate} />
      );

      expect(screen.getByText('No due date')).toBeInTheDocument();
    });
  });

  describe('Status Change', () => {
    it('calls onStatusChange when status is changed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Find and click the status select
      const statusSelect = screen.getByDisplayValue('To Do');
      await user.click(statusSelect);

      // Select "In Progress"
      const inProgressOption = screen.getByText('In Progress');
      await user.click(inProgressOption);

      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('task-1', 'in_progress');
    });

    it('disables status change when loading', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} loading={true} />);

      const statusSelect = screen.getByDisplayValue('To Do');
      expect(statusSelect).toBeDisabled();
    });
  });

  describe('Edit Mode', () => {
    it('enters edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('This is a test task description')).toBeInTheDocument();
    });

    it('cancels edit mode when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Cancel edit
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.getByText('Task Details')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Test Task')).not.toBeInTheDocument();
    });

    it('validates required fields in edit mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Clear the title
      const titleInput = screen.getByDisplayValue('Test Task');
      await user.clear(titleInput);

      // Try to save
      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toBeDisabled();
    });

    it('calls onUpdate when save is clicked with valid data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Modify the title
      const titleInput = screen.getByDisplayValue('Test Task');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task Title');

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.onUpdate).toHaveBeenCalledWith('task-1', expect.objectContaining({
          title: 'Updated Task Title',
        }));
      });
    });

    it('shows validation error for short title', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Set a short title
      const titleInput = screen.getByDisplayValue('Test Task');
      await user.clear(titleInput);
      await user.type(titleInput, 'AB');

      // Try to save
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(screen.getByText('Task title must be at least 3 characters')).toBeInTheDocument();
    });
  });

  describe('Delete Functionality', () => {
    it('shows delete confirmation when delete is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      const deleteButton = screen.getByText('Delete Task');
      await user.click(deleteButton);

      expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('cancels delete when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Click delete
      const deleteButton = screen.getByText('Delete Task');
      await user.click(deleteButton);

      // Cancel delete
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Are you sure you want to delete this task?')).not.toBeInTheDocument();
    });

    it('calls onDelete when delete is confirmed', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Click delete
      const deleteButton = screen.getByText('Delete Task');
      await user.click(deleteButton);

      // Confirm delete
      const confirmButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(confirmButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith('task-1');
    });
  });

  describe('Modal Behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('does not render when task is null', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} task={null} />);

      expect(screen.queryByText('Task Details')).not.toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} open={false} />);

      expect(screen.queryByText('Task Details')).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state for update', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} loading={true} />);

      // All action buttons should be disabled when loading
      expect(screen.getByText('Edit Task')).toBeDisabled();
      expect(screen.getByText('Delete Task')).toBeDisabled();
      expect(screen.getByText('Close')).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when provided', async () => {
      const user = userEvent.setup();
      const mockOnUpdateWithError = jest.fn().mockRejectedValue(new Error('Update failed'));
      
      renderWithProviders(
        <TaskDetailModal {...defaultProps} onUpdate={mockOnUpdateWithError} />
      );

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Try to save
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument();
      });
    });
  });

  describe('Assignee Selection', () => {
    it('shows assignee options in edit mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Click on assignee field
      const assigneeInput = screen.getByPlaceholderText('Search team members...');
      await user.click(assigneeInput);

      // Should show project members
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  describe('Priority Display', () => {
    it('displays priority with correct color', () => {
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      const priorityChip = screen.getByText('High Priority');
      expect(priorityChip).toBeInTheDocument();
      
      // Check if the chip has the correct styling (this would depend on your theme)
      const chipElement = priorityChip.closest('.MuiChip-root');
      expect(chipElement).toHaveStyle({ backgroundColor: '#0077b6' });
    });

    it('allows priority change in edit mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<TaskDetailModal {...defaultProps} />);

      // Enter edit mode
      const editButton = screen.getByText('Edit Task');
      await user.click(editButton);

      // Find priority select
      const prioritySelect = screen.getByDisplayValue('High');
      await user.click(prioritySelect);

      // Select medium priority
      const mediumOption = screen.getByText('Medium');
      await user.click(mediumOption);

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(defaultProps.onUpdate).toHaveBeenCalledWith('task-1', expect.objectContaining({
          priority: 'medium',
        }));
      });
    });
  });
});