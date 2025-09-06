import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  AvatarGroup,
  Avatar,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const theme = useTheme();

  // Calculate progress percentage
  const progressPercentage = project.totalTasks > 0 
    ? Math.round((project.doneTasks / project.totalTasks) * 100) 
    : 0;

  // Format last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    onClick(project.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(project.id);
    }
  };

  return (
    <Card
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open project ${project.name}`}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          borderColor: '#0077b6',
          '& .project-card-title': {
            color: '#0077b6',
          },
        },
        '&:focus': {
          outline: `2px solid #0077b6`,
          outlineOffset: '2px',
        },
        '&:active': {
          transform: 'translateY(0px) scale(0.98)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Project Header */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h3"
            className="project-card-title"
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.2s ease-in-out',
            }}
          >
            {project.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.5em',
              lineHeight: 1.25,
            }}
          >
            {project.description || 'No description provided'}
          </Typography>
        </Box>

        {/* Progress Section */}
        <Box sx={{ mb: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Progress
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {project.doneTasks}/{project.totalTasks} tasks
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.neutral.lighter,
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: progressPercentage === 100 
                  ? theme.palette.success.main 
                  : '#0077b6',
              },
            }}
          />
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            {progressPercentage}% complete
          </Typography>
        </Box>

        {/* Footer Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          {/* Team Members */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup 
              max={3} 
              sx={{ 
                '& .MuiAvatar-root': { 
                  width: 24, 
                  height: 24, 
                  fontSize: '0.75rem',
                  border: `2px solid ${theme.palette.background.paper}`,
                } 
              }}
            >
              {project.members?.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  alt={member.name}
                  src={member.avatar}
                  sx={{ 
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </Avatar>
              )) || (
                // Fallback when no members data is available
                Array.from({ length: Math.min(project.memberCount, 3) }, (_, index) => (
                  <Avatar
                    key={index}
                    sx={{ 
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </Avatar>
                ))
              )}
            </AvatarGroup>
            
            {project.memberCount > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{project.memberCount - 3}
              </Typography>
            )}
          </Box>

          {/* Last Updated */}
          <Chip
            label={formatDate(project.updatedAt)}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.6875rem',
              height: 20,
              borderColor: theme.palette.neutral.light,
              color: theme.palette.text.secondary,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;