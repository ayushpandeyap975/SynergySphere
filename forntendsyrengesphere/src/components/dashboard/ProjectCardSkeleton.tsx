import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ProjectCardSkeletonProps {
  count?: number;
}

export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({ count = 1 }) => {
  const theme = useTheme();

  const SkeletonCard = () => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Project Header Skeleton */}
        <Box sx={{ mb: 2 }}>
          <Skeleton 
            variant="text" 
            width="80%" 
            height={28}
            sx={{ 
              mb: 1,
              borderRadius: 1,
            }}
          />
          <Skeleton 
            variant="text" 
            width="100%" 
            height={20}
            sx={{ mb: 0.5 }}
          />
          <Skeleton 
            variant="text" 
            width="60%" 
            height={20}
          />
        </Box>

        {/* Progress Section Skeleton */}
        <Box sx={{ mb: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={80} height={16} />
          </Box>
          
          <Skeleton 
            variant="rounded" 
            width="100%" 
            height={6}
            sx={{ 
              borderRadius: 3,
              mb: 0.5,
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="text" width={80} height={16} />
          </Box>
        </Box>

        {/* Footer Section Skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          {/* Team Members Skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Skeleton 
              variant="circular" 
              width={24} 
              height={24}
              sx={{ 
                border: `2px solid ${theme.palette.background.paper}`,
              }}
            />
            <Skeleton 
              variant="circular" 
              width={24} 
              height={24}
              sx={{ 
                border: `2px solid ${theme.palette.background.paper}`,
                ml: -0.5,
              }}
            />
            <Skeleton 
              variant="circular" 
              width={24} 
              height={24}
              sx={{ 
                border: `2px solid ${theme.palette.background.paper}`,
                ml: -0.5,
              }}
            />
          </Box>

          {/* Last Updated Skeleton */}
          <Skeleton 
            variant="rounded" 
            width={80} 
            height={20}
            sx={{ borderRadius: 10 }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  // Return multiple skeleton cards if count > 1
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </>
    );
  }

  return <SkeletonCard />;
};

export default ProjectCardSkeleton;