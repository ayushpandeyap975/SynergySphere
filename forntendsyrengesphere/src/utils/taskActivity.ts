/**
 * Task Activity Utilities
 * Functions for creating and managing task activity entries
 */

import { TaskActivity, TaskActivityType, TaskPriority, TaskStatus } from '../types/task';

/**
 * Creates a new task activity entry
 */
export function createTaskActivity(
  taskId: string,
  type: TaskActivityType,
  description: string,
  userId?: string,
  userName?: string,
  userAvatar?: string,
  metadata?: Record<string, unknown>
): TaskActivity {
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    type,
    description,
    userId,
    userName,
    userAvatar,
    metadata,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates activity for task creation
 */
export function createTaskCreatedActivity(
  taskId: string,
  taskTitle: string,
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  return createTaskActivity(
    taskId,
    'created',
    `Task "${taskTitle}" was created`,
    userId,
    userName,
    userAvatar,
    { taskTitle }
  );
}

/**
 * Creates activity for task status change
 */
export function createTaskStatusChangeActivity(
  taskId: string,
  taskTitle: string,
  oldStatus: TaskStatus,
  newStatus: TaskStatus,
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  return createTaskActivity(
    taskId,
    'status_changed',
    `Task "${taskTitle}" moved from ${statusLabels[oldStatus]} to ${statusLabels[newStatus]}`,
    userId,
    userName,
    userAvatar,
    { taskTitle, oldStatus, newStatus }
  );
}

/**
 * Creates activity for task priority change
 */
export function createTaskPriorityChangeActivity(
  taskId: string,
  taskTitle: string,
  oldPriority: TaskPriority,
  newPriority: TaskPriority,
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  const priorityLabels: Record<TaskPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return createTaskActivity(
    taskId,
    'priority_changed',
    `Task "${taskTitle}" priority changed from ${priorityLabels[oldPriority]} to ${priorityLabels[newPriority]}`,
    userId,
    userName,
    userAvatar,
    { taskTitle, oldPriority, newPriority }
  );
}

/**
 * Creates activity for task assignment
 */
export function createTaskAssignmentActivity(
  taskId: string,
  taskTitle: string,
  assigneeName?: string,
  oldAssigneeName?: string,
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  let description: string;
  let type: TaskActivityType;

  if (!oldAssigneeName && assigneeName) {
    // Task was assigned
    type = 'assigned';
    description = `Task "${taskTitle}" was assigned to ${assigneeName}`;
  } else if (oldAssigneeName && !assigneeName) {
    // Task was unassigned
    type = 'unassigned';
    description = `Task "${taskTitle}" was unassigned from ${oldAssigneeName}`;
  } else if (oldAssigneeName && assigneeName && oldAssigneeName !== assigneeName) {
    // Task was reassigned
    type = 'assigned';
    description = `Task "${taskTitle}" was reassigned from ${oldAssigneeName} to ${assigneeName}`;
  } else {
    // No change
    type = 'updated';
    description = `Task "${taskTitle}" assignment updated`;
  }

  return createTaskActivity(
    taskId,
    type,
    description,
    userId,
    userName,
    userAvatar,
    { taskTitle, assigneeName, oldAssigneeName }
  );
}

/**
 * Creates activity for task completion
 */
export function createTaskCompletionActivity(
  taskId: string,
  taskTitle: string,
  completed: boolean,
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  return createTaskActivity(
    taskId,
    completed ? 'completed' : 'reopened',
    completed 
      ? `Task "${taskTitle}" was marked as complete`
      : `Task "${taskTitle}" was reopened`,
    userId,
    userName,
    userAvatar,
    { taskTitle, completed }
  );
}

/**
 * Creates activity for task update
 */
export function createTaskUpdateActivity(
  taskId: string,
  taskTitle: string,
  changes: string[],
  userId?: string,
  userName?: string,
  userAvatar?: string
): TaskActivity {
  const changeDescription = changes.length === 1 
    ? changes[0]
    : `${changes.slice(0, -1).join(', ')} and ${changes[changes.length - 1]}`;

  return createTaskActivity(
    taskId,
    'updated',
    `Task "${taskTitle}" was updated: ${changeDescription}`,
    userId,
    userName,
    userAvatar,
    { taskTitle, changes }
  );
}

/**
 * Formats activity timestamp for display
 */
export function formatActivityTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}