import { useState } from 'react';
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
import { Avatar3 } from 'data/images';

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

const DashboardHeader = ({
  userName = 'Alex Stanton',
  userEmail = 'alex@example.com',
  userAvatar = Avatar3,
  onProfileClick,
  onLogoutClick,
}: DashboardHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    onLogoutClick?.();
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
            {userName}
          </Typography>
        </Stack>
        
        <ButtonBase
          onClick={handleUserMenuClick}
          aria-controls={open ? 'user-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          aria-label={`User menu for ${userName}`}
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
            src={userAvatar}
            alt={`${userName} avatar`}
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
                src={userAvatar} 
                alt={`${userName} avatar`}
                sx={{ mr: 1.5, height: 36, width: 36 }} 
              />
              <Stack direction="column">
                <Typography variant="body2" color="text.primary" fontWeight={600}>
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={400}>
                  {userEmail}
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
    </Stack>
  );
};

export default DashboardHeader;