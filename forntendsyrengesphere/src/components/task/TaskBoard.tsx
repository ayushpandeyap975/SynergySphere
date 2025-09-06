import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Skeleton,
  Fab,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Task, TaskStatus, KanbanColumn, CreateTaskData, TaskActivity, TaskPriority } from '../../types/task';
import { ProjectMember } from '../../types/project';
import TaskCard from './TaskCard';
import TaskFilterToolbar, { TaskFilters, TaskSortOption } from './TaskFilterToolbar';
import TaskCreateModal from './TaskCreateModal';
import TaskDetailModal from './TaskDetailModal';
import { filterAndSortTasks } from '../../utils/taskFilters';
import {
  createTaskStatusChangeActivity,
  createTaskPriorityChangeActivity,
  createTaskAssignmentActivity,
  createTaskCompletionActivity,
  createTaskCreatedActivity,
} from '../../utils/taskActivity';

interface TaskBoardProps {
  projectId: string;
  loading?: boolean;
  projectMembers?: ProjectMember[];
}

/**
 * TaskBoard Component
 * Implements a Kanban-style board with drag-and-drop functionality
 */
const TaskBoard: React.FC<TaskBoardProps> = ({ 
  projectId, 
  loading = false, 
  projectMembers = [] 
}) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [taskActivities, setTaskActivities] = useState<Record<string, TaskActivity[]>>({});
  
  // Filter and sort state
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    assignee: 'all',
    priority: 'all',
    dueDate: 'all',
  });
  const [sortBy, setSortBy] = useState<TaskSortOption>('due_date');
  
  // Task creation modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  // Task detail modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Initialize tasks with mock data
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design user authentication flow',
        description: 'Create wireframes and mockups for login/signup process',
        status: 'todo',
        priority: 'high',
        assigneeId: '1',
        assigneeName: 'John Doe',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=1',
        dueDate: '2024-12-20',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        projectId,
      },
      {
        id: '2',
        title: 'Implement API endpoints',
        description: 'Create REST API for user management',
        status: 'todo',
        priority: 'medium',
        assigneeId: '2',
        assigneeName: 'Jane Smith',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=2',
        dueDate: '2024-12-22',
        createdAt: '2024-12-15T11:00:00Z',
        updatedAt: '2024-12-15T11:00:00Z',
        projectId,
      },
      {
        id: '3',
        title: 'Set up database schema',
        description: 'Design and implement database tables',
        status: 'in_progress',
        priority: 'high',
        assigneeId: '3',
        assigneeName: 'Mike Johnson',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=3',
        dueDate: '2024-12-18',
        createdAt: '2024-12-14T09:00:00Z',
        updatedAt: '2024-12-15T14:00:00Z',
        projectId,
      },
      {
        id: '4',
        title: 'Write unit tests',
        description: 'Create comprehensive test suite',
        status: 'in_progress',
        priority: 'medium',
        assigneeId: '4',
        assigneeName: 'Sarah Wilson',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=4',
        createdAt: '2024-12-13T15:00:00Z',
        updatedAt: '2024-12-15T16:00:00Z',
        projectId,
      },
      {
        id: '5',
        title: 'Deploy to staging',
        description: 'Set up staging environment and deploy',
        status: 'done',
        priority: 'low',
        assigneeId: '5',
        assigneeName: 'Tom Brown',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=5',
        createdAt: '2024-12-12T10:00:00Z',
        updatedAt: '2024-12-14T12:00:00Z',
        projectId,
      },
      {
        id: '6',
        title: 'Fix responsive layout issues',
        description: 'Address mobile and tablet layout problems',
        status: 'todo',
        priority: 'low',
        assigneeId: '1',
        assigneeName: 'John Doe',
        assigneeAvatar: 'https://i.pravatar.cc/40?img=1',
        dueDate: '2024-12-16',
        createdAt: '2024-12-14T08:00:00Z',
        updatedAt: '2024-12-14T08:00:00Z',
        projectId,
      },
      {
        id: '7',
        title: 'Update documentation',
        description: 'Update API documentation and user guides',
        status: 'todo',
        priority: 'medium',
        createdAt: '2024-12-13T14:00:00Z',
        updatedAt: '2024-12-13T14:00:00Z',
        projectId,
      },
    ];

    setAllTasks(mockTasks);
    
    // Initialize activities for existing tasks
    const initialActivities: Record<string, TaskActivity[]> = {};
    mockTasks.forEach(task => {
      initialActivities[task.id] = [
        createTaskCreatedActivity(task.id, task.title, '1', 'System', undefined)
      ];
    });
    setTaskActivities(initialActivities);
  }, [projectId]);

  // Apply filters and sorting to tasks, then organize into columns
  const filteredAndSortedTasks = useMemo(() => {
    return filterAndSortTasks(allTasks, filters, sortBy);
  }, [allTasks, filters, sortBy]);

  // Update columns when filtered tasks change
  useEffect(() => {
    const updatedColumns: KanbanColumn[] = [
      {
        id: 'todo',
        title: 'To Do',
        tasks: filteredAndSortedTasks.filter(task => task.status === 'todo'),
        color: '#0077b6',
      },
      {
        id: 'in_progress',
        title: 'In Progress',
        tasks: filteredAndSortedTasks.filter(task => task.status === 'in_progress'),
        color: '#0077b6',
      },
      {
        id: 'done',
        title: 'Done',
        tasks: filteredAndSortedTasks.filter(task => task.status === 'done'),
        color: '#0077b6',
      },
    ];

    setColumns(updatedColumns);
  }, [filteredAndSortedTasks]);



  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const oldStatus = draggedTask.status;
    
    // Update task status in the main tasks array
    const updatedTask = { ...draggedTask, status: targetStatus, updatedAt: new Date().toISOString() };
    
    setAllTasks(prevTasks => {
      return prevTasks.map(task => 
        task.id === draggedTask.id ? updatedTask : task
      );
    });

    // Add activity for status change
    const activity = createTaskStatusChangeActivity(
      draggedTask.id,
      draggedTask.title,
      oldStatus,
      targetStatus,
      '1', // Current user ID (would come from auth context in real app)
      'Current User', // Current user name (would come from auth context in real app)
      undefined
    );

    setTaskActivities(prev => ({
      ...prev,
      [draggedTask.id]: [...(prev[draggedTask.id] || []), activity]
    }));

    setDraggedTask(null);
  };

  const handleTaskPriorityChange = async (taskId: string, priority: TaskPriority) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;

      const oldPriority = task.priority;
      
      const updates: Partial<Task> = {
        priority,
        updatedAt: new Date().toISOString(),
      };
      
      await handleTaskUpdate(taskId, updates);

      // Add activity for priority change
      const activity = createTaskPriorityChangeActivity(
        taskId,
        task.title,
        oldPriority,
        priority,
        '1', // Current user ID
        'Current User', // Current user name
        undefined
      );

      setTaskActivities(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), activity]
      }));

      console.log('Task priority changed:', taskId, priority);
    } catch (error) {
      console.error('Failed to change task priority:', error);
      throw error;
    }
  };

  const handleTaskCompletion = async (taskId: string) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;
      
      const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
      const completed = newStatus === 'done';
      
      await handleTaskStatusChange(taskId, newStatus);

      // Add activity for completion
      const activity = createTaskCompletionActivity(
        taskId,
        task.title,
        completed,
        '1', // Current user ID
        'Current User', // Current user name
        undefined
      );

      setTaskActivities(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), activity]
      }));

      console.log('Task completion toggled:', taskId, newStatus);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      throw error;
    }
  };

  const handleTaskEdit = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDetailModalOpen(true);
    }
  };

  const handleTaskAssign = async (taskId: string, assigneeId?: string) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;

      const assignee = assigneeId 
        ? projectMembers.find(member => member.id === assigneeId)
        : undefined;
      
      const updates: Partial<Task> = {
        assigneeId: assignee?.id,
        assigneeName: assignee?.name,
        assigneeAvatar: assignee?.avatar,
        updatedAt: new Date().toISOString(),
      };
      
      await handleTaskUpdate(taskId, updates);

      // Add activity for assignment change
      const activity = createTaskAssignmentActivity(
        taskId,
        task.title,
        assignee?.name,
        task.assigneeName,
        '1', // Current user ID
        'Current User', // Current user name
        undefined
      );

      setTaskActivities(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), activity]
      }));

      console.log('Task assigned:', taskId, assignee?.name || 'Unassigned');
    } catch (error) {
      console.error('Failed to assign task:', error);
      throw error;
    }
  };

  const handleTaskClick = (taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDetailModalOpen(true);
    }
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy: TaskSortOption) => {
    setSortBy(newSortBy);
  };

  const handleCreateTask = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const handleCreateTaskSubmit = async (taskData: CreateTaskData) => {
    setCreateLoading(true);
    try {
      // Generate a new task ID (in real app, this would come from the API)
      const newTaskId = `task_${Date.now()}`;
      
      // Find assignee details if assigneeId is provided
      const assignee = taskData.assigneeId 
        ? projectMembers.find(member => member.id === taskData.assigneeId)
        : undefined;
      
      // Create new task object
      const newTask: Task = {
        id: newTaskId,
        title: taskData.title,
        description: taskData.description,
        status: 'todo', // New tasks start in 'todo' column
        priority: taskData.priority,
        assigneeId: assignee?.id,
        assigneeName: assignee?.name,
        assigneeAvatar: assignee?.avatar,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId: taskData.projectId,
      };

      // Add the new task to the tasks list
      setAllTasks(prevTasks => [newTask, ...prevTasks]);

      // Add activity for task creation
      const activity = createTaskCreatedActivity(
        newTaskId,
        taskData.title,
        '1', // Current user ID
        'Current User', // Current user name
        undefined
      );

      setTaskActivities(prev => ({
        ...prev,
        [newTaskId]: [activity]
      }));
      
      // In a real application, you would make an API call here:
      // await createTask(taskData);
      
      console.log('Task created:', newTask);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    setDetailLoading(true);
    try {
      // Update task in the tasks list
      setAllTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
      
      // Update selected task if it's the one being updated
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
      
      // In a real application, you would make an API call here:
      // await updateTask(taskId, updates);
      
      console.log('Task updated:', taskId, updates);
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    setDetailLoading(true);
    try {
      // Remove task from the tasks list
      setAllTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // In a real application, you would make an API call here:
      // await deleteTask(taskId);
      
      console.log('Task deleted:', taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    setDetailLoading(true);
    try {
      // Update task status in the tasks list
      setAllTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status, updatedAt: new Date().toISOString() }
            : task
        )
      );
      
      // Update selected task if it's the one being updated
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
      }
      
      // In a real application, you would make an API call here:
      // await updateTaskStatus(taskId, status);
      
      console.log('Task status updated:', taskId, status);
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: 'text.primary' 
          }}
        >
          Task Board
        </Typography>
        
        {/* Loading state for filter toolbar */}
        <Skeleton variant="rectangular" height={80} sx={{ mb: 3, borderRadius: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
          {[1, 2, 3].map((index) => (
            <Box key={index} sx={{ minWidth: 320, flex: '0 0 auto' }}>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
              {[1, 2, 3].map((cardIndex) => (
                <Skeleton 
                  key={cardIndex} 
                  variant="rectangular" 
                  height={120} 
                  sx={{ mb: 2, borderRadius: 1 }} 
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: 'text.primary' 
        }}
      >
        Task Board
      </Typography>

      {/* Task Filter Toolbar */}
      <TaskFilterToolbar
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        projectMembers={projectMembers}
        taskCount={filteredAndSortedTasks.length}
      />

      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          overflowX: 'auto',
          pb: 2,
          minHeight: '60vh'
        }}
      >
        {columns.map((column) => (
          <Paper
            key={column.id}
            elevation={1}
            sx={{
              minWidth: 320,
              flex: '0 0 auto',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 2,
                backgroundColor: column.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography 
                variant="h6" 
                component="h3"
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {column.title}
              </Typography>
              <Chip
                label={column.tasks.length}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                  minWidth: 24,
                  height: 24,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            </Box>

            {/* Column Content */}
            <Box sx={{ p: 2, minHeight: 400 }}>
              {column.tasks.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 200,
                    color: 'text.secondary',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2">
                    No tasks in {column.title.toLowerCase()}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      draggable
                      onDragStart={handleDragStart}
                      onClick={handleTaskClick}
                      onEdit={handleTaskEdit}
                      onDelete={(taskId) => handleTaskDelete(taskId)}
                      onAssign={handleTaskAssign}
                      onPriorityChange={handleTaskPriorityChange}
                      onComplete={handleTaskCompletion}
                      projectMembers={projectMembers}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Floating Action Button for Creating Tasks */}
      <Tooltip title="Create New Task" placement="left">
        <Fab
          color="primary"
          onClick={handleCreateTask}
          disabled={loading}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#0077b6',
            color: 'white',
            '&:hover': {
              backgroundColor: '#005a8a',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'action.disabled',
            },
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Task Creation Modal */}
      <TaskCreateModal
        open={createModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateTaskSubmit}
        projectId={projectId}
        projectMembers={projectMembers}
        loading={createLoading}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        open={detailModalOpen}
        task={selectedTask}
        onClose={handleDetailModalClose}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
        onStatusChange={handleTaskStatusChange}
        projectMembers={projectMembers}
        activities={selectedTask ? taskActivities[selectedTask.id] || [] : []}
        loading={detailLoading}
      />
    </Box>
  );
};

export default TaskBoard;