/**
 * TypeScript interfaces for Project-related data structures
 * Used throughout the Projects Dashboard for type safety
 */

/**
 * Represents a project member with their role and information
 */
export interface ProjectMember {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
}

/**
 * Represents a project with all its associated data
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  doneTasks: number;
  totalTasks: number;
  updatedAt: string;
  createdAt: string;
  members?: ProjectMember[];
}

/**
 * Data structure for creating a new project
 */
export interface CreateProjectData {
  name: string;
  description?: string;
  members?: string[]; // Array of email addresses
}

/**
 * Response structure for fetching projects list
 */
export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

/**
 * Request structure for creating a new project
 */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  members?: string[]; // email addresses
}

/**
 * Response structure for project creation
 */
export interface CreateProjectResponse {
  project: Project;
  success: boolean;
  message?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Project progress calculation helper type
 */
export interface ProjectProgress {
  percentage: number;
  completed: number;
  total: number;
}