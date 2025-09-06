/**
 * Custom hook for project data management
 * Provides state management and API integration for projects
 */

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectsResponse, CreateProjectRequest } from '../types';
import { projectService } from '../services';
import { handleApiError } from '../utils/errorHandling';

interface UseProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
}

interface UseProjectsActions {
  fetchProjects: () => Promise<void>;
  createProject: (projectData: CreateProjectRequest) => Promise<Project>;
  refreshProjects: () => Promise<void>;
  clearError: () => void;
}

export interface UseProjectsReturn extends UseProjectsState, UseProjectsActions {}

/**
 * Custom hook for managing projects data and state
 * @param autoFetch - Whether to automatically fetch projects on mount (default: true)
 * @returns Object with projects state and actions
 */
export const useProjects = (autoFetch: boolean = true): UseProjectsReturn => {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    loading: false,
    error: null,
    total: 0,
  });

  /**
   * Fetches projects from the API
   */
  const fetchProjects = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: ProjectsResponse = await projectService.fetchProjects();
      setState(prev => ({
        ...prev,
        projects: response.projects,
        total: response.total,
        loading: false,
      }));
    } catch (error: any) {
      const errorState = handleApiError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorState.message,
      }));
    }
  }, []);

  /**
   * Creates a new project and adds it to the local state
   * @param projectData - Project creation data
   * @returns Promise with created project
   */
  const createProject = useCallback(async (
    projectData: CreateProjectRequest
  ): Promise<Project> => {
    try {
      const response = await projectService.createProject(projectData);
      
      // Optimistically update local state
      setState(prev => ({
        ...prev,
        projects: [response.project, ...prev.projects],
        total: prev.total + 1,
      }));

      return response.project;
    } catch (error: any) {
      const errorState = handleApiError(error);
      throw new Error(errorState.message);
    }
  }, []);

  /**
   * Refreshes the projects list
   */
  const refreshProjects = useCallback(async (): Promise<void> => {
    await fetchProjects();
  }, [fetchProjects]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch projects on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return {
    ...state,
    fetchProjects,
    createProject,
    refreshProjects,
    clearError,
  };
};