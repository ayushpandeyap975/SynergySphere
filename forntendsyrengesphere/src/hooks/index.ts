/**
 * Hooks index
 * Provides centralized exports for all custom hooks
 */

// Project data management hooks
export { useProjects } from './useProjects';
export type { UseProjectsReturn } from './useProjects';

export { useProject } from './useProject';
export type { UseProjectReturn } from './useProject';

// Project search and filtering hooks
export { useProjectSearch } from './useProjectSearch';
export type { UseProjectSearchReturn, SortOption } from './useProjectSearch';

// Project modal management hooks
export { useProjectModal } from './useProjectModal';
export type { UseProjectModalReturn } from './useProjectModal';

// Re-export existing hooks from components/hooks
export { default as useResizeObserver } from '../components/hooks/useResizeObserver';