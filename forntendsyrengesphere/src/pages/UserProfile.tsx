import { useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Avatar,
  Button,
  TextField,
  Typography,
  Chip,
  Tab,
  Tabs,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import IconifyIcon from 'components/base/IconifyIcon';
import { Avatar3 } from 'data/images';
import type { UserProfile as UserProfileType, UpdateUserProfileData } from 'types';

// Mock user data - in a real app this would come from API/context
const mockUser: UserProfileType = {
  id: '1',
  name: 'Alex Stanton',
  email: 'alex@example.com',
  avatar: Avatar3,
  role: 'manager',
  department: 'Engineering',
  joinedAt: '2023-01-15T00:00:00Z',
  lastActive: '2024-12-15T10:30:00Z',
  bio: 'Experienced project manager with a passion for team collaboration and efficient workflows.',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  timezone: 'PST',
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      projectUpdates: true,
    },
    language: 'en',
  },
};

const StyledTabs = styled(Tabs)(() => ({
  '& .MuiTabs-indicator': {
    backgroundColor: '#0077b6',
  },
  '& .Mui-selected': {
    color: '#0077b6 !important',
  },
}));

const EditButton = styled(Button)(() => ({
  backgroundColor: '#0077b6',
  color: 'white',
  '&:hover': {
    backgroundColor: '#005a8a',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfile = () => {
  const [user, setUser] = useState<UserProfileType>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateUserProfileData>({
    name: user.name,
    bio: user.bio,
    phone: user.phone,
    location: user.location,
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edit data if canceling
      setEditData({
        name: user.name,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setUser({
      ...user,
      ...editData,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UpdateUserProfileData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditData({
      ...editData,
      [field]: event.target.value,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleColor = (role: string): 'error' | 'warning' | 'primary' => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="flex-start">
          <Avatar
            src={user.avatar}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              fontSize: '2rem',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          
          <Stack spacing={2} flex={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack spacing={1}>
                {isEditing ? (
                  <TextField
                    value={editData.name}
                    onChange={handleInputChange('name')}
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: 300 }}
                  />
                ) : (
                  <Typography variant="h4" fontWeight={600}>
                    {user.name}
                  </Typography>
                )}
                
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                  {user.department && (
                    <Chip
                      label={user.department}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              </Stack>
              
              <Stack direction="row" spacing={1}>
                {isEditing ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleEditToggle}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <EditButton
                      variant="contained"
                      onClick={handleSave}
                      size="small"
                    >
                      Save Changes
                    </EditButton>
                  </>
                ) : (
                  <EditButton
                    variant="contained"
                    startIcon={<IconifyIcon icon="hugeicons:edit-02" />}
                    onClick={handleEditToggle}
                    size="small"
                  >
                    Edit Profile
                  </EditButton>
                )}
              </Stack>
            </Stack>
            
            {isEditing ? (
              <TextField
                value={editData.bio}
                onChange={handleInputChange('bio')}
                multiline
                rows={2}
                placeholder="Tell us about yourself..."
                variant="outlined"
                size="small"
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
                {user.bio || 'No bio available'}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Profile Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs value={activeTab} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Personal Information" />
            <Tab label="Account Settings" />
            <Tab label="Activity" />
          </StyledTabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Phone
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={editData.phone}
                          onChange={handleInputChange('phone')}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body1">
                          {user.phone || 'Not provided'}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Location
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={editData.location}
                          onChange={handleInputChange('location')}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body1">
                          {user.location || 'Not provided'}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Timezone
                      </Typography>
                      <Typography variant="body1">
                        {user.timezone || 'Not set'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Account Details
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Member Since
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.joinedAt)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Active
                      </Typography>
                      <Typography variant="body1">
                        {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        User ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {user.id}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Stack spacing={3}>
            <Typography variant="h6">
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Account settings and preferences will be implemented in a future update.
            </Typography>
          </Stack>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Stack spacing={3}>
            <Typography variant="h6">
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activity tracking will be implemented in a future update.
            </Typography>
          </Stack>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default UserProfile;