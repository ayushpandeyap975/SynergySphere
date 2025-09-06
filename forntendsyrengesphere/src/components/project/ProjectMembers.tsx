import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { ProjectMember } from '../../types/project';

interface ProjectMembersProps {
  members: ProjectMember[];
  currentUserId?: string;
  onInviteMember: (email: string, role: ProjectMember['role']) => Promise<void>;
  onUpdateMemberRole: (memberId: string, role: ProjectMember['role']) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
}

interface MemberMenuState {
  anchorEl: HTMLElement | null;
  member: ProjectMember | null;
}

/**
 * Project Members Component
 * Displays and manages project team members with role-based permissions
 */
const ProjectMembers: React.FC<ProjectMembersProps> = ({
  members,
  currentUserId,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
}) => {
  const [memberMenu, setMemberMenu] = useState<MemberMenuState>({
    anchorEl: null,
    member: null,
  });
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectMember['role']>('member');
  const [newRole, setNewRole] = useState<ProjectMember['role']>('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = members.find(m => m.id === currentUserId);
  const canManageMembers = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const handleMemberMenuClick = (event: React.MouseEvent<HTMLElement>, member: ProjectMember) => {
    setMemberMenu({
      anchorEl: event.currentTarget,
      member,
    });
  };

  const handleMemberMenuClose = () => {
    setMemberMenu({
      anchorEl: null,
      member: null,
    });
  };

  const handleInviteClick = () => {
    setInviteDialogOpen(true);
    setError(null);
  };

  const handleInviteClose = () => {
    setInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('member');
    setError(null);
  };

  const handleEditRoleClick = () => {
    if (memberMenu.member) {
      setSelectedMember(memberMenu.member);
      setNewRole(memberMenu.member.role);
      setEditRoleDialogOpen(true);
    }
    handleMemberMenuClose();
  };

  const handleEditRoleClose = () => {
    setEditRoleDialogOpen(false);
    setSelectedMember(null);
    setError(null);
  };

  const handleRemoveClick = () => {
    if (memberMenu.member) {
      setSelectedMember(memberMenu.member);
      setRemoveDialogOpen(true);
    }
    handleMemberMenuClose();
  };

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
    setSelectedMember(null);
    setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(inviteEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check if member already exists
    if (members.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      setError('This user is already a member of the project');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onInviteMember(inviteEmail.trim(), inviteRole);
      handleInviteClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedMember) return;

    try {
      setLoading(true);
      setError(null);
      await onUpdateMemberRole(selectedMember.id, newRole);
      handleEditRoleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!selectedMember) return;

    try {
      setLoading(true);
      setError(null);
      await onRemoveMember(selectedMember.id);
      handleRemoveClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: ProjectMember['role']) => {
    switch (role) {
      case 'owner':
        return '#0077b6';
      case 'admin':
        return '#f57c00';
      case 'member':
        return '#2e7d32';
      default:
        return '#666';
    }
  };

  const getRoleLabel = (role: ProjectMember['role']) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'admin':
        return 'Admin';
      case 'member':
        return 'Member';
      default:
        return 'Unknown';
    }
  };

  const canEditMember = (member: ProjectMember) => {
    if (!canManageMembers) return false;
    if (member.id === currentUserId) return false; // Can't edit yourself
    if (member.role === 'owner' && currentUser?.role !== 'owner') return false; // Only owner can edit owner
    return true;
  };

  const canRemoveMember = (member: ProjectMember) => {
    if (!canManageMembers) return false;
    if (member.id === currentUserId) return false; // Can't remove yourself
    if (member.role === 'owner') return false; // Can't remove owner
    return true;
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Team Members ({members.length})
        </Typography>
        
        {canManageMembers && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleInviteClick}
            sx={{
              backgroundColor: '#0077b6',
              '&:hover': {
                backgroundColor: '#005a8b',
              },
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Invite Member
          </Button>
        )}
      </Box>

      {/* Members List */}
      <List sx={{ p: 0 }}>
        {members.map((member, index) => (
          <React.Fragment key={member.id}>
            <ListItem
              sx={{
                px: 0,
                py: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 119, 182, 0.04)',
                  borderRadius: 1,
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={member.avatar}
                  alt={`${member.name} avatar`}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#0077b6',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {member.name}
                      {member.id === currentUserId && (
                        <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          (You)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                }
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={getRoleLabel(member.role)}
                  size="small"
                  sx={{
                    backgroundColor: `${getRoleColor(member.role)}15`,
                    color: getRoleColor(member.role),
                    fontWeight: 500,
                    border: `1px solid ${getRoleColor(member.role)}30`,
                  }}
                />
                
                {(canEditMember(member) || canRemoveMember(member)) && (
                  <IconButton
                    onClick={(e) => handleMemberMenuClick(e, member)}
                    sx={{
                      color: '#0077b6',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 119, 182, 0.08)',
                      },
                    }}
                    aria-label={`Manage ${member.name}`}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              </Box>
            </ListItem>
            
            {index < members.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Member Actions Menu */}
      <Menu
        anchorEl={memberMenu.anchorEl}
        open={Boolean(memberMenu.anchorEl)}
        onClose={handleMemberMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {memberMenu.member && canEditMember(memberMenu.member) && (
          <MenuItem onClick={handleEditRoleClick}>
            <EditIcon sx={{ mr: 2, color: '#0077b6' }} />
            Edit Role
          </MenuItem>
        )}
        {memberMenu.member && canRemoveMember(memberMenu.member) && (
          <MenuItem onClick={handleRemoveClick} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 2 }} />
            Remove Member
          </MenuItem>
        )}
      </Menu>

      {/* Invite Member Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={handleInviteClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Invite Team Member
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            sx={{ mb: 3 }}
            disabled={loading}
          />
          
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={inviteRole}
              label="Role"
              onChange={(e) => setInviteRole(e.target.value as ProjectMember['role'])}
              disabled={loading}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              {currentUser?.role === 'owner' && (
                <MenuItem value="owner">Owner</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleInviteClose}
            disabled={loading}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInviteSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#0077b6',
              '&:hover': {
                backgroundColor: '#005a8b',
              },
              minWidth: 100,
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Invite'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={editRoleDialogOpen}
        onClose={handleEditRoleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Member Role
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {selectedMember && (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Change role for <strong>{selectedMember.name}</strong> ({selectedMember.email})
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newRole}
                  label="Role"
                  onChange={(e) => setNewRole(e.target.value as ProjectMember['role'])}
                  disabled={loading}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  {currentUser?.role === 'owner' && selectedMember.role !== 'owner' && (
                    <MenuItem value="owner">Owner</MenuItem>
                  )}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleEditRoleClose}
            disabled={loading}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleUpdate}
            variant="contained"
            disabled={loading || newRole === selectedMember?.role}
            sx={{
              backgroundColor: '#0077b6',
              '&:hover': {
                backgroundColor: '#005a8b',
              },
              minWidth: 100,
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={handleRemoveClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
            Remove Team Member
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {selectedMember && (
            <Typography variant="body1">
              Are you sure you want to remove <strong>{selectedMember.name}</strong> ({selectedMember.email}) from this project?
              <br /><br />
              This action cannot be undone. The member will lose access to all project data and tasks.
            </Typography>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleRemoveClose}
            disabled={loading}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveConfirm}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Remove Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectMembers;