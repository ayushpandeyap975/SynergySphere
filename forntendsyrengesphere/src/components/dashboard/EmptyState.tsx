import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No projects yet",
  description = "Get started by creating your first project to collaborate with your team.",
  actionLabel,
  onActionClick,
  icon,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
        minHeight: 300,
      }}
    >
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            mb: 3,
            color: theme.palette.neutral.main,
            '& svg': {
              fontSize: '4rem',
            },
          }}
        >
          {icon}
        </Box>
      )}

      {/* Default icon if none provided */}
      {!icon && (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: theme.palette.neutral.lighter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: theme.palette.neutral.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: theme.palette.neutral.main,
              }}
            />
          </Box>
        </Box>
      )}

      {/* Title */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 400,
          lineHeight: 1.6,
          mb: actionLabel && onActionClick ? 3 : 0,
        }}
      >
        {description}
      </Typography>

      {/* Action Button */}
      {actionLabel && onActionClick && (
        <Button
          variant="contained"
          onClick={onActionClick}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

// Specific empty state for projects
export const ProjectsEmptyState: React.FC<{
  onCreateProject?: () => void;
}> = ({ onCreateProject }) => {
  return (
    <EmptyState
      title="No projects yet"
      description="Get started by creating your first project to collaborate with your team."
      actionLabel={onCreateProject ? "Create Project" : undefined}
      onActionClick={onCreateProject}
    />
  );
};

// Empty state for search results
export const SearchEmptyState: React.FC<{
  searchQuery: string;
}> = ({ searchQuery }) => {
  return (
    <EmptyState
      title="No projects found"
      description={`No projects match "${searchQuery}". Try adjusting your search terms.`}
    />
  );
};

export default EmptyState;