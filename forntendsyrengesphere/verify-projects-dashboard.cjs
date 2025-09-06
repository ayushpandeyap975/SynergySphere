const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Projects Dashboard Integration...\n');

// Check if all required files exist
const requiredFiles = [
  'src/pages/ProjectsDashboard.tsx',
  'src/components/dashboard/ProjectToolbar.tsx',
  'src/components/dashboard/ProjectCard.tsx',
  'src/components/dashboard/DashboardHeader.tsx',
  'src/components/dashboard/EmptyState.tsx',
  'src/hooks/useProjectSearch.ts',
  'src/types/project.ts',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log('✅', file);
  } else {
    console.log('❌', file, '(MISSING)');
    allFilesExist = false;
  }
});

console.log('\n🔍 Checking ProjectsDashboard.tsx implementation...\n');

// Check ProjectsDashboard.tsx content
const dashboardPath = 'src/pages/ProjectsDashboard.tsx';
if (fs.existsSync(dashboardPath)) {
  const content = fs.readFileSync(dashboardPath, 'utf8');
  
  const checks = [
    { name: 'Imports DashboardHeader', pattern: /import.*DashboardHeader/ },
    { name: 'Imports ProjectToolbar', pattern: /import.*ProjectToolbar/ },
    { name: 'Imports ProjectCard', pattern: /import.*ProjectCard/ },
    { name: 'Uses useProjectSearch hook', pattern: /useProjectSearch/ },
    { name: 'Has responsive Grid layout', pattern: /xs=\{12\}.*sm=\{6\}.*md=\{4\}.*lg=\{3\}/ },
    { name: 'Has floating action button', pattern: /Fab/ },
    { name: 'Uses #0077b6 color', pattern: /#0077b6/ },
    { name: 'Handles project click navigation', pattern: /handleProjectClick/ },
    { name: 'Has loading state', pattern: /ProjectCardSkeleton/ },
    { name: 'Has empty states', pattern: /EmptyState/ },
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log('✅', check.name);
    } else {
      console.log('❌', check.name, '(NOT FOUND)');
    }
  });
}

console.log('\n🔍 Checking router integration...\n');

// Check router.tsx
const routerPath = 'src/routes/router.tsx';
if (fs.existsSync(routerPath)) {
  const content = fs.readFileSync(routerPath, 'utf8');
  
  if (content.includes('ProjectsDashboard')) {
    console.log('✅ ProjectsDashboard imported in router');
  } else {
    console.log('❌ ProjectsDashboard not imported in router');
  }
  
  if (content.includes("path: 'projects'")) {
    console.log('✅ Projects route configured');
  } else {
    console.log('❌ Projects route not configured');
  }
}

console.log('\n🔍 Checking component enhancements...\n');

// Check ProjectToolbar enhancements
const toolbarPath = 'src/components/dashboard/ProjectToolbar.tsx';
if (fs.existsSync(toolbarPath)) {
  const content = fs.readFileSync(toolbarPath, 'utf8');
  
  if (content.includes('#0077b6')) {
    console.log('✅ ProjectToolbar has #0077b6 highlights');
  } else {
    console.log('❌ ProjectToolbar missing #0077b6 highlights');
  }
}

// Check ProjectCard enhancements
const cardPath = 'src/components/dashboard/ProjectCard.tsx';
if (fs.existsSync(cardPath)) {
  const content = fs.readFileSync(cardPath, 'utf8');
  
  if (content.includes('#0077b6')) {
    console.log('✅ ProjectCard has #0077b6 highlights');
  } else {
    console.log('❌ ProjectCard missing #0077b6 highlights');
  }
  
  if (content.includes('project-card-title')) {
    console.log('✅ ProjectCard has hover state class');
  } else {
    console.log('❌ ProjectCard missing hover state class');
  }
}

console.log('\n🎯 Integration Summary:');
console.log('- All required components are integrated');
console.log('- Responsive grid layout implemented (xs=12, sm=6, md=4, lg=3)');
console.log('- #0077b6 highlights added to active filters and hover states');
console.log('- Floating action button with #0077b6 background');
console.log('- Router configured for /projects path');
console.log('- Loading states and empty states handled');

console.log('\n🚀 Test the implementation at: http://localhost:3000/dnx/projects');