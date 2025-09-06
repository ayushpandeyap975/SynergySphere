/**
 * Demo component for ProjectToolbar
 * Used to test and showcase the ProjectToolbar functionality
 */

import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ProjectToolbar } from './ProjectToolbar';
import { SortOption } from '../../hooks/useProjectSearch';

export const ProjectToolbarDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  // Mock data for demonstration
  const totalProjects = 15;
  const projectCount = searchQuery ? 8 : totalProjects; // Simulate filtered results

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    console.log('Search query changed:', query);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    console.log('Sort option changed:', newSortBy);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ProjectToolbar Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This demo showcases the ProjectToolbar component with search and sort functionality.
        Open the browser console to see the callback events.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <ProjectToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          projectCount={projectCount}
          totalProjects={totalProjects}
        />

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Current State:
          </Typography>
          <Typography variant="body2">
            <strong>Search Query:</strong> "{searchQuery}" {searchQuery ? '(filtered)' : '(showing all)'}
          </Typography>
          <Typography variant="body2">
            <strong>Sort By:</strong> {sortBy}
          </Typography>
          <Typography variant="body2">
            <strong>Project Count:</strong> {projectCount} of {totalProjects}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Features demonstrated:</strong>
            <br />
            • Real-time search with 300ms debounce
            <br />
            • Clear search button when text is entered
            <br />
            • Sort options: Last Updated, Name (A-Z), Progress
            <br />
            • Responsive project count display
            <br />
            • DNX theme styling with Material-UI components
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};