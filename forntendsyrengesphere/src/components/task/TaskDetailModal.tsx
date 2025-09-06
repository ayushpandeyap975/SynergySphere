/**
 * TaskDetailModal component
 * Modal for viewing and editing task details with comprehensive functionality
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  SelectChangeEvent,
  Autocomplete,
  Divider,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

import { Task, TaskPriority, TaskStatus, TaskActivity } from '../../types/task';
import { ProjectMember } from '../../types/project';
import TaskActivityFeed from './TaskActivityFeed';

export interface TaskDetailModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  projectMembers?: ProjectMember[];
  activities?: TaskActivity[];
  loading?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: string;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  open,
  task,
  onClose,
  onUpdate,
  onDelete,
  onStatusChange,
  projectMembers = [],
  activities = [],
}) => {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state for editing
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    update: boolean;
    delete: boolean;
    statusChange: boolean;
  }>({
    update: false,
    delete: false,
    statusChange: false,
  });

  // Initialize edit data when task changes
  useEffect(() => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate || '',
        status: task.status,
      });
      setSelectedDate(task.dueDate ? dayjs(task.dueDate) : null);
    }
  }, [task]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setErrors({});
      setSubmitError(null);
      setActionLoading({ update: false, delete: false, statusChange: false });
    }
  }, [open]);

  // Validation functions
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate title (required, 3-100 characters)
    if (!editData.title?.trim()) {
      newErrors.title = 'Task title is required';
    } else if (editData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (editData.title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    // Validate description (optional, max 1000 characters)
    if (editData.description && editData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Validate due date (optional, but if provided, must be in the future for new tasks)
    if (editData.dueDate) {
      const dueDate = dayjs(editData.dueDate);
      const today = dayjs().startOf('day');
      if (dueDate.isBefore(today) && task?.status !== 'done') {
        // Allow past dates for completed tasks
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Validate assignee (optional, but if provided, must be valid member)
    if (editData.assigneeId && !projectMembers.find(member => member.id === editData.assigneeId)) {
      newErrors.assigneeId = 'Selected assignee is not a valid project member';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [editData, projectMembers, task]);

  // Helper functions
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
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Unknown Priority';
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



  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dateString?: string): boolean => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getTime() < now.getTime();
  };

  // Event handlers
  const handleInputChange = useCallback((field: keyof Task) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setEditData(prev => ({ ...prev, [field]: value }));
      
      // Clear field-specific error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      
      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }
    }, [errors, submitError]);

  const handleSelectChange = useCallback((field: keyof Task) => 
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setEditData(prev => ({ ...prev, [field]: value }));
      
      // Clear field-specific error
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      
      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }
    }, [errors, submitError]);

  const handleDateChange = useCallback((date: Dayjs | null) => {
    setSelectedDate(date);
    const dateString = date ? date.format('YYYY-MM-DD') : '';
    setEditData(prev => ({ ...prev, dueDate: dateString }));
    
    // Clear date error
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: undefined }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
  }, [errors.dueDate, submitError]);

  const handleEdit = () => {
    setIsEditing(true);
    setSubmitError(null);
  };

  const handleCancelEdit = () => {
    if (task) {
      setEditData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate || '',
        status: task.status,
      });
      setSelectedDate(task.dueDate ? dayjs(task.dueDate) : null);
    }
    setIsEditing(false);
    setErrors({});
    setSubmitError(null);
  };

  const handleSave = async () => {
    if (!task || !validateForm()) {
      return;
    }

    setActionLoading(prev => ({ ...prev, update: true }));
    try {
      setSubmitError(null);
      
      // Find assignee details if assigneeId is provided
      const assignee = editData.assigneeId 
        ? projectMembers.find(member => member.id === editData.assigneeId)
        : undefined;
      
      // Prepare updates
      const updates: Partial<Task> = {
        title: editData.title?.trim(),
        description: editData.description?.trim() || undefined,
        priority: editData.priority,
        assigneeId: assignee?.id,
        assigneeName: assignee?.name,
        assigneeAvatar: assignee?.avatar,
        dueDate: editData.dueDate || undefined,
        updatedAt: new Date().toISOString(),
      };
      
      await onUpdate(task.id, updates);
      setIsEditing(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setActionLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task || task.status === newStatus) return;

    setActionLoading(prev => ({ ...prev, statusChange: true }));
    try {
      setSubmitError(null);
      await onStatusChange(task.id, newStatus);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update task status');
    } finally {
      setActionLoading(prev => ({ ...prev, statusChange: false }));
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirm = async () => {
    if (!task) return;

    setActionLoading(prev => ({ ...prev, delete: true }));
    try {
      setSubmitError(null);
      await onDelete(task.id);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to delete task');
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleClose = useCallback(() => {
    if (!actionLoading.update && !actionLoading.delete && !actionLoading.statusChange) {
      onClose();
    }
  }, [actionLoading, onClose]);

  if (!task) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" component="h2">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={actionLoading.update || actionLoading.delete || actionLoading.statusChange}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: '#0077b6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Task Status and Priority Header */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Status Selector */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                label="Status"
                disabled={actionLoading.statusChange || isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0077b6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0077b6',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0077b6',
                  },
                }}
              >
                <MenuItem value="todo">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircleIcon sx={{ fontSize: '0.75rem', color: getStatusColor('todo') }} />
                    To Do
                  </Box>
                </MenuItem>
                <MenuItem value="in_progress">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircleIcon sx={{ fontSize: '0.75rem', color: getStatusColor('in_progress') }} />
                    In Progress
                  </Box>
                </MenuItem>
                <MenuItem value="done">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircleIcon sx={{ fontSize: '0.75rem', color: getStatusColor('done') }} />
                    Done
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Priority Display/Edit */}
            {isEditing ? (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editData.priority || 'medium'}
                  onChange={handleSelectChange('priority')}
                  label="Priority"
                  disabled={actionLoading.update}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0077b6',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0077b6',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#0077b6',
                    },
                  }}
                >
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('low') }} />
                      Low
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('medium') }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon sx={{ fontSize: '0.75rem', color: getPriorityColor('high') }} />
                      High
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Chip
                icon={<FlagIcon sx={{ fontSize: '0.75rem' }} />}
                label={getPriorityLabel(task.priority)}
                sx={{
                  backgroundColor: getPriorityColor(task.priority),
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}

            {/* Loading indicator for status change */}
            {actionLoading.statusChange && (
              <CircularProgress size={20} />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Task Title */}
          {isEditing ? (
            <TextField
              label="Task Title"
              value={editData.title || ''}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              disabled={actionLoading.update}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0077b6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0077b6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0077b6',
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </Typography>
          )}

          {/* Task Description */}
          {isEditing ? (
            <TextField
              label="Description"
              value={editData.description || ''}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Provide detailed information about the task'}
              fullWidth
              multiline
              rows={4}
              disabled={actionLoading.update}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0077b6',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0077b6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0077b6',
                },
              }}
            />
          ) : (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minHeight: 100,
                  backgroundColor: 'grey.50',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.5,
                  }}
                >
                  {task.description || 'No description provided'}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Assignee and Due Date Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* Assignee */}
            {isEditing ? (
              <Autocomplete
                fullWidth
                options={[{ id: '', name: 'Unassigned', email: '', role: 'member' as const }, ...projectMembers]}
                getOptionLabel={(option) => option.name}
                value={projectMembers.find(member => member.id === editData.assigneeId) || { id: '', name: 'Unassigned', email: '', role: 'member' as const }}
                onChange={(_, newValue) => {
                  const assigneeId = newValue?.id || '';
                  setEditData(prev => ({ ...prev, assigneeId }));
                  
                  // Clear field-specific error
                  if (errors.assigneeId) {
                    setErrors(prev => ({ ...prev, assigneeId: undefined }));
                  }
                  
                  // Clear submit error
                  if (submitError) {
                    setSubmitError(null);
                  }
                }}
                disabled={actionLoading.update}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assignee"
                    placeholder="Search team members..."
                    error={!!errors.assigneeId}
                    helperText={errors.assigneeId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#0077b6',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#0077b6',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#0077b6',
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                    <Avatar
                      src={option.avatar}
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.875rem',
                        backgroundColor: option.id ? 'primary.main' : 'grey.300',
                        color: option.id ? 'white' : 'grey.600'
                      }}
                    >
                      {option.id ? option.name.charAt(0).toUpperCase() : '?'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: option.id ? 'normal' : 'italic' }}>
                        {option.name}
                      </Typography>
                      {option.email && (
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            ) : (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Assignee
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={task.assigneeAvatar}
                    sx={{ 
                      width: 32, 
                      height: 32,
                      fontSize: '0.875rem',
                      backgroundColor: task.assigneeName ? 'primary.main' : 'grey.300',
                      color: task.assigneeName ? 'white' : 'grey.600'
                    }}
                  >
                    {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                  <Typography variant="body2">
                    {task.assigneeName || 'Unassigned'}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Due Date */}
            {isEditing ? (
              <DatePicker
                label="Due Date"
                value={selectedDate}
                onChange={handleDateChange}
                disabled={actionLoading.update}
                minDate={task.status !== 'done' ? dayjs() : undefined}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0077b6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0077b6',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0077b6',
                  },
                }}
                slotProps={{
                  textField: {
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                  },
                }}
              />
            ) : (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Due Date
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon 
                    sx={{ 
                      fontSize: '1rem', 
                      color: isOverdue(task.dueDate) ? 'error.main' : 'text.secondary'
                    }} 
                  />
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: isOverdue(task.dueDate) ? 'error.main' : 'text.primary',
                      fontWeight: isOverdue(task.dueDate) ? 600 : 400,
                    }}
                  >
                    {formatDate(task.dueDate)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Task Metadata */}
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Created
              </Typography>
              <Typography variant="body2">
                {new Date(task.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date(task.updatedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>

          {/* Task Activity Feed */}
          <Divider sx={{ my: 3 }} />
          <TaskActivityFeed activities={activities} maxItems={5} />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          {showDeleteConfirm ? (
            <>
              <Typography variant="body2" color="error" sx={{ flex: 1 }}>
                Are you sure you want to delete this task?
              </Typography>
              <Button
                onClick={handleDeleteCancel}
                disabled={actionLoading.delete}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                disabled={actionLoading.delete}
                color="error"
                variant="contained"
                sx={{ minWidth: 100 }}
              >
                {actionLoading.delete ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Delete'
                )}
              </Button>
            </>
          ) : isEditing ? (
            <>
              <Button
                onClick={handleCancelEdit}
                disabled={actionLoading.update}
                sx={{ color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={actionLoading.update || !editData.title?.trim()}
                variant="contained"
                startIcon={actionLoading.update ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                sx={{
                  backgroundColor: '#0077b6',
                  color: 'white',
                  minWidth: 120,
                  '&:hover': {
                    backgroundColor: '#005a8a',
                  },
                }}
              >
                {actionLoading.update ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleDeleteClick}
                disabled={actionLoading.update || actionLoading.delete || actionLoading.statusChange}
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ mr: 'auto' }}
              >
                Delete Task
              </Button>
              <Button
                onClick={handleClose}
                disabled={actionLoading.update || actionLoading.delete || actionLoading.statusChange}
                sx={{ color: 'text.secondary' }}
              >
                Close
              </Button>
              <Button
                onClick={handleEdit}
                disabled={actionLoading.update || actionLoading.delete || actionLoading.statusChange}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{
                  backgroundColor: '#0077b6',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#005a8a',
                  },
                }}
              >
                Edit Task
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskDetailModal;