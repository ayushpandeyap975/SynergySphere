import { Task, TaskPriority } from '../types/task';
import { TaskFilters, TaskSortOption } from '../components/task/TaskFilterToolbar';

/**
 * Utility functions for filtering and sorting tasks
 */

/**
 * Check if a task matches the search query
 */
const matchesSearch = (task: Task, searchQuery: string): boolean => {
  if (!searchQuery.trim()) return true;
  
  const query = searchQuery.toLowerCase();
  return (
    task.title.toLowerCase().includes(query) ||
    (task.description?.toLowerCase().includes(query) ?? false) ||
    (task.assigneeName?.toLowerCase().includes(query) ?? false)
  );
};

/**
 * Check if a task matches the assignee filter
 */
const matchesAssignee = (task: Task, assigneeFilter: string): boolean => {
  if (assigneeFilter === 'all') return true;
  if (assigneeFilter === 'unassigned') return !task.assigneeId;
  return task.assigneeId === assigneeFilter;
};

/**
 * Check if a task matches the priority filter
 */
const matchesPriority = (task: Task, priorityFilter: TaskPriority | 'all'): boolean => {
  if (priorityFilter === 'all') return true;
  return task.priority === priorityFilter;
};

/**
 * Check if a task matches the due date filter
 */
const matchesDueDate = (task: Task, dueDateFilter: TaskFilters['dueDate']): boolean => {
  if (dueDateFilter === 'all') return true;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  switch (dueDateFilter) {
    case 'overdue':
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < today;
    
    case 'today': {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    }
    
    case 'this_week': {
      if (!task.dueDate) return false;
      const dueDateWeek = new Date(task.dueDate);
      return dueDateWeek >= today && dueDateWeek <= weekFromNow;
    }
    
    case 'no_due_date':
      return !task.dueDate;
    
    default:
      return true;
  }
};

/**
 * Filter tasks based on the provided filters
 */
export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => 
    matchesSearch(task, filters.search) &&
    matchesAssignee(task, filters.assignee) &&
    matchesPriority(task, filters.priority) &&
    matchesDueDate(task, filters.dueDate)
  );
};

/**
 * Get priority sort value (higher number = higher priority)
 */
const getPrioritySortValue = (priority: TaskPriority): number => {
  switch (priority) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
};

/**
 * Sort tasks based on the provided sort option
 */
export const sortTasks = (tasks: Task[], sortBy: TaskSortOption): Task[] => {
  const sortedTasks = [...tasks];
  
  switch (sortBy) {
    case 'due_date':
      return sortedTasks.sort((a, b) => {
        // Tasks without due dates go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    
    case 'priority':
      return sortedTasks.sort((a, b) => {
        const priorityDiff = getPrioritySortValue(b.priority) - getPrioritySortValue(a.priority);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Secondary sort by due date if priorities are equal
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    
    case 'assignee':
      return sortedTasks.sort((a, b) => {
        const aName = a.assigneeName || 'Unassigned';
        const bName = b.assigneeName || 'Unassigned';
        return aName.localeCompare(bName);
      });
    
    case 'created_date':
      return sortedTasks.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    case 'title':
      return sortedTasks.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    
    default:
      return sortedTasks;
  }
};

/**
 * Apply both filtering and sorting to tasks
 */
export const filterAndSortTasks = (
  tasks: Task[], 
  filters: TaskFilters, 
  sortBy: TaskSortOption
): Task[] => {
  const filteredTasks = filterTasks(tasks, filters);
  return sortTasks(filteredTasks, sortBy);
};