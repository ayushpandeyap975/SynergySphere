import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme/theme';
import DashboardHeaderDemo from '../components/dashboard/DashboardHeaderDemo';

/**
 * Test page for DashboardHeader component
 * This page can be used to test the header functionality independently
 */
const DashboardHeaderTest = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardHeaderDemo />
    </ThemeProvider>
  );
};

export default DashboardHeaderTest;