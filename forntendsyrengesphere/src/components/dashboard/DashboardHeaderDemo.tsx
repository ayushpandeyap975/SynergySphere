import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DashboardHeader from './DashboardHeader';

/**
 * Demo component to test DashboardHeader functionality
 * This component demonstrates the header with interactive features
 */
const DashboardHeaderDemo = () => {
  const [lastAction, setLastAction] = useState<string>('');

  const handleProfileClick = () => {
    setLastAction('Profile clicked');
    console.log('Profile menu item clicked');
  };

  const handleLogoutClick = () => {
    setLastAction('Logout clicked');
    console.log('Logout menu item clicked');
  };

  return (
    <Stack spacing={3} sx={{ minHeight: '100vh', bgcolor: 'info.main' }}>
      <DashboardHeader
        userName="John Doe"
        userEmail="john.doe@example.com"
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
      />
      
      <Stack spacing={2} p={3}>
        <Typography variant="h5" color="text.primary">
          Dashboard Header Demo
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Instructions:
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            <strong>Keyboard Navigation:</strong>
            <ul>
              <li>Press Tab to navigate to the user avatar button</li>
              <li>Press Enter or Space to open the user menu</li>
              <li>Use arrow keys to navigate menu items</li>
              <li>Press Enter to select a menu item</li>
              <li>Press Escape to close the menu</li>
            </ul>
          </Typography>
          
          <Typography variant="body2" component="div" sx={{ mb: 2 }}>
            <strong>Accessibility Features:</strong>
            <ul>
              <li>ARIA labels for screen readers</li>
              <li>Proper focus management</li>
              <li>Semantic HTML structure</li>
              <li>Keyboard navigation support</li>
            </ul>
          </Typography>
          
          {lastAction && (
            <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
              Last action: {lastAction}
            </Typography>
          )}
        </Paper>
      </Stack>
    </Stack>
  );
};

export default DashboardHeaderDemo;