/**
 * TaskCreateModal component
 * Modal for creating new tasks with comprehensive form validation
 */

import React, { useState, useCallback } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import IconifyIcon from '../base/IconifyIcon';
import { CreateTaskData, TaskPriority } from '../../types/task';
import { ProjectMember } from '../../types/project';

export interface TaskCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskData) => Promise<void>;
  projectId: string;
  projectMembers?: ProjectMember[];
  loading?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: string;
}

const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
  projectId,
  projectMembers = [],
  loading = false,
}) => {
  // Form state
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
    projectId,
  });
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        assigneeId: '',
        dueDate: '',
        projectId,
      });
      setSelectedDate(null);
      setErrors({});
      setSubmitError(null);
    }
  }, [open, projectId]);

  // Validation functions
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate title (required, 3-100 characters)
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    // Validate description (optional, max 1000 characters)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Validate due date (optional, but if provided, must be in the future)
    if (formData.dueDate) {
      const dueDate = dayjs(formData.dueDate);
      const today = dayjs().startOf('day');
      if (dueDate.isBefore(today)) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Validate assignee (optional, but if provided, must be valid member)
    if (formData.assigneeId && !projectMembers.find(member => member.id === formData.assigneeId)) {
      newErrors.assigneeId = 'Selected assignee is not a valid project member';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, projectMembers]);

  // Event handlers
  const handleInputChange = useCallback((field: keyof CreateTaskData) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear field-specific error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      
      // Clear submit error
      if (submitError) {
        setSubmitError(null);
      }
    }, [errors, submitError]);

  const handleSelectChange = useCallback((field: keyof CreateTaskData) => 
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
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
    setFormData(prev => ({ ...prev, dueDate: dateString }));
    
    // Clear date error
    if (errors.dueDate) {
      setErrors(prev => ({ ...prev, dueDate: undefined }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
  }, [errors.dueDate, submitError]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError(null);
      
      // Clean up form data before submission
      const cleanedData: CreateTaskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        assigneeId: formData.assigneeId || undefined,
        dueDate: formData.dueDate || undefined,
      };
      
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create task');
    }
  }, [formData, validateForm, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

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
            Create New Task
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: '#0077b6',
              },
            }}
          >
            <IconifyIcon icon="hugeicons:cancel-01" />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Task Title Field */}
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              disabled={loading}
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

            {/* Task Description Field (Rich Text) */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Provide detailed information about the task'}
              fullWidth
              multiline
              rows={4}
              disabled={loading}
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

            {/* Form Row: Priority and Assignee */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {/* Priority Selector */}
              <FormControl 
                fullWidth 
                error={!!errors.priority}
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
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleSelectChange('priority')}
                  label="Priority"
                  disabled={loading}
                >
                  <MenuItem value="low">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label="Low"
                        sx={{
                          backgroundColor: getPriorityColor('low'),
                          color: 'white',
                          minWidth: 60,
                        }}
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label="Medium"
                        sx={{
                          backgroundColor: getPriorityColor('medium'),
                          color: 'white',
                          minWidth: 60,
                        }}
                      />
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label="High"
                        sx={{
                          backgroundColor: getPriorityColor('high'),
                          color: 'white',
                          minWidth: 60,
                        }}
                      />
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Assignee Selector with Search */}
              <Autocomplete
                fullWidth
                options={[{ id: '', name: 'Unassigned', email: '', role: 'member' as const }, ...projectMembers]}
                getOptionLabel={(option) => option.name}
                value={projectMembers.find(member => member.id === formData.assigneeId) || { id: '', name: 'Unassigned', email: '', role: 'member' as const }}
                onChange={(_, newValue) => {
                  const assigneeId = newValue?.id || '';
                  setFormData(prev => ({ ...prev, assigneeId }));
                  
                  // Clear field-specific error
                  if (errors.assigneeId) {
                    setErrors(prev => ({ ...prev, assigneeId: undefined }));
                  }
                  
                  // Clear submit error
                  if (submitError) {
                    setSubmitError(null);
                  }
                }}
                disabled={loading}
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
                    {option.role && option.id && (
                      <Chip
                        label={option.role}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: 20,
                          textTransform: 'capitalize'
                        }}
                      />
                    )}
                  </Box>
                )}
                filterOptions={(options, { inputValue }) => {
                  if (!inputValue) return options;
                  
                  return options.filter(option => 
                    option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.email.toLowerCase().includes(inputValue.toLowerCase())
                  );
                }}
                sx={{
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#0077b6',
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    color: '#0077b6',
                  },
                }}
              />
            </Box>

            {/* Due Date Picker */}
            <DatePicker
              label="Due Date (Optional)"
              value={selectedDate}
              onChange={handleDateChange}
              disabled={loading}
              minDate={dayjs()}
              sx={{
                width: '100%',
                mb: 2,
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

            {/* Selected Priority Display */}
            {formData.priority && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Selected Priority:
                </Typography>
                <Chip
                  label={getPriorityLabel(formData.priority)}
                  sx={{
                    backgroundColor: getPriorityColor(formData.priority),
                    color: 'white',
                    fontWeight: 500,
                  }}
                />
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.title.trim()}
              sx={{
                backgroundColor: '#0077b6',
                color: 'white',
                minWidth: 120,
                '&:hover': {
                  backgroundColor: '#005a8a',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskCreateModal;