import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import LogoutConfirmDialog from 'components/dialogs/LogoutConfirmDialog';
import { authService } from 'services';
import { Avatar3 } from 'data/images';
import paths from 'routes/paths';

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

const DashboardHeader = ({
  userName,
  userEmail,
  userAvatar,
  onProfileClick,
  onLogoutClick,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Get current user data from auth service
  const currentUser = authService.getUserData();
  const displayName = userName || currentUser?.name || 'Alex Stanton';
  const displayEmail = userEmail || currentUser?.email || 'alex@example.com';
  const displayAvatar = userAvatar || currentUser?.avatar || Avatar3;

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuClick = () => {
    handleUserMenuClose();
    onProfileClick?.();
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      setLogoutDialogOpen(true);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await authService.logout();
      // Redirect to login page after successful logout
      navigate(paths.signin, { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout API fails
      navigate(paths.signin, { replace: true });
    } finally {
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={2}
      bgcolor="info.lighter"
      borderBottom="1px solid"
      borderColor="info.main"
      role="banner"
      aria-label="Dashboard header"
    >
      {/* App Branding */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography
          variant="h4"
          color="text.primary"
          fontWeight={600}
          component="h1"
        >
          SynergySphere
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Projects Dashboard
        </Typography>
      </Stack>

      {/* User Menu */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {displayName}
          </Typography>
        </Stack>
        
        <ButtonBase
          onClick={handleUserMenuClick}
          aria-controls={open ? 'user-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          aria-label={`User menu for ${displayName}`}
          disableRipple
          sx={{
            borderRadius: '50%',
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
            },
          }}
        >
          <Avatar
            src={displayAvatar}
            alt={`${displayName} avatar`}
            sx={{
              height: 40,
              width: 40,
              bgcolor: 'primary.main',
            }}
          />
        </ButtonBase>

        <Menu
          anchorEl={anchorEl}
          id="user-menu"
          open={open}
          onClose={handleUserMenuClose}
          onClick={handleUserMenuClose}
          sx={{
            mt: 1.5,
            '& .MuiList-root': {
              p: 0,
              width: 220,
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          role="menu"
          aria-labelledby="user-menu-button"
        >
          {/* User Info Section */}
          <Box p={1}>
            <MenuItem
              onClick={handleUserMenuClose}
              sx={{ 
                '&:hover': { bgcolor: 'info.light' },
                cursor: 'default',
              }}
              role="menuitem"
              tabIndex={-1}
            >
              <Avatar 
                src={displayAvatar} 
                alt={`${displayName} avatar`}
                sx={{ mr: 1.5, height: 36, width: 36 }} 
              />
              <Stack direction="column">
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {displayName}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={400}>
                  {displayEmail}
                </Typography>
              </Stack>
            </MenuItem>
          </Box>

          <Divider sx={{ my: 0 }} />

          {/* Menu Actions */}
          <Box p={1}>
            <MenuItem
              onClick={handleProfileMenuClick}
              sx={{ py: 1 }}
              role="menuitem"
              aria-label="View profile"
            >
              <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h6.fontSize' }}>
                <IconifyIcon icon="hugeicons:user-circle-02" />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                View Profile
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={handleLogoutClick}
              sx={{ py: 1 }}
              role="menuitem"
              aria-label="Logout"
            >
              <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h6.fontSize' }}>
                <IconifyIcon icon="hugeicons:logout-03" />
              </ListItemIcon>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Logout
              </Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Stack>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={displayName}
      />
    </Stack>
  );
};

export default DashboardHeader;