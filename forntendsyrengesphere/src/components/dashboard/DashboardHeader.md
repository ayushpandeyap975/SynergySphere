# DashboardHeader Component

## Overview

The `DashboardHeader` component provides a consistent header for the Projects Dashboard, featuring app branding and user menu functionality. It follows the DNX theme design system and includes comprehensive accessibility support.

## Features

### ✅ App Branding
- **SynergySphere** title with h4 typography
- **Projects Dashboard** subtitle (responsive - hidden on mobile)
- Consistent DNX theme styling

### ✅ User Menu
- Avatar button with user image
- Dropdown menu with profile and logout options
- User information display (name and email)
- Proper menu interaction handling

### ✅ Accessibility (WCAG 2.1 AA Compliant)
- **ARIA Labels**: `aria-label`, `aria-controls`, `aria-expanded`, `aria-haspopup`
- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys, Escape
- **Focus Management**: Visible focus indicators with primary color outline
- **Screen Reader Support**: Semantic HTML structure and descriptive labels
- **Role Attributes**: `banner`, `menu`, `menuitem` roles

### ✅ DNX Theme Integration
- Uses DNX color palette (`primary.main`, `text.primary`, `text.secondary`)
- DNX typography scale (`h4`, `body2`, `caption`)
- DNX spacing system (`theme.spacing()`)
- DNX Material-UI components

### ✅ Responsive Design
- **Desktop**: Full branding and user name display
- **Mobile**: Compact layout with hidden user name
- **Touch Targets**: 40px avatar size for proper touch interaction

## Props Interface

```typescript
interface DashboardHeaderProps {
  userName?: string;        // Default: 'Alex Stanton'
  userEmail?: string;       // Default: 'alex@example.com'
  userAvatar?: string;      // Default: Avatar3 from data/images
  onProfileClick?: () => void;  // Profile menu item callback
  onLogoutClick?: () => void;   // Logout menu item callback
}
```

## Usage Examples

### Basic Usage
```tsx
import { DashboardHeader } from 'components/dashboard';

const Dashboard = () => {
  return (
    <div>
      <DashboardHeader />
      {/* Dashboard content */}
    </div>
  );
};
```

### With Custom Props
```tsx
import { DashboardHeader } from 'components/dashboard';

const Dashboard = () => {
  const handleProfileClick = () => {
    // Navigate to profile page
    router.push('/profile');
  };

  const handleLogoutClick = () => {
    // Handle logout logic
    authService.logout();
    router.push('/login');
  };

  return (
    <div>
      <DashboardHeader
        userName="John Doe"
        userEmail="john.doe@company.com"
        userAvatar="/path/to/avatar.jpg"
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
      />
      {/* Dashboard content */}
    </div>
  );
};
```

## Accessibility Testing

### Keyboard Navigation Test
1. **Tab** to the user avatar button
2. **Enter** or **Space** to open the menu
3. **Arrow keys** to navigate menu items
4. **Enter** to select a menu item
5. **Escape** to close the menu

### Screen Reader Test
- Header is announced as "Dashboard header"
- Avatar button is announced as "User menu for [username]"
- Menu items are properly announced with their labels
- User information is read correctly

## Component Structure

```
DashboardHeader
├── Stack (Header Container)
│   ├── Stack (App Branding)
│   │   ├── Typography (SynergySphere)
│   │   └── Typography (Projects Dashboard)
│   └── Stack (User Menu)
│       ├── Stack (User Name - Desktop Only)
│       ├── ButtonBase (Avatar Button)
│       │   └── Avatar (User Avatar)
│       └── Menu (Dropdown Menu)
│           ├── Box (User Info Section)
│           │   └── MenuItem (User Details)
│           ├── Divider
│           └── Box (Menu Actions)
│               ├── MenuItem (View Profile)
│               └── MenuItem (Logout)
```

## Styling Details

### Colors
- **Header Background**: `info.lighter` (white)
- **Border**: `info.main` (light gray)
- **Text Primary**: `text.primary` (#141522)
- **Text Secondary**: `text.secondary` (#54577A)
- **Focus Outline**: `primary.main` (#546FFF)

### Typography
- **App Title**: h4 variant, 600 weight
- **Subtitle**: body2 variant, regular weight
- **User Name**: body2 variant, 500 weight
- **Menu Items**: body2 variant, 500 weight

### Spacing
- **Header Padding**: 24px horizontal, 16px vertical
- **Menu Width**: 220px
- **Avatar Size**: 40px
- **Menu Item Padding**: 8px vertical

## Requirements Compliance

This component addresses the following requirements from the specification:

- **Requirement 7.1**: ✅ Dashboard displays header with user menu
- **Requirement 7.2**: ✅ User menu shows profile and logout options
- **Requirement 7.3**: ✅ Logout functionality clears session data
- **Requirement 6.1**: ✅ Visible focus indicators for keyboard navigation
- **Requirement 6.2**: ✅ Appropriate ARIA labels and semantic HTML
- **Requirement 6.3**: ✅ Form inputs associated with labels (menu items)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- Component uses React.useState for menu state management
- No unnecessary re-renders with proper event handler memoization
- Lightweight with minimal DOM elements
- Efficient focus management

## Future Enhancements

- [ ] User avatar upload functionality
- [ ] Notification badge integration
- [ ] Theme switcher integration
- [ ] Multi-language support
- [ ] User status indicator (online/offline)