/**
 * TaskActivityFeed component
 * Displays a chronological list of task activities
 */

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Create as CreateIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  SwapHoriz as SwapHorizIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { TaskActivity, TaskActivityType } from '../../types/task';
import { formatActivityTime } from '../../utils/taskActivity';

interface TaskActivityFeedProps {
  activities: TaskActivity[];
  maxItems?: number;
  showHeader?: boolean;
}

/**
 * TaskActivityFeed Component
 * Shows a chronological list of task activities with icons and descriptions
 */
const TaskActivityFeed: React.FC<TaskActivityFeedProps> = ({
  activities,
  maxItems,
  showHeader = true,
}) => {
  // Sort activities by creation time (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Limit activities if maxItems is specified
  const displayActivities = maxItems 
    ? sortedActivities.slice(0, maxItems)
    : sortedActivities;

  const getActivityIcon = (type: TaskActivityType) => {
    switch (type) {
      case 'created':
        return <CreateIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />;
      case 'status_changed':
        return <SwapHorizIcon sx={{ fontSize: '1rem', color: '#0077b6' }} />;
      case 'priority_changed':
        return <FlagIcon sx={{ fontSize: '1rem', color: '#f57c00' }} />;
      case 'assigned':
      case 'unassigned':
        return <PersonIcon sx={{ fontSize: '1rem', color: 'success.main' }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ fontSize: '1rem', color: 'success.main' }} />;
      case 'reopened':
        return <RadioButtonUncheckedIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />;
      case 'updated':
        return <EditIcon sx={{ fontSize: '1rem', color: 'info.main' }} />;
      default:
        return <EditIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />;
    }
  };

  const getActivityColor = (type: TaskActivityType): string => {
    switch (type) {
      case 'created':
        return 'primary.main';
      case 'status_changed':
        return '#0077b6';
      case 'priority_changed':
        return '#f57c00';
      case 'assigned':
      case 'unassigned':
        return 'success.main';
      case 'completed':
        return 'success.main';
      case 'reopened':
        return 'warning.main';
      case 'updated':
        return 'info.main';
      default:
        return 'text.secondary';
    }
  };

  if (displayActivities.length === 0) {
    return (
      <Box>
        {showHeader && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Activity
          </Typography>
        )}
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'grey.50',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No activity yet
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {showHeader && (
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Activity ({activities.length})
        </Typography>
      )}
      
      <Paper
        variant="outlined"
        sx={{
          maxHeight: 300,
          overflowY: 'auto',
          backgroundColor: 'grey.50',
        }}
      >
        {displayActivities.map((activity, index) => (
          <Box key={activity.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {/* Activity Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '2px solid',
                  borderColor: getActivityColor(activity.type),
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                {getActivityIcon(activity.type)}
              </Box>

              {/* Activity Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  {/* User Avatar */}
                  {activity.userName && (
                    <Avatar
                      src={activity.userAvatar}
                      sx={{
                        width: 20,
                        height: 20,
                        fontSize: '0.75rem',
                      }}
                    >
                      {activity.userName.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  
                  {/* User Name */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  >
                    {activity.userName || 'System'}
                  </Typography>

                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 'auto', flexShrink: 0 }}
                  >
                    {formatActivityTime(activity.createdAt)}
                  </Typography>
                </Box>

                {/* Activity Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                  }}
                >
                  {activity.description}
                </Typography>
              </Box>
            </Box>

            {/* Divider between activities */}
            {index < displayActivities.length - 1 && (
              <Divider sx={{ mx: 2 }} />
            )}
          </Box>
        ))}

        {/* Show more indicator */}
        {maxItems && activities.length > maxItems && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {activities.length - maxItems} more activities...
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TaskActivityFeed;