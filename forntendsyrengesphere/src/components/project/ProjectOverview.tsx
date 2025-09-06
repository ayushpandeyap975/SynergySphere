import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,

  Menu,
  MenuItem,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Project } from '../../types/project';

interface ProjectOverviewProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
}

interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'task_created' | 'member_added' | 'project_updated';
  message: string;
  user: string;
  timestamp: string;
  avatar?: string;
}

/**
 * Project Overview Component
 * Displays project statistics, progress visualization, recent activity, and settings
 */
const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  onEdit,
  onDelete,
  onSettings,
}) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);

  // Mock project stats - in real app, this would come from API
  const stats: ProjectStats = {
    total: project.totalTasks,
    completed: project.doneTasks,
    inProgress: Math.max(0, project.totalTasks - project.doneTasks - 2), // Mock in progress
    overdue: 2, // Mock overdue tasks
  };

  // Mock recent activity - in real app, this would come from API
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'task_completed',
      message: 'completed task "Implement user authentication"',
      user: 'John Doe',
      timestamp: '2 hours ago',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: '2',
      type: 'task_created',
      message: 'created new task "Add project settings"',
      user: 'Jane Smith',
      timestamp: '4 hours ago',
      avatar: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: '3',
      type: 'member_added',
      message: 'added Mike Johnson to the project',
      user: 'John Doe',
      timestamp: '1 day ago',
      avatar: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: '4',
      type: 'project_updated',
      message: 'updated project description',
      user: 'Sarah Wilson',
      timestamp: '2 days ago',
      avatar: 'https://i.pravatar.cc/40?img=4',
    },
    {
      id: '5',
      type: 'task_completed',
      message: 'completed task "Design project dashboard"',
      user: 'Tom Brown',
      timestamp: '3 days ago',
      avatar: 'https://i.pravatar.cc/40?img=5',
    },
  ];

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsMenuAnchor(null);
  };

  const handleEditClick = () => {
    handleSettingsClose();
    onEdit?.();
  };

  const handleDeleteClick = () => {
    handleSettingsClose();
    onDelete?.();
  };

  const handleSettingsMenuClick = () => {
    handleSettingsClose();
    onSettings?.();
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircleIcon sx={{ color: '#0077b6' }} />;
      case 'task_created':
        return <AssignmentIcon sx={{ color: '#0077b6' }} />;
      case 'member_added':
        return <TrendingUpIcon sx={{ color: '#0077b6' }} />;
      case 'project_updated':
        return <EditIcon sx={{ color: '#0077b6' }} />;
      default:
        return <AssignmentIcon sx={{ color: '#0077b6' }} />;
    }
  };

  return (
    <Box>
      {/* Project Statistics */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Project Overview
        </Typography>
        
        {/* Settings Dropdown */}
        <Box>
          <IconButton
            onClick={handleSettingsClick}
            sx={{
              color: '#0077b6',
              backgroundColor: 'rgba(0, 119, 182, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(0, 119, 182, 0.12)',
              }
            }}
            aria-label="Project settings menu"
            title="Project settings menu"
          >
            <MoreVertIcon />
          </IconButton>
          
          <Menu
            anchorEl={settingsMenuAnchor}
            open={Boolean(settingsMenuAnchor)}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEditClick}>
              <EditIcon sx={{ mr: 2, color: '#0077b6' }} />
              Edit Project
            </MenuItem>
            <MenuItem onClick={handleSettingsMenuClick}>
              <SettingsIcon sx={{ mr: 2, color: '#0077b6' }} />
              Project Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 2 }} />
              Delete Project
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Total Tasks */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <AssignmentIcon sx={{ fontSize: 32, color: '#0077b6', mb: 1 }} />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Tasks */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <CheckCircleIcon sx={{ fontSize: 32, color: '#2e7d32', mb: 1 }} />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* In Progress Tasks */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <ScheduleIcon sx={{ fontSize: 32, color: '#f57c00', mb: 1 }} />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Overdue Tasks */}
            <Grid item xs={6} sm={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <WarningIcon sx={{ fontSize: 32, color: '#d32f2f', mb: 1 }} />
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stats.overdue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overdue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Progress Visualization */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Project Progress
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Completion
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0077b6' }}>
                  {progressPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 119, 182, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#0077b6',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    {stats.completed}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 600 }}>
                    {stats.inProgress}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Remaining
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {stats.total - stats.completed - stats.inProgress}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity Feed */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            
            {stats.overdue > 0 && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2,
                  '& .MuiAlert-icon': {
                    color: '#f57c00'
                  }
                }}
              >
                {stats.overdue} task{stats.overdue > 1 ? 's are' : ' is'} overdue
              </Alert>
            )}

            <List sx={{ p: 0 }}>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={activity.avatar}
                        alt={`${activity.user} avatar`}
                        title={activity.user}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          <strong>{activity.user}</strong> {activity.message}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#0077b6',
                            fontWeight: 500,
                            mt: 0.5,
                            display: 'block'
                          }}
                        >
                          {activity.timestamp}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 5 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectOverview;