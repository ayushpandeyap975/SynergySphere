import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { TaskPriority } from '../../types/task';
import { ProjectMember } from '../../types/project';

export interface TaskFilters {
  search: string;
  assignee: string;
  priority: TaskPriority | 'all';
  dueDate: 'all' | 'overdue' | 'today' | 'this_week' | 'no_due_date';
}

export type TaskSortOption = 'due_date' | 'priority' | 'assignee' | 'created_date' | 'title';

interface TaskFilterToolbarProps {
  filters: TaskFilters;
  sortBy: TaskSortOption;
  onFiltersChange: (filters: TaskFilters) => void;
  onSortChange: (sortBy: TaskSortOption) => void;
  projectMembers: ProjectMember[];
  taskCount: number;
}

/**
 * TaskFilterToolbar Component
 * Provides filtering and sorting controls for the task board
 */
const TaskFilterToolbar: React.FC<TaskFilterToolbarProps> = ({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  projectMembers,
  taskCount,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value,
    });
  };

  const handleAssigneeChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({
      ...filters,
      assignee: event.target.value,
    });
  };

  const handlePriorityChange = (event: SelectChangeEvent<TaskPriority | 'all'>) => {
    onFiltersChange({
      ...filters,
      priority: event.target.value as TaskPriority | 'all',
    });
  };

  const handleDueDateChange = (event: SelectChangeEvent<string>) => {
    onFiltersChange({
      ...filters,
      dueDate: event.target.value as TaskFilters['dueDate'],
    });
  };

  const handleSortChange = (event: SelectChangeEvent<TaskSortOption>) => {
    onSortChange(event.target.value as TaskSortOption);
  };

  const clearSearch = () => {
    onFiltersChange({
      ...filters,
      search: '',
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      assignee: 'all',
      priority: 'all',
      dueDate: 'all',
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.assignee !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.dueDate !== 'all') count++;
    return count;
  };

  const getPriorityLabel = (priority: TaskPriority | 'all'): string => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      case 'all':
        return 'All Priorities';
      default:
        return 'All Priorities';
    }
  };

  const getDueDateLabel = (dueDate: TaskFilters['dueDate']): string => {
    switch (dueDate) {
      case 'overdue':
        return 'Overdue';
      case 'today':
        return 'Due Today';
      case 'this_week':
        return 'Due This Week';
      case 'no_due_date':
        return 'No Due Date';
      case 'all':
        return 'All Due Dates';
      default:
        return 'All Due Dates';
    }
  };

  const getSortLabel = (sort: TaskSortOption): string => {
    switch (sort) {
      case 'due_date':
        return 'Due Date';
      case 'priority':
        return 'Priority';
      case 'assignee':
        return 'Assignee';
      case 'created_date':
        return 'Created Date';
      case 'title':
        return 'Title';
      default:
        return 'Due Date';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        p: 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
      }}
    >
      {/* Search Input */}
      <TextField
        placeholder="Search tasks..."
        value={filters.search}
        onChange={handleSearchChange}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        size="small"
        sx={{
          minWidth: { xs: '100%', md: 280 },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0077b6',
              borderWidth: 2,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: searchFocused || filters.search ? '#0077b6' : 'text.secondary',
                  transition: 'color 0.2s',
                }} 
              />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={clearSearch}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: '#0077b6',
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flex: 1,
        }}
      >
        {/* Assignee Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Assignee</InputLabel>
          <Select
            value={filters.assignee}
            onChange={handleAssigneeChange}
            label="Assignee"
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
              '& .MuiSelect-select': {
                color: filters.assignee !== 'all' ? '#0077b6' : 'inherit',
                fontWeight: filters.assignee !== 'all' ? 600 : 400,
              },
            }}
          >
            <MenuItem value="all">All Assignees</MenuItem>
            <MenuItem value="unassigned">Unassigned</MenuItem>
            {projectMembers.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            onChange={handlePriorityChange}
            label="Priority"
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
              '& .MuiSelect-select': {
                color: filters.priority !== 'all' ? '#0077b6' : 'inherit',
                fontWeight: filters.priority !== 'all' ? 600 : 400,
              },
            }}
          >
            <MenuItem value="all">{getPriorityLabel('all')}</MenuItem>
            <MenuItem value="high">{getPriorityLabel('high')}</MenuItem>
            <MenuItem value="medium">{getPriorityLabel('medium')}</MenuItem>
            <MenuItem value="low">{getPriorityLabel('low')}</MenuItem>
          </Select>
        </FormControl>

        {/* Due Date Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Due Date</InputLabel>
          <Select
            value={filters.dueDate}
            onChange={handleDueDateChange}
            label="Due Date"
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
              '& .MuiSelect-select': {
                color: filters.dueDate !== 'all' ? '#0077b6' : 'inherit',
                fontWeight: filters.dueDate !== 'all' ? 600 : 400,
              },
            }}
          >
            <MenuItem value="all">{getDueDateLabel('all')}</MenuItem>
            <MenuItem value="overdue">{getDueDateLabel('overdue')}</MenuItem>
            <MenuItem value="today">{getDueDateLabel('today')}</MenuItem>
            <MenuItem value="this_week">{getDueDateLabel('this_week')}</MenuItem>
            <MenuItem value="no_due_date">{getDueDateLabel('no_due_date')}</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Control */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077b6',
              },
            }}
          >
            <MenuItem value="due_date">{getSortLabel('due_date')}</MenuItem>
            <MenuItem value="priority">{getSortLabel('priority')}</MenuItem>
            <MenuItem value="assignee">{getSortLabel('assignee')}</MenuItem>
            <MenuItem value="created_date">{getSortLabel('created_date')}</MenuItem>
            <MenuItem value="title">{getSortLabel('title')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Filter Summary and Clear */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        {/* Active Filters Indicator */}
        {getActiveFilterCount() > 0 && (
          <Chip
            icon={<FilterIcon />}
            label={`${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''}`}
            size="small"
            sx={{
              backgroundColor: '#0077b6',
              color: 'white',
              fontWeight: 500,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        )}

        {/* Task Count */}
        <Chip
          label={`${taskCount} task${taskCount !== 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
          sx={{
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        />

        {/* Clear All Filters */}
        {getActiveFilterCount() > 0 && (
          <Tooltip title="Clear all filters">
            <IconButton
              size="small"
              onClick={clearAllFilters}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: '#0077b6',
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default TaskFilterToolbar;