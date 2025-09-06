/**
 * TypeScript interfaces for Task-related data structures
 * Used throughout the Task Board for type safety
 */

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Task status/column types for Kanban board
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Represents a task in the project
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

/**
 * Data structure for creating a new task
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  projectId: string;
}

/**
 * Kanban column configuration
 */
export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  color: string;
}

/**
 * Task activity types for tracking changes
 */
export type TaskActivityType = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'unassigned'
  | 'completed'
  | 'reopened'
  | 'deleted';

/**
 * Task activity entry for tracking changes
 */
export interface TaskActivity {
  id: string;
  taskId: string;
  type: TaskActivityType;
  description: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Extended task interface with activity tracking
 */
export interface TaskWithActivity extends Task {
  activities?: TaskActivity[];
}

/**
 * Drag and drop result interface
 */
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}