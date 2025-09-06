import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar3 } from 'data/images';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import LogoutConfirmDialog from 'components/dialogs/LogoutConfirmDialog';
import { authService } from 'services';
import paths from 'routes/paths';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
}

const menuItems: MenuItems[] = [
  {
    id: 1,
    title: 'View Profile',
    icon: 'hugeicons:user-circle-02',
  },
  {
    id: 2,
    title: 'Account Settings',
    icon: 'hugeicons:account-setting-02',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: 'solar:bell-outline',
  },
  {
    id: 4,
    title: 'Switch Account',
    icon: 'hugeicons:user-switch',
  },
  {
    id: 5,
    title: 'Help Center',
    icon: 'carbon:help',
  },
  {
    id: 6,
    title: 'Logout',
    icon: 'hugeicons:logout-03',
  },
];

const ProfileMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  // Get current user data from auth service
  const currentUser = authService.getUserData();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (itemId: number) => {
    handleProfileMenuClose();
    
    switch (itemId) {
      case 1: // View Profile
        navigate(paths.profile);
        break;
      case 6: // Logout
        setLogoutDialogOpen(true);
        break;
      default:
        console.log(`Menu item ${itemId} clicked`);
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
    <>
      <ButtonBase
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          src={Avatar3}
          sx={{
            height: 48,
            width: 48,
            bgcolor: 'primary.main',
          }}
        />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.light' } }}>
            <Avatar 
              src={currentUser?.avatar || Avatar3} 
              sx={{ mr: 1, height: 42, width: 42 }} 
            />
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {currentUser?.name || 'Alex Stanton'}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {currentUser?.email || 'alex@example.com'}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item) => {
            return (
              <MenuItem 
                key={item.id} 
                onClick={() => handleMenuItemClick(item.id)} 
                sx={{ 
                  py: 1,
                  '&:hover': {
                    '& .MuiListItemIcon-root': {
                      color: item.id === 1 ? '#0077b6' : 'text.secondary',
                    },
                    '& .MuiTypography-root': {
                      color: item.id === 1 ? '#0077b6' : 'text.secondary',
                    },
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  mr: 1, 
                  color: 'text.secondary', 
                  fontSize: 'h5.fontSize',
                  transition: 'color 0.2s ease',
                }}>
                  <IconifyIcon icon={item.icon} />
                </ListItemIcon>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  fontWeight={500}
                  sx={{ transition: 'color 0.2s ease' }}
                >
                  {item.title}
                </Typography>
              </MenuItem>
            );
          })}
        </Box>
      </Menu>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={currentUser?.name || 'User'}
      />
    </>
  );
};

export default ProfileMenu;
