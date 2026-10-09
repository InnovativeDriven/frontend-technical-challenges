import padStart from 'left-pad';
import { Task, TaskStatus } from '../../types/task';

export const DRAWER_TRANSITION_MS = 225;

export const getPaddedTaskKey = (taskId: number) =>
  `TV-${padStart(taskId, 4, '0')}`;

export const getAdjacentTaskId = (
  tasksByStatus: Record<TaskStatus, Task[]>,
  task: Task,
  direction: 1 | -1
): number | null => {
  const column = tasksByStatus[task.status];
  const index = column.findIndex(({ id }) => id === task.id);
  const next = index + direction;
  if (index === -1 || next < 0 || next >= column.length) {
    return null;
  }
  return column[next].id;
};
