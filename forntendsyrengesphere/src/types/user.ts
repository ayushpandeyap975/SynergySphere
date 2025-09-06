/**
 * User-related types and interfaces
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
  joinedAt: string;
  lastActive?: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    taskUpdates: boolean;
    projectUpdates: boolean;
  };
  language: string;
}

export interface UpdateUserProfileData {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  avatar?: string;
}

export interface UpdateUserProfileResponse {
  user: UserProfile;
  success: boolean;
  message?: string;
}