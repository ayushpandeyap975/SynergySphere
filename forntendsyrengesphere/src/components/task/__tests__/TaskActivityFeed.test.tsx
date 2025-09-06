/**
 * TaskActivityFeed Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TaskActivityFeed from '../TaskActivityFeed';
import { TaskActivity } from '../../../types/task';

const theme = createTheme();

const mockActivities: TaskActivity[] = [
  {
    id: 'activity_1',
    taskId: 'task_1',
    type: 'created',
    description: 'Task "Test Task" was created',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://example.com/avatar.jpg',
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'activity_2',
    taskId: 'task_1',
    type: 'status_changed',
    description: 'Task "Test Task" moved from To Do to In Progress',
    userId: '1',
    userName: 'John Doe',
    createdAt: '2024-12-15T11:00:00Z',
  },
  {
    id: 'activity_3',
    taskId: 'task_1',
    type: 'assigned',
    description: 'Task "Test Task" was assigned to Jane Smith',
    userId: '2',
    userName: 'Jane Smith',
    createdAt: '2024-12-15T12:00:00Z',
  },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('TaskActivityFeed', () => {
  it('renders activity feed with activities', () => {
    renderWithTheme(
      <TaskActivityFeed activities={mockActivities} />
    );

    expect(screen.getByText('Activity (3)')).toBeInTheDocument();
    expect(screen.getByText('Task "Test Task" was created')).toBeInTheDocument();
    expect(screen.getByText('Task "Test Task" moved from To Do to In Progress')).toBeInTheDocument();
    expect(screen.getByText('Task "Test Task" was assigned to Jane Smith')).toBeInTheDocument();
  });

  it('renders empty state when no activities', () => {
    renderWithTheme(
      <TaskActivityFeed activities={[]} />
    );

    expect(screen.getByText('Activity (0)')).toBeInTheDocument();
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
  });

  it('limits activities when maxItems is specified', () => {
    renderWithTheme(
      <TaskActivityFeed activities={mockActivities} maxItems={2} />
    );

    expect(screen.getByText('Activity (3)')).toBeInTheDocument();
    expect(screen.getByText('1 more activities...')).toBeInTheDocument();
  });

  it('hides header when showHeader is false', () => {
    renderWithTheme(
      <TaskActivityFeed activities={mockActivities} showHeader={false} />
    );

    expect(screen.queryByText('Activity (3)')).not.toBeInTheDocument();
    expect(screen.getByText('Task "Test Task" was created')).toBeInTheDocument();
  });

  it('displays user names and avatars', () => {
    renderWithTheme(
      <TaskActivityFeed activities={mockActivities} />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('sorts activities by creation time (newest first)', () => {
    const activities = [...mockActivities].reverse(); // Reverse to test sorting
    renderWithTheme(
      <TaskActivityFeed activities={activities} />
    );

    const activityElements = screen.getAllByText(/Task "Test Task"/);
    expect(activityElements[0]).toHaveTextContent('assigned to Jane Smith');
    expect(activityElements[1]).toHaveTextContent('moved from To Do to In Progress');
    expect(activityElements[2]).toHaveTextContent('was created');
  });
});