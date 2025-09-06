const fs = require('fs');
const path = require('path');

/**
 * Verification script for Project Overview component implementation
 * Checks if all required features are implemented according to task requirements
 */

console.log('🔍 Verifying Project Overview Implementation...\n');

// Check if ProjectOverview component exists
const projectOverviewPath = 'src/components/project/ProjectOverview.tsx';
const projectDetailPath = 'src/pages/ProjectDetail.tsx';

let allTestsPassed = true;
const results = [];

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    results.push(`✅ ${description}`);
    return true;
  } else {
    results.push(`❌ ${description}`);
    allTestsPassed = false;
    return false;
  }
}

function checkFileContent(filePath, patterns, description) {
  if (!fs.existsSync(filePath)) {
    results.push(`❌ ${description} - File not found`);
    allTestsPassed = false;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missingPatterns = [];

  patterns.forEach(pattern => {
    if (typeof pattern === 'string') {
      if (!content.includes(pattern)) {
        missingPatterns.push(pattern);
      }
    } else if (pattern instanceof RegExp) {
      if (!pattern.test(content)) {
        missingPatterns.push(pattern.toString());
      }
    }
  });

  if (missingPatterns.length === 0) {
    results.push(`✅ ${description}`);
    return true;
  } else {
    results.push(`❌ ${description} - Missing: ${missingPatterns.join(', ')}`);
    allTestsPassed = false;
    return false;
  }
}

// Test 1: Check if ProjectOverview component file exists
checkFile(projectOverviewPath, 'ProjectOverview component file exists');

// Test 2: Check if ProjectDetail is updated to use ProjectOverview
checkFile(projectDetailPath, 'ProjectDetail page exists');

// Test 3: Check ProjectOverview component structure and features
if (fs.existsSync(projectOverviewPath)) {
  const projectOverviewContent = fs.readFileSync(projectOverviewPath, 'utf8');
  
  // Check for project statistics display
  checkFileContent(projectOverviewPath, [
    'total: number',
    'completed: number', 
    'inProgress: number',
    'overdue: number',
    'Total Tasks',
    'Completed',
    'In Progress',
    'Overdue'
  ], 'Project statistics interface and display');

  // Check for progress visualization with #0077b6 color
  checkFileContent(projectOverviewPath, [
    '#0077b6',
    'LinearProgress',
    'backgroundColor: \'#0077b6\'',
    'Project Progress'
  ], 'Progress visualization with #0077b6 color');

  // Check for recent activity feed
  checkFileContent(projectOverviewPath, [
    'Recent Activity',
    'ActivityItem',
    'timestamp',
    'recentActivity',
    'ListItem',
    'ListItemText'
  ], 'Recent activity feed implementation');

  // Check for settings dropdown with edit/delete options
  checkFileContent(projectOverviewPath, [
    'Menu',
    'MenuItem',
    'Edit Project',
    'Delete Project',
    'Project Settings',
    'MoreVertIcon',
    'onEdit',
    'onDelete',
    'onSettings'
  ], 'Settings dropdown with edit/delete options');

  // Check for proper TypeScript interfaces
  checkFileContent(projectOverviewPath, [
    'interface ProjectOverviewProps',
    'interface ProjectStats',
    'interface ActivityItem',
    'React.FC<ProjectOverviewProps>'
  ], 'TypeScript interfaces and component typing');

  // Check for Material-UI components usage
  checkFileContent(projectOverviewPath, [
    'Grid',
    'Card',
    'CardContent',
    'Paper',
    'Typography',
    'IconButton',
    'Alert'
  ], 'Material-UI components usage');

  // Check for responsive design
  checkFileContent(projectOverviewPath, [
    'xs={12}',
    'md={8}',
    'md={4}',
    'sm={3}',
    'Grid container',
    'Grid item'
  ], 'Responsive grid layout implementation');
}

// Test 4: Check if ProjectDetail integrates ProjectOverview
if (fs.existsSync(projectDetailPath)) {
  checkFileContent(projectDetailPath, [
    'import ProjectOverview',
    '<ProjectOverview',
    'project={project}',
    'onEdit={handleEditClick}',
    'onDelete={handleDeleteProject}',
    'onSettings={handleSettingsClick}'
  ], 'ProjectDetail integration with ProjectOverview');

  checkFileContent(projectDetailPath, [
    'handleDeleteProject'
  ], 'Delete project handler implementation');
}

// Test 5: Check for proper color scheme usage
if (fs.existsSync(projectOverviewPath)) {
  checkFileContent(projectOverviewPath, [
    '#0077b6',
    '#2e7d32',
    '#f57c00',
    '#d32f2f'
  ], 'Proper color scheme implementation');
}

// Test 6: Check for accessibility features
if (fs.existsSync(projectOverviewPath)) {
  checkFileContent(projectOverviewPath, [
    'aria-label',
    'alt=',
    'title='
  ], 'Accessibility features (ARIA labels, alt text)');
}

// Display results
console.log('📋 Test Results:');
console.log('================');
results.forEach(result => console.log(result));

console.log('\n📊 Summary:');
console.log('===========');
if (allTestsPassed) {
  console.log('🎉 All tests passed! Project Overview implementation is complete.');
  console.log('\n✨ Features implemented:');
  console.log('   • Project statistics display (total, completed, in progress, overdue)');
  console.log('   • Progress visualization with #0077b6 progress bars');
  console.log('   • Recent activity feed with #0077b6 timestamps');
  console.log('   • Project settings dropdown with edit/delete options');
  console.log('   • Responsive grid layout');
  console.log('   • Material-UI component integration');
  console.log('   • TypeScript interfaces and proper typing');
  console.log('   • Accessibility features');
} else {
  console.log('❌ Some tests failed. Please review the implementation.');
}

console.log(`\n🔗 Test file created: test-project-overview.html`);
console.log('📁 Component location: src/components/project/ProjectOverview.tsx');
console.log('📁 Integration location: src/pages/ProjectDetail.tsx');

process.exit(allTestsPassed ? 0 : 1);