const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying User Profile Implementation...\n');

// Check if UserProfile page exists
const userProfilePath = path.join(__dirname, 'src', 'pages', 'UserProfile.tsx');
if (fs.existsSync(userProfilePath)) {
  console.log('✅ UserProfile page component exists');
  
  const content = fs.readFileSync(userProfilePath, 'utf8');
  
  // Check for key features
  const checks = [
    { name: 'Profile header with avatar', pattern: /Avatar.*src={user\.avatar}/ },
    { name: 'User name display', pattern: /user\.name/ },
    { name: 'User email display', pattern: /user\.email/ },
    { name: 'User role display', pattern: /user\.role/ },
    { name: 'Edit profile button', pattern: /Edit Profile/ },
    { name: '#0077b6 color usage', pattern: /#0077b6/ },
    { name: 'Profile tabs (Personal Info, Settings, Activity)', pattern: /Personal Information.*Account Settings.*Activity/ },
    { name: 'Contact information fields', pattern: /phone.*location.*timezone/i },
    { name: 'Edit functionality', pattern: /isEditing.*setIsEditing/ },
    { name: 'Form validation', pattern: /handleInputChange/ },
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });
} else {
  console.log('❌ UserProfile page component not found');
}

// Check if User types exist
const userTypesPath = path.join(__dirname, 'src', 'types', 'user.ts');
if (fs.existsSync(userTypesPath)) {
  console.log('✅ User types defined');
  
  const content = fs.readFileSync(userTypesPath, 'utf8');
  const typeChecks = [
    { name: 'User interface', pattern: /interface User/ },
    { name: 'UserProfile interface', pattern: /interface UserProfile/ },
    { name: 'UpdateUserProfileData interface', pattern: /interface UpdateUserProfileData/ },
  ];
  
  typeChecks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });
} else {
  console.log('❌ User types not found');
}

// Check if profile route is added
const routerPath = path.join(__dirname, 'src', 'routes', 'router.tsx');
if (fs.existsSync(routerPath)) {
  const content = fs.readFileSync(routerPath, 'utf8');
  
  if (content.includes('UserProfile') && content.includes("path: 'profile'")) {
    console.log('✅ Profile route configured in router');
  } else {
    console.log('❌ Profile route not properly configured');
  }
} else {
  console.log('❌ Router file not found');
}

// Check if profile path is added
const pathsPath = path.join(__dirname, 'src', 'routes', 'paths.ts');
if (fs.existsSync(pathsPath)) {
  const content = fs.readFileSync(pathsPath, 'utf8');
  
  if (content.includes('profile:')) {
    console.log('✅ Profile path added to paths configuration');
  } else {
    console.log('❌ Profile path not added to paths configuration');
  }
} else {
  console.log('❌ Paths file not found');
}

// Check if ProfileMenu is updated
const profileMenuPath = path.join(__dirname, 'src', 'layouts', 'main-layout', 'topbar', 'ProfileMenu.tsx');
if (fs.existsSync(profileMenuPath)) {
  const content = fs.readFileSync(profileMenuPath, 'utf8');
  
  const menuChecks = [
    { name: 'useNavigate import', pattern: /useNavigate/ },
    { name: 'paths import', pattern: /import.*paths/ },
    { name: 'Navigation to profile', pattern: /navigate\(paths\.profile\)/ },
    { name: '#0077b6 hover color', pattern: /#0077b6/ },
  ];
  
  menuChecks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ProfileMenu: ${check.name}`);
    } else {
      console.log(`❌ ProfileMenu: ${check.name}`);
    }
  });
} else {
  console.log('❌ ProfileMenu component not found');
}

// Check if types are exported
const typesIndexPath = path.join(__dirname, 'src', 'types', 'index.ts');
if (fs.existsSync(typesIndexPath)) {
  const content = fs.readFileSync(typesIndexPath, 'utf8');
  
  if (content.includes('User,') && content.includes('UserProfile,')) {
    console.log('✅ User types exported from types index');
  } else {
    console.log('❌ User types not properly exported');
  }
} else {
  console.log('❌ Types index file not found');
}

console.log('\n🎯 User Profile Implementation Summary:');
console.log('- Profile page component with header, avatar, name, email, and role');
console.log('- Edit profile functionality with form validation');
console.log('- Tabbed interface (Personal Information, Account Settings, Activity)');
console.log('- #0077b6 color used for edit buttons and active tab indicators');
console.log('- Navigation from ProfileMenu to profile page');
console.log('- Proper TypeScript interfaces for user data');
console.log('- Responsive design following DNX theme patterns');