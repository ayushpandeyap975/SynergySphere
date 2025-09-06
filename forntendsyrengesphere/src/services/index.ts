/**
 * Services index
 * Provides centralized access to API services with environment-based switching
 */

import {
  fetchProjects,
  createProject,
  fetchProject,
  updateProject,
  deleteProject,
} from './api';

import {
  fetchProjectsMock,
  createProjectMock,
  fetchProjectMock,
  updateProjectMock,
  deleteProjectMock,
} from './mockData';

import authService from './auth';

// Environment configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  import.meta.env.MODE === 'development';

/**
 * Project service functions that automatically switch between real API and mock data
 * based on environment configuration
 */
export const projectService = {
  /**
   * Fetches all projects for the current user
   */
  fetchProjects: USE_MOCK_DATA ? fetchProjectsMock : fetchProjects,

  /**
   * Creates a new project
   */
  createProject: USE_MOCK_DATA ? createProjectMock : createProject,

  /**
   * Fetches a single project by ID
   */
  fetchProject: USE_MOCK_DATA ? fetchProjectMock : fetchProject,

  /**
   * Updates an existing project
   */
  updateProject: USE_MOCK_DATA ? updateProjectMock : updateProject,

  /**
   * Deletes a project
   */
  deleteProject: USE_MOCK_DATA ? deleteProjectMock : deleteProject,
};

// Export individual functions for direct import if needed
export {
  fetchProjects as fetchProjectsApi,
  createProject as createProjectApi,
  fetchProject as fetchProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
} from './api';

export {
  fetchProjectsMock,
  createProjectMock,
  fetchProjectMock,
  updateProjectMock,
  deleteProjectMock,
  getMockProjects,
  resetMockData,
} from './mockData';

// Export authentication service
export { authService };

// Export the main service as default
export default projectService;