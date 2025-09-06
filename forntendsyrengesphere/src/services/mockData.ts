/**
 * Mock data service for development
 * Provides realistic project data for testing and development
 */

import { 
  Project, 
  ProjectMember, 
  ProjectsResponse, 
  CreateProjectRequest, 
  CreateProjectResponse 
} from '../types';

// Mock project members data
const mockMembers: ProjectMember[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'owner',
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'admin',
  },
  {
    id: '3',
    email: 'mike.johnson@company.com',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'member',
  },
  {
    id: '4',
    email: 'sarah.wilson@company.com',
    name: 'Sarah Wilson',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'member',
  },
  {
    id: '5',
    email: 'david.brown@company.com',
    name: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'admin',
  },
];

// Initial mock projects data (for reset functionality)
const initialMockProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform Redesign',
    description: 'Complete overhaul of the customer-facing e-commerce platform with modern UI/UX and improved performance.',
    memberCount: 8,
    doneTasks: 23,
    totalTasks: 45,
    updatedAt: '2024-12-15T10:30:00Z',
    createdAt: '2024-11-01T09:00:00Z',
    members: [mockMembers[0], mockMembers[1], mockMembers[2]],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms with offline capabilities.',
    memberCount: 6,
    doneTasks: 12,
    totalTasks: 28,
    updatedAt: '2024-12-14T16:45:00Z',
    createdAt: '2024-11-15T14:20:00Z',
    members: [mockMembers[1], mockMembers[3], mockMembers[4]],
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence and reporting.',
    memberCount: 4,
    doneTasks: 18,
    totalTasks: 22,
    updatedAt: '2024-12-13T11:15:00Z',
    createdAt: '2024-10-20T08:30:00Z',
    members: [mockMembers[0], mockMembers[4]],
  },
  {
    id: '4',
    name: 'API Gateway Migration',
    description: 'Migration of legacy API services to modern microservices architecture.',
    memberCount: 5,
    doneTasks: 8,
    totalTasks: 35,
    updatedAt: '2024-12-12T09:20:00Z',
    createdAt: '2024-12-01T10:00:00Z',
    members: [mockMembers[2], mockMembers[3], mockMembers[4]],
  },
  {
    id: '5',
    name: 'Customer Support Portal',
    description: 'Self-service customer support portal with ticketing system and knowledge base.',
    memberCount: 7,
    doneTasks: 31,
    totalTasks: 38,
    updatedAt: '2024-12-11T14:30:00Z',
    createdAt: '2024-09-15T12:00:00Z',
    members: [mockMembers[0], mockMembers[1], mockMembers[3]],
  },
  {
    id: '6',
    name: 'Security Audit Implementation',
    description: 'Implementation of security recommendations from recent audit including authentication improvements.',
    memberCount: 3,
    doneTasks: 5,
    totalTasks: 15,
    updatedAt: '2024-12-10T13:45:00Z',
    createdAt: '2024-12-05T09:15:00Z',
    members: [mockMembers[1], mockMembers[4]],
  },
];

// Mock projects data (mutable for testing)
const mockProjects: Project[] = [...initialMockProjects.map(project => ({ ...project }))];

// Simulate API delay
const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate random failures for testing error handling
const shouldSimulateError = (): boolean => {
  return Math.random() < 0.1; // 10% chance of error
};

/**
 * Mock function to fetch all projects
 * @returns Promise with projects response
 */
export const fetchProjectsMock = async (): Promise<ProjectsResponse> => {
  await simulateDelay();
  
  if (shouldSimulateError()) {
    throw {
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    };
  }

  return {
    projects: mockProjects,
    total: mockProjects.length,
  };
};

/**
 * Mock function to create a new project
 * @param projectData - Project creation data
 * @returns Promise with created project response
 */
export const createProjectMock = async (
  projectData: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  await simulateDelay(1200); // Longer delay for creation
  
  if (shouldSimulateError()) {
    throw {
      response: {
        status: 400,
        data: { message: 'Project name already exists' },
      },
    };
  }

  // Convert member emails to ProjectMember objects
  const projectMembers: ProjectMember[] = [mockMembers[0]]; // Creator as owner
  
  if (projectData.members && projectData.members.length > 0) {
    const additionalMembers = projectData.members.map((email, index) => ({
      id: `new-${Date.now()}-${index}`,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'member' as const,
    }));
    projectMembers.push(...additionalMembers);
  }

  // Create new project with mock data
  const newProject: Project = {
    id: `${mockProjects.length + 1}`,
    name: projectData.name,
    description: projectData.description || '',
    memberCount: projectMembers.length,
    doneTasks: 0,
    totalTasks: 0,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    members: projectMembers,
  };

  // Add to mock data (in real app, this would be handled by backend)
  mockProjects.unshift(newProject);

  return {
    project: newProject,
    success: true,
    message: 'Project created successfully',
  };
};

/**
 * Mock function to fetch a single project by ID
 * @param projectId - The project ID
 * @returns Promise with project data
 */
export const fetchProjectMock = async (projectId: string): Promise<Project> => {
  await simulateDelay();
  
  if (shouldSimulateError()) {
    throw {
      response: {
        status: 404,
        data: { message: 'Project not found' },
      },
    };
  }

  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    throw {
      response: {
        status: 404,
        data: { message: 'Project not found' },
      },
    };
  }

  return project;
};

/**
 * Mock function to update a project
 * @param projectId - The project ID
 * @param updateData - Partial project data to update
 * @returns Promise with updated project
 */
export const updateProjectMock = async (
  projectId: string,
  updateData: Partial<CreateProjectRequest>
): Promise<Project> => {
  await simulateDelay();
  
  if (shouldSimulateError()) {
    throw {
      response: {
        status: 500,
        data: { message: 'Failed to update project' },
      },
    };
  }

  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) {
    throw {
      response: {
        status: 404,
        data: { message: 'Project not found' },
      },
    };
  }

  // Prepare update data with proper type conversion
  const { members: memberEmails, ...otherUpdateData } = updateData;
  
  // Convert member emails to ProjectMember objects if provided
  let updatedMembers: ProjectMember[] | undefined;
  if (memberEmails && memberEmails.length > 0) {
    updatedMembers = memberEmails.map((email, index) => ({
      id: `temp-${Date.now()}-${index}`,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'member' as const,
    }));
  }

  // Update project data with proper typing
  const updatedProject: Project = {
    ...mockProjects[projectIndex],
    ...otherUpdateData,
    ...(updatedMembers && { 
      members: updatedMembers,
      memberCount: updatedMembers.length 
    }),
    updatedAt: new Date().toISOString(),
  };

  mockProjects[projectIndex] = updatedProject;
  return updatedProject;
};

/**
 * Mock function to delete a project
 * @param projectId - The project ID
 * @returns Promise with success confirmation
 */
export const deleteProjectMock = async (projectId: string): Promise<void> => {
  await simulateDelay();
  
  if (shouldSimulateError()) {
    throw {
      response: {
        status: 500,
        data: { message: 'Failed to delete project' },
      },
    };
  }

  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) {
    throw {
      response: {
        status: 404,
        data: { message: 'Project not found' },
      },
    };
  }

  mockProjects.splice(projectIndex, 1);
};

/**
 * Get mock projects for direct access (useful for testing)
 * @returns Array of mock projects
 */
export const getMockProjects = (): Project[] => {
  return [...mockProjects];
};

/**
 * Reset mock data to initial state (useful for testing)
 */
export const resetMockData = (): void => {
  // Clear current mock projects and restore initial data
  mockProjects.length = 0;
  mockProjects.push(...initialMockProjects.map(project => ({ ...project })));
};