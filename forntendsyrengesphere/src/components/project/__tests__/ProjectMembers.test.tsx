import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ProjectMembers from '../ProjectMembers';
import { ProjectMember } from '../../../types/project';

const theme = createTheme();

const mockMembers: ProjectMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'owner',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    avatar: 'https://i.pravatar.cc/40?img=3',
  },
];

const mockProps = {
  members: mockMembers,
  currentUserId: '1',
  onInviteMember: jest.fn(),
  onUpdateMemberRole: jest.fn(),
  onRemoveMember: jest.fn(),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ProjectMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders member list correctly', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    expect(screen.getByText('Team Members (3)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('mike@example.com')).toBeInTheDocument();
  });

  it('displays member roles correctly', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Member')).toBeInTheDocument();
  });

  it('shows current user indicator', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    expect(screen.getByText('(You)')).toBeInTheDocument();
  });

  it('shows invite button for users with management permissions', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    expect(screen.getByText('Invite Member')).toBeInTheDocument();
  });

  it('hides invite button for users without management permissions', () => {
    const propsWithoutPermissions = {
      ...mockProps,
      currentUserId: '3', // Regular member
    };
    
    renderWithTheme(<ProjectMembers {...propsWithoutPermissions} />);
    
    expect(screen.queryByText('Invite Member')).not.toBeInTheDocument();
  });

  it('opens invite dialog when invite button is clicked', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    fireEvent.click(screen.getByText('Invite Member'));
    
    expect(screen.getByText('Invite Team Member')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('validates email format in invite dialog', async () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    fireEvent.click(screen.getByText('Invite Member'));
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    fireEvent.click(screen.getByText('Send Invite'));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('prevents inviting existing members', async () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    fireEvent.click(screen.getByText('Invite Member'));
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    fireEvent.click(screen.getByText('Send Invite'));
    
    await waitFor(() => {
      expect(screen.getByText('This user is already a member of the project')).toBeInTheDocument();
    });
  });

  it('calls onInviteMember when valid invitation is submitted', async () => {
    const mockInvite = jest.fn().mockResolvedValue(undefined);
    const props = { ...mockProps, onInviteMember: mockInvite };
    
    renderWithTheme(<ProjectMembers {...props} />);
    
    fireEvent.click(screen.getByText('Invite Member'));
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    fireEvent.click(screen.getByText('Send Invite'));
    
    await waitFor(() => {
      expect(mockInvite).toHaveBeenCalledWith('new@example.com', 'member');
    });
  });

  it('shows member action menu for manageable members', () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    // Find the menu button for Jane Smith (admin, can be managed by owner)
    const menuButtons = screen.getAllByLabelText(/Manage/);
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it('opens edit role dialog when edit role is clicked', async () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    // Click on menu for Jane Smith
    const menuButtons = screen.getAllByLabelText(/Manage/);
    fireEvent.click(menuButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Role')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Edit Role'));
    
    await waitFor(() => {
      expect(screen.getByText('Edit Member Role')).toBeInTheDocument();
    });
  });

  it('opens remove member dialog when remove is clicked', async () => {
    renderWithTheme(<ProjectMembers {...mockProps} />);
    
    // Click on menu for Mike Johnson (member, can be removed)
    const menuButtons = screen.getAllByLabelText(/Manage/);
    fireEvent.click(menuButtons[1]); // Second menu button should be for Mike
    
    await waitFor(() => {
      expect(screen.getByText('Remove Member')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Remove Member'));
    
    await waitFor(() => {
      expect(screen.getByText('Remove Team Member')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    });
  });

  it('calls onUpdateMemberRole when role is updated', async () => {
    const mockUpdateRole = jest.fn().mockResolvedValue(undefined);
    const props = { ...mockProps, onUpdateMemberRole: mockUpdateRole };
    
    renderWithTheme(<ProjectMembers {...props} />);
    
    // Open menu and click edit role
    const menuButtons = screen.getAllByLabelText(/Manage/);
    fireEvent.click(menuButtons[0]);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit Role'));
    });
    
    // Change role and submit
    await waitFor(() => {
      const roleSelect = screen.getByLabelText('Role');
      fireEvent.mouseDown(roleSelect);
    });
    
    fireEvent.click(screen.getByText('Member'));
    fireEvent.click(screen.getByText('Update Role'));
    
    await waitFor(() => {
      expect(mockUpdateRole).toHaveBeenCalledWith('2', 'member');
    });
  });

  it('calls onRemoveMember when member removal is confirmed', async () => {
    const mockRemove = jest.fn().mockResolvedValue(undefined);
    const props = { ...mockProps, onRemoveMember: mockRemove };
    
    renderWithTheme(<ProjectMembers {...props} />);
    
    // Open menu and click remove
    const menuButtons = screen.getAllByLabelText(/Manage/);
    fireEvent.click(menuButtons[1]);
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Remove Member'));
    });
    
    // Confirm removal
    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: 'Remove Member' });
      fireEvent.click(removeButton);
    });
    
    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith('3');
    });
  });
});