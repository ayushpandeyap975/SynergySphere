/**
 * Error handling utilities for consistent error management
 * Provides standardized error processing and user-friendly messages
 */

import { ErrorState, ErrorType, ApiError, ValidationError } from '../types/error';

/**
 * Creates a standardized error state object
 * @param type - The type of error
 * @param message - The error message
 * @param options - Additional error options
 * @returns Standardized ErrorState object
 */
export const createErrorState = (
  type: ErrorType,
  message: string,
  options: {
    field?: string;
    retryable?: boolean;
    code?: string | number;
  } = {}
): ErrorState => {
  return {
    type,
    message,
    field: options.field,
    retryable: options.retryable ?? (type === 'network'),
    code: options.code,
  };
};

/**
 * Processes API errors and returns user-friendly error states
 * @param error - The error object from API call
 * @returns Standardized ErrorState object
 */
export const handleApiError = (error: any): ErrorState => {
  // Network/connection errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return createErrorState(
      'network',
      'Unable to connect to the server. Please check your internet connection and try again.',
      { retryable: true }
    );
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as ApiError;

    switch (status) {
      case 400:
        return createErrorState(
          'validation',
          data?.message || 'Invalid request. Please check your input and try again.',
          { retryable: false, code: status }
        );
      case 401:
        return createErrorState(
          'server',
          'You are not authorized to perform this action. Please log in and try again.',
          { retryable: false, code: status }
        );
      case 403:
        return createErrorState(
          'server',
          'You do not have permission to perform this action.',
          { retryable: false, code: status }
        );
      case 404:
        return createErrorState(
          'server',
          'The requested resource was not found.',
          { retryable: false, code: status }
        );
      case 409:
        return createErrorState(
          'validation',
          data?.message || 'A conflict occurred. The resource may already exist.',
          { retryable: false, code: status }
        );
      case 429:
        return createErrorState(
          'server',
          'Too many requests. Please wait a moment and try again.',
          { retryable: true, code: status }
        );
      case 500:
      case 502:
      case 503:
      case 504:
        return createErrorState(
          'server',
          'A server error occurred. Please try again later.',
          { retryable: true, code: status }
        );
      default:
        return createErrorState(
          'server',
          data?.message || 'An unexpected error occurred. Please try again.',
          { retryable: true, code: status }
        );
    }
  }

  // Generic error fallback
  return createErrorState(
    'unknown',
    error.message || 'An unexpected error occurred. Please try again.',
    { retryable: true }
  );
};

/**
 * Processes validation errors and returns formatted error messages
 * @param errors - Array of validation errors
 * @returns Map of field names to error messages
 */
export const processValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  
  errors.forEach(error => {
    errorMap[error.field] = error.message;
  });

  return errorMap;
};

/**
 * Determines if an error is retryable based on its type and characteristics
 * @param error - The error state to check
 * @returns true if the error is retryable, false otherwise
 */
export const isRetryableError = (error: ErrorState): boolean => {
  return error.retryable;
};

/**
 * Gets a user-friendly error message for display in the UI
 * @param error - The error state
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ErrorState): string => {
  switch (error.type) {
    case 'network':
      return 'Connection problem. Please check your internet and try again.';
    case 'validation':
      return error.message; // Validation messages are already user-friendly
    case 'server':
      return error.code === 500 
        ? 'Server is temporarily unavailable. Please try again later.'
        : error.message;
    case 'unknown':
    default:
      return 'Something went wrong. Please try again.';
  }
};

/**
 * Creates a validation error object
 * @param field - The field name that has the error
 * @param message - The validation error message
 * @returns ValidationError object
 */
export const createValidationError = (field: string, message: string): ValidationError => {
  return { field, message };
};

/**
 * Sanitizes error messages to prevent XSS attacks
 * @param message - The error message to sanitize
 * @returns Sanitized error message
 */
export const sanitizeErrorMessage = (message: string): string => {
  if (!message || typeof message !== 'string') {
    return 'An error occurred';
  }

  // Basic HTML entity encoding to prevent XSS
  return message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};