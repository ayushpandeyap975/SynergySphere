import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { Task, TaskPriority, TaskStatus } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onAssign?: (taskId: string, assigneeId?: string) => void;
  onPriorityChange?: (taskId: string, priority: TaskPriority) => void;
  onComplete?: (taskId: string) => void;
  onClick?: (taskId: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  projectMembers?: Array<{ id: string; name: string; avatar?: string }>;
}

/**
 * TaskCard Component
 * Displays individual task information in a compact card format
 * with priority indicators, assignee info, and quick actions
 */
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onAssign,
  onPriorityChange,
  onComplete,
  onClick,
  draggable = false,
  onDragStart,
  projectMembers = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [assignMenuAnchor, setAssignMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const assignMenuOpen = Boolean(assignMenuAnchor);
  const priorityMenuOpen = Boolean(priorityMenuAnchor);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAssignMenuClose = () => {
    setAssignMenuAnchor(null);
  };

  const handlePriorityMenuClose = () => {
    setPriorityMenuAnchor(null);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(task.id);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(task.id);
    }
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleAssign = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleMenuClose();
    setAssignMenuAnchor(event.currentTarget);
  };

  const handleAssignToMember = (assigneeId?: string) => {
    handleAssignMenuClose();
    if (onAssign) {
      onAssign(task.id, assigneeId);
    }
  };

  const handlePriorityChange = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    handleMenuClose();
    setPriorityMenuAnchor(event.currentTarget);
  };

  const handlePrioritySelect = (priority: TaskPriority) => {
    handlePriorityMenuClose();
    if (onPriorityChange) {
      onPriorityChange(task.id, priority);
    }
  };

  const handleComplete = () => {
    handleMenuClose();
    if (onComplete) {
      onComplete(task.id);
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case 'high':
        return '#0077b6';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'todo':
        return '#757575';
      case 'in_progress':
        return '#0077b6';
      case 'done':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isOverdue = (dateString?: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getTime() < now.getTime();
  };

  return (
    <Card
      draggable={draggable}
      onDragStart={draggable && onDragStart ? (e) => onDragStart(e, task) : undefined}
      onClick={handleCardClick}
      sx={{
        cursor: onClick ? 'pointer' : draggable ? 'grab' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          '& .task-actions': {
            opacity: 1,
          },
        },
        '&:active': {
          cursor: draggable ? 'grabbing' : 'pointer',
        },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Task Header with Priority and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Priority Badge */}
            <Chip
              icon={<FlagIcon sx={{ fontSize: '0.75rem' }} />}
              label={getPriorityLabel(task.priority)}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 20,
                '& .MuiChip-label': {
                  px: 1
                },
                '& .MuiChip-icon': {
                  color: 'white',
                  marginLeft: 0.5,
                  marginRight: -0.5
                }
              }}
            />
            
            {/* Status Indicator */}
            <Tooltip title={getStatusLabel(task.status)}>
              <CircleIcon
                sx={{
                  fontSize: '0.75rem',
                  color: getStatusColor(task.status),
                }}
              />
            </Tooltip>
          </Box>

          {/* Quick Actions Menu */}
          <Box className="task-actions" sx={{ opacity: 0, transition: 'opacity 0.2s' }}>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: '#0077b6'
                }
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  minWidth: 120,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    gap: 1,
                  }
                }
              }}
            >
              {onEdit && (
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" />
                  Edit
                </MenuItem>
              )}
              {onComplete && (
                <MenuItem onClick={handleComplete}>
                  {task.status === 'done' ? (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  ) : (
                    <CheckCircleIcon fontSize="small" />
                  )}
                  {task.status === 'done' ? 'Mark Incomplete' : 'Mark Complete'}
                </MenuItem>
              )}
              {onAssign && (
                <MenuItem onClick={handleAssign}>
                  <PersonIcon fontSize="small" />
                  Assign
                  <KeyboardArrowRightIcon fontSize="small" sx={{ ml: 'auto' }} />
                </MenuItem>
              )}
              {onPriorityChange && (
                <MenuItem onClick={handlePriorityChange}>
                  <FlagIcon fontSize="small" />
                  Priority
                  <KeyboardArrowRightIcon fontSize="small" sx={{ ml: 'auto' }} />
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" />
                  Delete
                </MenuItem>
              )}
            </Menu>

            {/* Assignment Submenu */}
            <Menu
              anchorEl={assignMenuAnchor}
              open={assignMenuOpen}
              onClose={handleAssignMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  minWidth: 180,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    gap: 1,
                  }
                }
              }}
            >
              <MenuItem onClick={() => handleAssignToMember(undefined)}>
                <Avatar
                  sx={{ 
                    width: 20, 
                    height: 20,
                    fontSize: '0.75rem',
                    backgroundColor: 'grey.300',
                    color: 'grey.600'
                  }}
                >
                  ?
                </Avatar>
                Unassigned
              </MenuItem>
              {projectMembers.map((member) => (
                <MenuItem key={member.id} onClick={() => handleAssignToMember(member.id)}>
                  <Avatar
                    src={member.avatar}
                    sx={{ 
                      width: 20, 
                      height: 20,
                      fontSize: '0.75rem'
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {member.name}
                </MenuItem>
              ))}
            </Menu>

            {/* Priority Submenu */}
            <Menu
              anchorEl={priorityMenuAnchor}
              open={priorityMenuOpen}
              onClose={handlePriorityMenuClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                sx: {
                  minWidth: 140,
                  '& .MuiMenuItem-root': {
                    fontSize: '0.875rem',
                    gap: 1,
                  }
                }
              }}
            >
              <MenuItem onClick={() => handlePrioritySelect('low')}>
                <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('low') }} />
                Low
              </MenuItem>
              <MenuItem onClick={() => handlePrioritySelect('medium')}>
                <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('medium') }} />
                Medium
              </MenuItem>
              <MenuItem onClick={() => handlePrioritySelect('high')}>
                <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('high') }} />
                High
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Task Title */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.title}
        </Typography>

        {/* Task Description (optional, truncated) */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8rem',
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Task Footer with Assignee and Due Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          {/* Assignee */}
          {task.assigneeName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={task.assigneeAvatar}
                sx={{ 
                  width: 24, 
                  height: 24,
                  fontSize: '0.75rem'
                }}
              >
                {task.assigneeName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: '0.75rem',
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {task.assigneeName}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{ 
                  width: 24, 
                  height: 24,
                  fontSize: '0.75rem',
                  backgroundColor: 'grey.300',
                  color: 'grey.600'
                }}
              >
                ?
              </Avatar>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                Unassigned
              </Typography>
            </Box>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon 
                sx={{ 
                  fontSize: '0.875rem', 
                  color: isOverdue(task.dueDate) ? 'error.main' : 'text.secondary'
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.75rem',
                  color: isOverdue(task.dueDate) ? 'error.main' : 'text.secondary',
                  fontWeight: isOverdue(task.dueDate) ? 600 : 400,
                }}
              >
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;