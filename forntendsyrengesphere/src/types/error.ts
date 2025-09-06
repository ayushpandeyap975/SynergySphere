/**
 * Error handling types for consistent error management
 * across the Projects Dashboard application
 */

/**
 * Different types of errors that can occur in the application
 */
export type ErrorType = 'network' | 'validation' | 'server' | 'unknown';

/**
 * Comprehensive error state structure
 */
export interface ErrorState {
  type: ErrorType;
  message: string;
  field?: string; // for field-specific validation errors
  retryable: boolean;
  code?: string | number; // HTTP status code or custom error code
}

/**
 * Form validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, any>;
  timestamp?: string;
}

/**
 * Network error structure for handling connection issues
 */
export interface NetworkError {
  message: string;
  status?: number;
  statusText?: string;
  url?: string;
}