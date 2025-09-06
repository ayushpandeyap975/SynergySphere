import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Avatar,
  AvatarGroup,
  Chip,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Project, ProjectMember } from '../types/project';
import ProjectOverview from '../components/project/ProjectOverview';
import ProjectMembers from '../components/project/ProjectMembers';
import TaskBoard from '../components/task/TaskBoard';

/**
 * Project Detail Page Component
 * Displays detailed information about a specific project including header,
 * breadcrumb navigation, and project overview
 */
const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - replace with actual API call
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock project data
        const mockProject: Project = {
          id: id || '1',
          name: 'SynergySphere Dashboard',
          description: 'A comprehensive project management dashboard for team collaboration and task tracking. This project includes user authentication, project management, task boards, and team collaboration features.',
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
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike@example.com',
              role: 'member',
              avatar: 'https://i.pravatar.cc/40?img=3'
            },
            {
              id: '4',
              name: 'Sarah Wilson',
              email: 'sarah@example.com',
              role: 'member',
              avatar: 'https://i.pravatar.cc/40?img=4'
            },
            {
              id: '5',
              name: 'Tom Brown',
              email: 'tom@example.com',
              role: 'member',
              avatar: 'https://i.pravatar.cc/40?img=5'
            }
          ]
        };
        
        setProject(mockProject);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate('/projects');
  };

  const handleEditClick = () => {
    // TODO: Implement edit functionality
    console.log('Edit project clicked');
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings functionality
    console.log('Project settings clicked');
  };

  const handleDeleteProject = () => {
    // TODO: Implement delete functionality
    console.log('Delete project clicked');
  };

  const handleInviteMember = async (email: string, role: ProjectMember['role']) => {
    try {
      // TODO: Replace with actual API call
      console.log('Inviting member:', email, 'with role:', role);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock adding the new member
      const newMember: ProjectMember = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use email prefix as name for demo
        email,
        role,
        avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      };
      
      if (project) {
        const updatedProject = {
          ...project,
          members: [...(project.members || []), newMember],
          memberCount: (project.members?.length || 0) + 1,
        };
        setProject(updatedProject);
      }
    } catch (error) {
      throw new Error('Failed to invite member. Please try again.');
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: ProjectMember['role']) => {
    try {
      // TODO: Replace with actual API call
      console.log('Updating member role:', memberId, 'to:', role);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (project && project.members) {
        const updatedMembers = project.members.map(member =>
          member.id === memberId ? { ...member, role } : member
        );
        
        const updatedProject = {
          ...project,
          members: updatedMembers,
        };
        setProject(updatedProject);
      }
    } catch (error) {
      throw new Error('Failed to update member role. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('Removing member:', memberId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (project && project.members) {
        const updatedMembers = project.members.filter(member => member.id !== memberId);
        
        const updatedProject = {
          ...project,
          members: updatedMembers,
          memberCount: updatedMembers.length,
        };
        setProject(updatedProject);
      }
    } catch (error) {
      throw new Error('Failed to remove member. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Breadcrumb skeleton */}
        <Skeleton variant="text" width={300} height={24} sx={{ mb: 2 }} />
        
        {/* Header skeleton */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width={400} height={40} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Skeleton variant="rectangular" width={120} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Link
          component="button"
          onClick={handleBackClick}
          sx={{ color: '#0077b6', textDecoration: 'none' }}
        >
          ← Back to Projects
        </Link>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Project not found
        </Alert>
        <Link
          component="button"
          onClick={handleBackClick}
          sx={{ color: '#0077b6', textDecoration: 'none' }}
        >
          ← Back to Projects
        </Link>
      </Box>
    );
  }

  const progressPercentage = project.totalTasks > 0 
    ? Math.round((project.doneTasks / project.totalTasks) * 100) 
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ mb: 3 }}
        separator="›"
      >
        <Link
          component="button"
          onClick={handleBackClick}
          sx={{ 
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: '#0077b6',
              textDecoration: 'underline'
            }
          }}
        >
          Projects
        </Link>
        <Typography 
          color="#0077b6" 
          fontWeight="medium"
          sx={{ cursor: 'default' }}
        >
          {project.name}
        </Typography>
      </Breadcrumbs>

      {/* Project Header */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3, 
          mb: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Header Top Row */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between',
          mb: 2 
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
                lineHeight: 1.2
              }}
            >
              {project.name}
            </Typography>
            
            {/* Status Indicator */}
            <Chip
              label="Active"
              size="small"
              sx={{
                backgroundColor: '#0077b6',
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-label': {
                  px: 1.5
                }
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            <IconButton
              onClick={handleEditClick}
              sx={{
                color: '#0077b6',
                backgroundColor: 'rgba(0, 119, 182, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 119, 182, 0.12)',
                }
              }}
              aria-label="Edit project"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                color: '#0077b6',
                backgroundColor: 'rgba(0, 119, 182, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 119, 182, 0.12)',
                }
              }}
              aria-label="Project settings"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Project Description */}
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            mb: 3,
            lineHeight: 1.6,
            maxWidth: '80%'
          }}
        >
          {project.description}
        </Typography>

        {/* Project Stats and Members */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3,
          flexWrap: 'wrap'
        }}>
          {/* Progress Stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Progress:
            </Typography>
            <Chip
              label={`${progressPercentage}% (${project.doneTasks}/${project.totalTasks})`}
              size="small"
              sx={{
                backgroundColor: progressPercentage > 50 ? '#e8f5e8' : '#fff3e0',
                color: progressPercentage > 50 ? '#2e7d32' : '#f57c00',
                fontWeight: 500
              }}
            />
          </Box>

          {/* Team Members */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Team:
            </Typography>
            <AvatarGroup 
              max={4}
              sx={{
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  fontSize: '0.875rem',
                  border: '2px solid white',
                },
                '& .MuiAvatarGroup-avatar': {
                  backgroundColor: '#0077b6',
                  color: 'white',
                  fontWeight: 500
                }
              }}
            >
              {project.members?.map((member) => (
                <Avatar
                  key={member.id}
                  alt={member.name}
                  src={member.avatar}
                  title={`${member.name} (${member.role})`}
                >
                  {member.name.charAt(0).toUpperCase()}
                </Avatar>
              ))}
            </AvatarGroup>
            <Typography variant="body2" color="text.secondary">
              {project.memberCount} members
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Project Overview Section */}
      <ProjectOverview
        project={project}
        onEdit={handleEditClick}
        onDelete={handleDeleteProject}
        onSettings={handleSettingsClick}
      />

      {/* Project Members Section */}
      <Box sx={{ mt: 3 }}>
        <ProjectMembers
          members={project.members || []}
          currentUserId="1" // TODO: Get from auth context
          onInviteMember={handleInviteMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          onRemoveMember={handleRemoveMember}
        />
      </Box>

      {/* Task Board Section */}
      <Box sx={{ mt: 3 }}>
        <Paper 
          elevation={1}
          sx={{ 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <TaskBoard 
            projectId={project.id} 
            loading={loading}
            projectMembers={project.members || []}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ProjectDetail;