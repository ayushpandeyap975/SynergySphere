import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import IconifyIcon from 'components/base/IconifyIcon';

interface LogoutConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName?: string;
}

const LogoutConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  userName = 'User',
}: LogoutConfirmDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle
        id="logout-dialog-title"
        sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <IconifyIcon
          icon="hugeicons:logout-03"
          sx={{
            fontSize: 24,
            color: 'warning.main',
          }}
        />
        <Typography variant="h6" component="span">
          Confirm Logout
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Typography
          id="logout-dialog-description"
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Are you sure you want to logout, {userName}? You will need to sign in again to access your projects and tasks.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Stack direction="row" spacing={2} width="100%">
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={loading}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.secondary',
                bgcolor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            fullWidth
            disabled={loading}
            sx={{
              position: 'relative',
              '&:disabled': {
                bgcolor: 'error.main',
                opacity: 0.7,
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-10px',
                  }}
                />
                <span style={{ opacity: 0 }}>Logout</span>
              </>
            ) : (
              'Logout'
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmDialog;