/**
 * Projects Dashboard Page
 * Main dashboard view integrating all project-related components
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Fab,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { ProjectToolbar } from '../components/dashboard/ProjectToolbar';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { ProjectCardSkeleton } from '../components/dashboard/ProjectCardSkeleton';
import { ProjectsEmptyState, SearchEmptyState } from '../components/dashboard/EmptyState';
import CreateProjectModal from '../components/dashboard/CreateProjectModal';
import { useProjectSearch } from '../hooks/useProjectSearch';
import { Project, CreateProjectData } from '../types';
import IconifyIcon from '../components/base/IconifyIcon';

// Mock data for demonstration - in real app this would come from API
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
    members: [
      { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'owner' },
      { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'admin' },
      { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'member' },
    ],
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
    members: [
      { id: '4', name: 'David Wilson', email: 'david@example.com', role: 'owner' },
      { id: '5', name: 'Eva Brown', email: 'eva@example.com', role: 'member' },
    ],
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
    members: [
      { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'owner' },
      { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'admin' },
    ],
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

const ProjectsDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Search and filtering
  const {
    searchQuery,
    sortBy,
    filteredProjects,
    setSearchQuery,
    setSortBy,
  } = useProjectSearch(projects);

  // Simulate API call to fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjects(mockProjects);
      } catch (err) {
        setError('Failed to load projects. Please try again.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Event handlers
  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    setCreateModalOpen(true);
  };

  const handleCreateProjectSubmit = async (projectData: CreateProjectData) => {
    try {
      setCreateLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new project object
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: projectData.name,
        description: projectData.description || '',
        memberCount: (projectData.members?.length || 0) + 1, // +1 for the creator
        doneTasks: 0,
        totalTasks: 0,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        members: projectData.members?.map((email, index) => ({
          id: `member-${Date.now()}-${index}`,
          email,
          name: email.split('@')[0], // Use email prefix as name for demo
          role: 'member' as const,
        })),
      };
      
      // Add to projects list
      setProjects(prev => [newProject, ...prev]);
      
      // Show success message
      setSnackbarMessage(`Project "${projectData.name}" created successfully!`);
      setSnackbarOpen(true);
      
    } catch (error) {
      throw new Error('Failed to create project. Please try again.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    // Logout is now handled by DashboardHeader component
    console.log('Logout clicked - handled by DashboardHeader');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <DashboardHeader
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogoutClick}
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <ProjectToolbar
            searchQuery=""
            onSearchChange={() => {}}
            sortBy="updated"
            onSortChange={() => {}}
            projectCount={0}
            totalProjects={0}
          />
          <Grid container spacing={3}>
            {Array.from({ length: 8 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ProjectCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <DashboardHeader
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogoutClick}
        />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Typography
                component="button"
                onClick={() => window.location.reload()}
                sx={{
                  color: '#0077b6',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontSize: 'inherit',
                }}
              >
                Retry
              </Typography>
            }
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Dashboard Header */}
      <DashboardHeader
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Project Toolbar */}
        <ProjectToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          projectCount={filteredProjects.length}
          totalProjects={projects.length}
        />

        {/* Content Area */}
        {projects.length === 0 ? (
          <ProjectsEmptyState onCreateProject={handleCreateProject} />
        ) : filteredProjects.length === 0 && searchQuery ? (
          <SearchEmptyState searchQuery={searchQuery} />
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                <ProjectCard project={project} onClick={handleProjectClick} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Create new project"
        onClick={handleCreateProject}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#0077b6',
          color: 'white',
          '&:hover': {
            bgcolor: '#005a8a',
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.2s ease-in-out',
          zIndex: theme.zIndex.fab,
        }}
      >
        <IconifyIcon icon="hugeicons:add-01" sx={{ fontSize: 24 }} />
      </Fab>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateProjectSubmit}
        loading={createLoading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Box>
  );
};

export default ProjectsDashboard;