/**
 * Utility functions index
 * Provides centralized exports for all utility functions
 */

// Validation utilities
export {
  validateEmail,
  validateEmails,
  validateProjectName,
  validateProjectDescription,
} from './validation';

// Error handling utilities
export {
  createErrorState,
  handleApiError,
  processValidationErrors,
  isRetryableError,
  getUserFriendlyErrorMessage,
  createValidationError,
  sanitizeErrorMessage,
} from './errorHandling';