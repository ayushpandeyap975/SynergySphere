/**
 * Validation utilities for the Projects Dashboard
 * Provides corporate-grade validation for emails and project names
 */

// Corporate-grade email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Project name validation constants
const PROJECT_NAME_MIN_LENGTH = 3;
const PROJECT_NAME_MAX_LENGTH = 80;
const PROJECT_NAME_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

/**
 * Validates an email address using corporate-grade regex
 * @param email - The email address to validate
 * @returns true if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim();
  return EMAIL_REGEX.test(trimmedEmail);
};

/**
 * Validates multiple email addresses separated by commas
 * @param emails - Comma-separated email addresses
 * @returns Object with isValid boolean and array of invalid emails
 */
export const validateEmails = (emails: string): { isValid: boolean; invalidEmails: string[] } => {
  if (!emails || typeof emails !== 'string') {
    return { isValid: false, invalidEmails: [] };
  }

  const emailList = emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
  const invalidEmails: string[] = [];

  emailList.forEach(email => {
    if (!validateEmail(email)) {
      invalidEmails.push(email);
    }
  });

  return {
    isValid: invalidEmails.length === 0,
    invalidEmails
  };
};

/**
 * Validates a project name according to business rules
 * @param name - The project name to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateProjectName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Project name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < PROJECT_NAME_MIN_LENGTH) {
    return { isValid: false, error: `Project name must be at least ${PROJECT_NAME_MIN_LENGTH} characters` };
  }

  if (trimmedName.length > PROJECT_NAME_MAX_LENGTH) {
    return { isValid: false, error: `Project name must not exceed ${PROJECT_NAME_MAX_LENGTH} characters` };
  }

  if (!PROJECT_NAME_REGEX.test(trimmedName)) {
    return { isValid: false, error: 'Project name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }

  return { isValid: true };
};

/**
 * Validates project description (optional field)
 * @param description - The project description to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateProjectDescription = (description?: string): { isValid: boolean; error?: string } => {
  // Description is optional
  if (!description) {
    return { isValid: true };
  }

  if (typeof description !== 'string') {
    return { isValid: false, error: 'Description must be a string' };
  }

  // Allow reasonable description length (up to 500 characters)
  if (description.trim().length > 500) {
    return { isValid: false, error: 'Description must not exceed 500 characters' };
  }

  return { isValid: true };
};