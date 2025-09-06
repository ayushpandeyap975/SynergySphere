/**
 * Custom hook for project creation modal state management
 * Provides modal state and form handling logic
 */

import { useState, useCallback } from 'react';
import { CreateProjectRequest } from '../types';
import { 
  validateProjectName, 
  validateProjectDescription, 
  validateEmails 
} from '../utils/validation';

interface FormErrors {
  name?: string;
  description?: string;
  members?: string;
}

interface UseProjectModalState {
  isOpen: boolean;
  loading: boolean;
  formData: CreateProjectRequest;
  errors: FormErrors;
}

interface UseProjectModalActions {
  openModal: () => void;
  closeModal: () => void;
  updateFormData: (field: keyof CreateProjectRequest, value: string | string[]) => void;
  validateForm: () => boolean;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
  setFieldError: (field: keyof FormErrors, error: string) => void;
  clearErrors: () => void;
}

export interface UseProjectModalReturn extends UseProjectModalState, UseProjectModalActions {}

const initialFormData: CreateProjectRequest = {
  name: '',
  description: '',
  members: [],
};

/**
 * Custom hook for managing project creation modal state
 * @returns Object with modal state and actions
 */
export const useProjectModal = (): UseProjectModalReturn => {
  const [state, setState] = useState<UseProjectModalState>({
    isOpen: false,
    loading: false,
    formData: { ...initialFormData },
    errors: {},
  });

  /**
   * Opens the project creation modal
   */
  const openModal = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  /**
   * Closes the modal and resets form data
   */
  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      formData: { ...initialFormData },
      errors: {},
      loading: false,
    }));
  }, []);

  /**
   * Updates form data for a specific field
   * @param field - The form field to update
   * @param value - The new value
   */
  const updateFormData = useCallback((
    field: keyof CreateProjectRequest, 
    value: string | string[]
  ) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
      // Clear field error when user starts typing
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  }, []);

  /**
   * Validates the entire form
   * @returns true if form is valid, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate project name
    const nameValidation = validateProjectName(state.formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validate project description (optional)
    const descriptionValidation = validateProjectDescription(state.formData.description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error;
    }

    // Validate members emails if provided
    if (state.formData.members && state.formData.members.length > 0) {
      const membersString = state.formData.members.join(', ');
      const emailValidation = validateEmails(membersString);
      if (!emailValidation.isValid) {
        newErrors.members = `Invalid email addresses: ${emailValidation.invalidEmails.join(', ')}`;
      }
    }

    setState(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [state.formData]);

  /**
   * Sets loading state
   * @param loading - Loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  /**
   * Resets form data to initial state
   */
  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: { ...initialFormData },
      errors: {},
    }));
  }, []);

  /**
   * Sets an error for a specific field
   * @param field - The field to set error for
   * @param error - The error message
   */
  const setFieldError = useCallback((field: keyof FormErrors, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  /**
   * Clears all form errors
   */
  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: {} }));
  }, []);

  return {
    ...state,
    openModal,
    closeModal,
    updateFormData,
    validateForm,
    setLoading,
    resetForm,
    setFieldError,
    clearErrors,
  };
};