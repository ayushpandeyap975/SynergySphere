/**
 * Custom hook for project search and filtering functionality
 * Provides search state management and filtering logic
 */

import { useState, useMemo, useCallback } from 'react';
import { Project } from '../types';

export type SortOption = 'name' | 'updated' | 'progress';

interface UseProjectSearchState {
  searchQuery: string;
  sortBy: SortOption;
  filteredProjects: Project[];
}

interface UseProjectSearchActions {
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  clearSearch: () => void;
}

export interface UseProjectSearchReturn extends UseProjectSearchState, UseProjectSearchActions {}

/**
 * Custom hook for managing project search and filtering
 * @param projects - Array of projects to search and filter
 * @returns Object with search state and actions
 */
export const useProjectSearch = (projects: Project[]): UseProjectSearchReturn => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  /**
   * Filters projects based on search query
   */
  const searchFilteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const query = searchQuery.toLowerCase().trim();
    return projects.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  /**
   * Sorts filtered projects based on selected sort option
   */
  const filteredProjects = useMemo(() => {
    const sorted = [...searchFilteredProjects];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'updated':
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      
      case 'progress':
        return sorted.sort((a, b) => {
          const progressA = a.totalTasks > 0 ? (a.doneTasks / a.totalTasks) : 0;
          const progressB = b.totalTasks > 0 ? (b.doneTasks / b.totalTasks) : 0;
          return progressB - progressA; // Descending order (highest progress first)
        });
      
      default:
        return sorted;
    }
  }, [searchFilteredProjects, sortBy]);

  /**
   * Clears the search query
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    sortBy,
    filteredProjects,
    setSearchQuery,
    setSortBy,
    clearSearch,
  };
};