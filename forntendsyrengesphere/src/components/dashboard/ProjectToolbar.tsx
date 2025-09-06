/**
 * ProjectToolbar component
 * Provides search functionality, project count display, and sort options for the dashboard
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  SelectChangeEvent,
  IconButton,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { SortOption } from '../../hooks/useProjectSearch';

export interface ProjectToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  projectCount: number;
  totalProjects: number;
}

/**
 * Debounce hook for search input
 */
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ProjectToolbar: React.FC<ProjectToolbarProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  projectCount,
  totalProjects,
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Update parent component when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearchQuery('');
  }, []);

  const handleSortChange = useCallback((event: SelectChangeEvent<SortOption>) => {
    onSortChange(event.target.value as SortOption);
  }, [onSortChange]);

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'name':
        return 'Name (A-Z)';
      case 'updated':
        return 'Last Updated';
      case 'progress':
        return 'Progress';
      default:
        return 'Last Updated';
    }
  };

  const getProjectCountText = (): string => {
    if (searchQuery.trim()) {
      return `${projectCount} of ${totalProjects} projects`;
    }
    return `${totalProjects} projects`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      {/* Left side: Search and project count */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          minWidth: { xs: '100%', sm: 'auto' },
        }}
      >
        <TextField
          placeholder="Search projects..."
          value={localSearchQuery}
          onChange={handleSearchInputChange}
          variant="outlined"
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: '300px' },
            maxWidth: { xs: '100%', sm: '400px' },
            flex: { xs: 1, sm: 'none' },
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="hugeicons:search-01" sx={{ color: 'action.active' }} />
              </InputAdornment>
            ),
            endAdornment: localSearchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                  aria-label="Clear search"
                  sx={{
                    '&:hover': {
                      color: '#0077b6',
                    },
                  }}
                >
                  <IconifyIcon icon="hugeicons:cancel-01" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: 'nowrap',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {getProjectCountText()}
        </Typography>
      </Box>

      {/* Right side: Sort options */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
        }}
      >
        {/* Mobile project count */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {getProjectCountText()}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel 
            id="sort-select-label"
            sx={{
              '&.Mui-focused': {
                color: '#0077b6',
              },
            }}
          >
            Sort by
          </InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
            }}
          >
            <MenuItem value="updated">{getSortLabel('updated')}</MenuItem>
            <MenuItem value="name">{getSortLabel('name')}</MenuItem>
            <MenuItem value="progress">{getSortLabel('progress')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};