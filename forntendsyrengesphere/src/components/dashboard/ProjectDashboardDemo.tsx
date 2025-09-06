/**
 * Complete Projects Dashboard Demo
 * Demonstrates the integration of ProjectToolbar with other dashboard components
 */

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
import { ProjectToolbar } from './ProjectToolbar';
import { useProjectSearch } from '../../hooks/useProjectSearch';
import { Project } from '../../types';

// Mock project data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform Redesign',
    description: 'Complete overhaul of the customer-facing e-commerce platform with modern UI/UX and improved performance.',
    memberCount: 8,
    doneTasks: 23,
    totalTasks: 45,
    updatedAt: '2024-12-15T10:30:00Z',
    createdAt: '2024-11-01T09:00:00Z',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms with offline capabilities.',
    memberCount: 6,
    doneTasks: 12,
    totalTasks: 28,
    updatedAt: '2024-12-14T16:45:00Z',
    createdAt: '2024-11-15T14:20:00Z',
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence and reporting.',
    memberCount: 4,
    doneTasks: 18,
    totalTasks: 22,
    updatedAt: '2024-12-13T11:15:00Z',
    createdAt: '2024-10-20T08:30:00Z',
  },
  {
    id: '4',
    name: 'API Gateway Migration',
    description: 'Migration of legacy API services to modern microservices architecture.',
    memberCount: 5,
    doneTasks: 8,
    totalTasks: 35,
    updatedAt: '2024-12-12T09:20:00Z',
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Customer Support Portal',
    description: 'Self-service customer support portal with ticketing system and knowledge base.',
    memberCount: 7,
    doneTasks: 31,
    totalTasks: 38,
    updatedAt: '2024-12-11T14:30:00Z',
    createdAt: '2024-09-15T12:00:00Z',
  },
  {
    id: '6',
    name: 'Security Audit Implementation',
    description: 'Implementation of security recommendations from recent audit including authentication improvements.',
    memberCount: 3,
    doneTasks: 5,
    totalTasks: 15,
    updatedAt: '2024-12-10T13:45:00Z',
    createdAt: '2024-12-05T09:15:00Z',
  },
];

type DemoState = 'projects' | 'loading' | 'empty';

export const ProjectDashboardDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>('projects');
  const [projects] = useState<Project[]>(mockProjects);

  // Use the search hook for filtering and sorting
  const {
    searchQuery,
    sortBy,
    filteredProjects,
    setSearchQuery,
    setSortBy,
  } = useProjectSearch(projects);

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
          <>
            <ProjectToolbar
              searchQuery=""
              onSearchChange={() => {}}
              sortBy="updated"
              onSortChange={() => {}}
              projectCount={0}
              totalProjects={0}
            />
            <Grid container spacing={3}>
              {Array.from({ length: 6 }, (_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ProjectCardSkeleton />
                </Grid>
              ))}
            </Grid>
          </>
        );

      case 'empty':
        return <ProjectsEmptyState onCreateProject={handleCreateProject} />;

      case 'projects':
      default:
        return (
          <>
            <ProjectToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              projectCount={filteredProjects.length}
              totalProjects={projects.length}
            />
            
            {filteredProjects.length === 0 && searchQuery ? (
              <SearchEmptyState searchQuery={searchQuery} />
            ) : (
              <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <ProjectCard project={project} onClick={handleProjectClick} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Projects Dashboard Demo
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          This demo showcases the complete Projects Dashboard with integrated search and filtering functionality.
          The ProjectToolbar provides real-time search with 300ms debounce, sort options, and project count display.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant={demoState === 'projects' ? 'contained' : 'outlined'}
            onClick={() => setDemoState('projects')}
          >
            Show Dashboard
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
        </Stack>

        {demoState === 'projects' && (
          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Try the search and sort features:</strong>
              <br />
              • Search for "mobile", "api", "dashboard", etc.
              <br />
              • Sort by Name (A-Z), Last Updated, or Progress
              <br />
              • Notice the project count updates as you filter
              <br />
              • Search has a 300ms debounce for better performance
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ minHeight: 400 }}>
        {renderContent()}
      </Box>
    </Container>
  );
};

export default ProjectDashboardDemo;