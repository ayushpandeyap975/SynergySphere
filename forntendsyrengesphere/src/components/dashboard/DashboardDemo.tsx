import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { ProjectCard } from './ProjectCard';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';
import { ProjectsEmptyState, SearchEmptyState } from './EmptyState';
import { Project } from '../../types';

// Mock project data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'SynergySphere Mobile App',
    description: 'A comprehensive mobile application for project management and team collaboration with real-time updates.',
    memberCount: 5,
    doneTasks: 12,
    totalTasks: 20,
    updatedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T09:00:00Z',
    members: [
      { id: '1', email: 'john@example.com', name: 'John Doe', role: 'owner' },
      { id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'admin' },
      { id: '3', email: 'bob@example.com', name: 'Bob Johnson', role: 'member' },
    ],
  },
  {
    id: '2',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design principles and improved user experience.',
    memberCount: 3,
    doneTasks: 8,
    totalTasks: 15,
    updatedAt: '2024-01-14T14:20:00Z',
    createdAt: '2024-01-05T11:00:00Z',
    members: [
      { id: '4', email: 'alice@example.com', name: 'Alice Brown', role: 'owner' },
      { id: '5', email: 'charlie@example.com', name: 'Charlie Wilson', role: 'member' },
    ],
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integration with third-party APIs for enhanced functionality.',
    memberCount: 2,
    doneTasks: 5,
    totalTasks: 5,
    updatedAt: '2024-01-13T16:45:00Z',
    createdAt: '2024-01-10T08:30:00Z',
    members: [
      { id: '6', email: 'david@example.com', name: 'David Lee', role: 'owner' },
    ],
  },
];

type DemoState = 'projects' | 'loading' | 'empty' | 'search-empty';

export const DashboardDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>('projects');

  const handleProjectClick = (projectId: string) => {
    console.log('Project clicked:', projectId);
    alert(`Navigating to project: ${projectId}`);
  };

  const handleCreateProject = () => {
    console.log('Create project clicked');
    alert('Create project modal would open here');
  };

  const renderContent = () => {
    switch (demoState) {
      case 'loading':
        return (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <ProjectCardSkeleton />
              </Grid>
            ))}
          </Grid>
        );

      case 'empty':
        return <ProjectsEmptyState onCreateProject={handleCreateProject} />;

      case 'search-empty':
        return <SearchEmptyState searchQuery="nonexistent project" />;

      case 'projects':
      default:
        return (
          <Grid container spacing={3}>
            {mockProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} onClick={handleProjectClick} />
              </Grid>
            ))}
          </Grid>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projects Dashboard Components Demo
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          This demo showcases the three main components built for the Projects Dashboard:
          ProjectCard, ProjectCardSkeleton, and EmptyState components.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant={demoState === 'projects' ? 'contained' : 'outlined'}
            onClick={() => setDemoState('projects')}
          >
            Show Projects
          </Button>
          <Button
            variant={demoState === 'loading' ? 'contained' : 'outlined'}
            onClick={() => setDemoState('loading')}
          >
            Loading State
          </Button>
          <Button
            variant={demoState === 'empty' ? 'contained' : 'outlined'}
            onClick={() => setDemoState('empty')}
          >
            Empty State
          </Button>
          <Button
            variant={demoState === 'search-empty' ? 'contained' : 'outlined'}
            onClick={() => setDemoState('search-empty')}
          >
            Search Empty
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ minHeight: 400 }}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default DashboardDemo;