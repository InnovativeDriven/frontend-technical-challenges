export const TASK_STATUSES = [
  'backlog',
  'todo',
  'inProgress',
  'review',
  'done'
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: number | null;
  tags: string[];
  estimate: number | null;
  dueDate: string | null;
  createdAt: string;
  order: number;
}

export type TaskChanges = Partial<Omit<Task, 'id' | 'createdAt'>>;

export interface User {
  id: number;
  name: string;
  initials: string;
}
