/**
 * CreateProjectModal component
 * Modal for creating new projects with form validation and member invitation
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
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import IconifyIcon from '../base/IconifyIcon';
import { CreateProjectData } from '../../types';
import { 
  validateProjectName, 
  validateProjectDescription, 
  validateEmail 
} from '../../utils/validation';

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (projectData: CreateProjectData) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  members?: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  // Form state
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    members: [],
  });
  
  const [memberInput, setMemberInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setFormData({ name: '', description: '', members: [] });
      setMemberInput('');
      setErrors({});
      setSubmitError(null);
    }
  }, [open]);

  // Validation functions
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate project name
    const nameValidation = validateProjectName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validate description (optional)
    const descriptionValidation = validateProjectDescription(formData.description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error;
    }

    // Validate members (optional but if provided, must be valid emails)
    if (formData.members && formData.members.length > 0) {
      const invalidMembers = formData.members.filter(email => !validateEmail(email));
      if (invalidMembers.length > 0) {
        newErrors.members = `Invalid email addresses: ${invalidMembers.join(', ')}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Event handlers
  const handleInputChange = useCallback((field: keyof CreateProjectData) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleMemberInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMemberInput(event.target.value);
  }, []);

  const handleAddMember = useCallback(() => {
    const email = memberInput.trim();
    if (!email) return;

    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, members: 'Please enter a valid email address' }));
      return;
    }

    if (formData.members?.includes(email)) {
      setErrors(prev => ({ ...prev, members: 'This email is already added' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      members: [...(prev.members || []), email],
    }));
    setMemberInput('');
    
    // Clear member error
    if (errors.members) {
      setErrors(prev => ({ ...prev, members: undefined }));
    }
  }, [memberInput, formData.members, errors.members]);

  const handleMemberInputKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddMember();
    }
  }, [handleAddMember]);

  const handleRemoveMember = useCallback((emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members?.filter(email => email !== emailToRemove) || [],
    }));
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create project');
    }
  }, [formData, validateForm, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
    }
  }, [loading, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          Create New Project
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

          {/* Project Name Field */}
          <TextField
            label="Project Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={!!errors.name}
            helperText={errors.name}
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

          {/* Project Description Field */}
          <TextField
            label="Description (Optional)"
            value={formData.description}
            onChange={handleInputChange('description')}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
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

          {/* Team Members Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary' }}>
              Team Members (Optional)
            </Typography>
            
            {/* Member Input */}
            <TextField
              label="Add team member by email"
              value={memberInput}
              onChange={handleMemberInputChange}
              onKeyPress={handleMemberInputKeyPress}
              error={!!errors.members}
              helperText={errors.members}
              fullWidth
              disabled={loading}
              sx={{
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAddMember}
                      disabled={!memberInput.trim() || loading}
                      size="small"
                      sx={{
                        color: '#0077b6',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 119, 182, 0.04)',
                        },
                        '&:disabled': {
                          color: 'action.disabled',
                        },
                      }}
                    >
                      <IconifyIcon icon="hugeicons:add-01" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Member Chips */}
            {formData.members && formData.members.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.members.map((email) => (
                  <Chip
                    key={email}
                    label={email}
                    onDelete={() => handleRemoveMember(email)}
                    disabled={loading}
                    sx={{
                      backgroundColor: 'rgba(0, 119, 182, 0.08)',
                      color: '#0077b6',
                      '& .MuiChip-deleteIcon': {
                        color: '#0077b6',
                        '&:hover': {
                          color: '#005a8a',
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
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
            disabled={loading || !formData.name.trim()}
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
              'Create Project'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;