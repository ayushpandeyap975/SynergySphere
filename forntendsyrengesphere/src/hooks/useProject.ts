/**
 * Custom hook for individual project data management
 * Provides state management and API integration for a single project
 */

import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest } from '../types';
import { projectService } from '../services';
import { handleApiError } from '../utils/errorHandling';

interface UseProjectState {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

interface UseProjectActions {
  fetchProject: (projectId: string) => Promise<void>;
  updateProject: (updateData: Partial<CreateProjectRequest>) => Promise<Project>;
  deleteProject: () => Promise<void>;
  clearError: () => void;
}

export interface UseProjectReturn extends UseProjectState, UseProjectActions {}

/**
 * Custom hook for managing individual project data and state
 * @param projectId - The project ID to manage (optional for initial load)
 * @param autoFetch - Whether to automatically fetch project on mount (default: true)
 * @returns Object with project state and actions
 */
export const useProject = (
  projectId?: string, 
  autoFetch: boolean = true
): UseProjectReturn => {
  const [state, setState] = useState<UseProjectState>({
    project: null,
    loading: false,
    error: null,
  });

  /**
   * Fetches a project by ID from the API
   * @param id - Project ID to fetch
   */
  const fetchProject = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const project = await projectService.fetchProject(id);
      setState(prev => ({
        ...prev,
        project,
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
   * Updates the current project
   * @param updateData - Partial project data to update
   * @returns Promise with updated project
   */
  const updateProject = useCallback(async (
    updateData: Partial<CreateProjectRequest>
  ): Promise<Project> => {
    if (!state.project) {
      throw new Error('No project loaded to update');
    }

    try {
      const updatedProject = await projectService.updateProject(
        state.project.id, 
        updateData
      );
      
      // Update local state
      setState(prev => ({
        ...prev,
        project: updatedProject,
      }));

      return updatedProject;
    } catch (error: any) {
      const errorState = handleApiError(error);
      throw new Error(errorState.message);
    }
  }, [state.project]);

  /**
   * Deletes the current project
   */
  const deleteProject = useCallback(async (): Promise<void> => {
    if (!state.project) {
      throw new Error('No project loaded to delete');
    }

    try {
      await projectService.deleteProject(state.project.id);
      
      // Clear local state
      setState(prev => ({
        ...prev,
        project: null,
      }));
    } catch (error: any) {
      const errorState = handleApiError(error);
      throw new Error(errorState.message);
    }
  }, [state.project]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch project on mount if projectId is provided and autoFetch is enabled
  useEffect(() => {
    if (autoFetch && projectId) {
      fetchProject(projectId);
    }
  }, [autoFetch, projectId, fetchProject]);

  return {
    ...state,
    fetchProject,
    updateProject,
    deleteProject,
    clearError,
  };
};