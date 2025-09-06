import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../theme';
import ProjectOverview from '../ProjectOverview';
import { Project } from '../../../types/project';

// Mock project data for testing
const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'A test project for verification',
  memberCount: 5,
  doneTasks: 12,
  totalTasks: 24,
  updatedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  members: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/40?img=2'
    }
  ]
};

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('ProjectOverview Component', () => {
  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onSettings: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders project overview section', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    expect(screen.getByText('Project Overview')).toBeInTheDocument();
  });

  test('displays project statistics correctly', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    // Check if all stat cards are present
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();

    // Check if the numbers are displayed
    expect(screen.getByText('24')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('12')).toBeInTheDocument(); // Completed tasks
  });

  test('shows progress visualization section', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    expect(screen.getByText('Project Progress')).toBeInTheDocument();
    expect(screen.getByText('Overall Completion')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument(); // 12/24 = 50%
  });

  test('displays recent activity feed', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    
    // Check for activity items (mock data)
    expect(screen.getByText(/completed task/)).toBeInTheDocument();
    expect(screen.getByText(/created new task/)).toBeInTheDocument();
  });

  test('shows settings menu button', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    const settingsButton = screen.getByLabelText('Project settings menu');
    expect(settingsButton).toBeInTheDocument();
  });

  test('displays overdue tasks alert when there are overdue tasks', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    expect(screen.getByText(/tasks are overdue/)).toBeInTheDocument();
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ProjectOverview project={mockProject} {...mockHandlers} />
      </TestWrapper>
    );

    // Check for ARIA labels
    expect(screen.getByLabelText('Project settings menu')).toBeInTheDocument();
    
    // Check for alt text on avatars
    const avatars = screen.getAllByRole('img');
    avatars.forEach(avatar => {
      expect(avatar).toHaveAttribute('alt');
    });
  });

  test('calculates progress percentage correctly', () => {
    const projectWithDifferentProgress: Project = {
      ...mockProject,
      doneTasks: 8,
      totalTasks: 20,
    };

    render(
      <TestWrapper>
        <ProjectOverview project={projectWithDifferentProgress} {...mockHandlers} />
      </TestWrapper>
    );

    // 8/20 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  test('handles zero total tasks correctly', () => {
    const projectWithNoTasks: Project = {
      ...mockProject,
      doneTasks: 0,
      totalTasks: 0,
    };

    render(
      <TestWrapper>
        <ProjectOverview project={projectWithNoTasks} {...mockHandlers} />
      </TestWrapper>
    );

    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});