import { filterTasks, sortTasks, filterAndSortTasks } from '../taskFilters';
import { Task } from '../../types/task';
import { TaskFilters } from '../../components/task/TaskFilterToolbar';

// Mock tasks for testing
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface',
    description: 'Create wireframes and mockups',
    status: 'todo',
    priority: 'high',
    assigneeId: '1',
    assigneeName: 'John Doe',
    dueDate: '2024-12-20',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    projectId: 'project1',
  },
  {
    id: '2',
    title: 'Implement API endpoints',
    description: 'Create REST API',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: '2',
    assigneeName: 'Jane Smith',
    dueDate: '2024-12-22',
    createdAt: '2024-12-15T11:00:00Z',
    updatedAt: '2024-12-15T11:00:00Z',
    projectId: 'project1',
  },
  {
    id: '3',
    title: 'Write unit tests',
    description: 'Create comprehensive test suite',
    status: 'done',
    priority: 'low',
    assigneeId: '1',
    assigneeName: 'John Doe',
    createdAt: '2024-12-14T09:00:00Z',
    updatedAt: '2024-12-15T14:00:00Z',
    projectId: 'project1',
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update API docs',
    status: 'todo',
    priority: 'medium',
    createdAt: '2024-12-13T15:00:00Z',
    updatedAt: '2024-12-15T16:00:00Z',
    projectId: 'project1',
  },
];

describe('taskFilters', () => {
  describe('filterTasks', () => {
    it('should filter tasks by search query', () => {
      const filters: TaskFilters = {
        search: 'API',
        assignee: 'all',
        priority: 'all',
        dueDate: 'all',
      };

      const result = filterTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('4');
    });

    it('should filter tasks by assignee', () => {
      const filters: TaskFilters = {
        search: '',
        assignee: '1',
        priority: 'all',
        dueDate: 'all',
      };

      const result = filterTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.every(task => task.assigneeId === '1')).toBe(true);
    });

    it('should filter tasks by priority', () => {
      const filters: TaskFilters = {
        search: '',
        assignee: 'all',
        priority: 'high',
        dueDate: 'all',
      };

      const result = filterTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
    });

    it('should filter unassigned tasks', () => {
      const filters: TaskFilters = {
        search: '',
        assignee: 'unassigned',
        priority: 'all',
        dueDate: 'all',
      };

      const result = filterTasks(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should filter tasks with no due date', () => {
      const filters: TaskFilters = {
        search: '',
        assignee: 'all',
        priority: 'all',
        dueDate: 'no_due_date',
      };

      const result = filterTasks(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.every(task => !task.dueDate)).toBe(true);
    });
  });

  describe('sortTasks', () => {
    it('should sort tasks by priority (high to low)', () => {
      const result = sortTasks(mockTasks, 'priority');
      expect(result[0].priority).toBe('high');
      expect(result[result.length - 1].priority).toBe('low');
    });

    it('should sort tasks by title alphabetically', () => {
      const result = sortTasks(mockTasks, 'title');
      expect(result[0].title).toBe('Design user interface');
      expect(result[1].title).toBe('Implement API endpoints');
    });

    it('should sort tasks by assignee name', () => {
      const result = sortTasks(mockTasks, 'assignee');
      expect(result[0].assigneeName).toBe('Jane Smith');
      expect(result[result.length - 1].assigneeName).toBe('John Doe');
    });

    it('should sort tasks by due date', () => {
      const result = sortTasks(mockTasks, 'due_date');
      // Tasks with due dates should come first, sorted by date
      expect(result[0].dueDate).toBe('2024-12-20');
      expect(result[1].dueDate).toBe('2024-12-22');
      // Tasks without due dates should come last
      expect(result[result.length - 1].dueDate).toBeUndefined();
    });
  });

  describe('filterAndSortTasks', () => {
    it('should apply both filtering and sorting', () => {
      const filters: TaskFilters = {
        search: '',
        assignee: '1',
        priority: 'all',
        dueDate: 'all',
      };

      const result = filterAndSortTasks(mockTasks, filters, 'priority');
      expect(result).toHaveLength(2);
      expect(result[0].priority).toBe('high');
      expect(result[1].priority).toBe('low');
    });
  });
});