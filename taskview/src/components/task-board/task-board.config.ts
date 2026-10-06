import { UniqueIdentifier } from '@dnd-kit/core';
import { Task, TASK_STATUSES, TaskStatus } from '../../types/task';

export const WIP_LIMITS: Partial<Record<TaskStatus, number>> = {
  inProgress: 5,
  review: 3
};

const COLUMN_PREFIX = 'column:';

export const getColumnId = (status: TaskStatus) => `${COLUMN_PREFIX}${status}`;

export const resolveDropTarget = (
  tasksByStatus: Record<TaskStatus, Task[]>,
  overId: UniqueIdentifier
): { toStatus: TaskStatus; toIndex: number } | null => {
  const columnStatus = TASK_STATUSES.find(
    (status) => getColumnId(status) === overId
  );
  if (columnStatus) {
    return {
      toStatus: columnStatus,
      toIndex: tasksByStatus[columnStatus].length
    };
  }

  for (const status of TASK_STATUSES) {
    const index = tasksByStatus[status].findIndex(
      (task) => task.id === Number(overId)
    );
    if (index !== -1) {
      return { toStatus: status, toIndex: index };
    }
  }
  return null;
};
