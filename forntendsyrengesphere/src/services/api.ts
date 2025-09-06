/**
 * API service functions for Projects Dashboard
 * Handles HTTP requests to the backend API with proper error handling
 */

import { 
  Project, 
  ProjectsResponse, 
  CreateProjectRequest, 
  CreateProjectResponse,
  ApiResponse 
} from '../types';
import { handleApiError } from '../utils/errorHandling';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Generic API request function with error handling
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise with API response
 */
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData,
        },
      };
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        name: 'NetworkError',
        message: 'Request timeout. Please try again.',
      };
    }
    
    throw error;
  }
};

/**
 * Fetches all projects for the current user
 * @returns Promise with projects response
 */
export const fetchProjects = async (): Promise<ProjectsResponse> => {
  try {
    const response = await apiRequest<ProjectsResponse>('/projects');
    return response;
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};

/**
 * Creates a new project
 * @param projectData - Project creation data
 * @returns Promise with created project response
 */
export const createProject = async (
  projectData: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  try {
    const response = await apiRequest<CreateProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response;
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};

/**
 * Fetches a single project by ID
 * @param projectId - The project ID
 * @returns Promise with project data
 */
export const fetchProject = async (projectId: string): Promise<Project> => {
  try {
    const response = await apiRequest<ApiResponse<Project>>(`/projects/${projectId}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch project');
    }
    return response.data;
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};

/**
 * Updates an existing project
 * @param projectId - The project ID
 * @param updateData - Partial project data to update
 * @returns Promise with updated project
 */
export const updateProject = async (
  projectId: string,
  updateData: Partial<CreateProjectRequest>
): Promise<Project> => {
  try {
    const response = await apiRequest<ApiResponse<Project>>(`/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update project');
    }
    return response.data;
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};

/**
 * Deletes a project
 * @param projectId - The project ID
 * @returns Promise with success confirmation
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const response = await apiRequest<ApiResponse>(`/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete project');
    }
  } catch (error) {
    const errorState = handleApiError(error);
    throw new Error(errorState.message);
  }
};