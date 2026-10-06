import { Task, TASK_STATUSES, TaskChanges, TaskStatus } from '../../types/task';

export interface TaskUpdate {
  id: number;
  changes: TaskChanges;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  inProgress: 'In Progress',
  review: 'In Review',
  done: 'Done'
};

export const getTaskKey = (taskId: number) => `TV-${taskId}`;

export const parseTaskId = (param: string | undefined): number | null => {
  if (!param || !/^\d+$/.test(param)) {
    return null;
  }
  const taskId = Number(param);
  return taskId > 0 ? taskId : null;
};

export const sortByOrder = (tasks: Task[]) =>
  [...tasks].sort((a, b) => a.order - b.order);

export const groupTasksByStatus = (tasks: Task[]) =>
  TASK_STATUSES.reduce(
    (groups, status) => ({
      ...groups,
      [status]: sortByOrder(tasks.filter((task) => task.status === status))
    }),
    {} as Record<TaskStatus, Task[]>
  );

export const moveTask = (
  tasks: Task[],
  taskId: number,
  toStatus: TaskStatus,
  toIndex: number
): TaskUpdate[] => {
  const task = tasks.find(({ id }) => id === taskId);
  if (!task) {
    return [];
  }

  const groups = groupTasksByStatus(tasks);
  const source = groups[task.status].filter(({ id }) => id !== taskId);
  const target = task.status === toStatus ? source : groups[toStatus];
  const insertAt = Math.max(0, Math.min(toIndex, target.length));
  const reordered = [
    ...target.slice(0, insertAt),
    { ...task, status: toStatus },
    ...target.slice(insertAt)
  ];

  const next = new Map<number, { status: TaskStatus; order: number }>();
  if (task.status !== toStatus) {
    source.forEach(({ id, status }, order) => next.set(id, { status, order }));
  }
  reordered.forEach(({ id, status }, order) => next.set(id, { status, order }));

  return tasks.flatMap((current) => {
    const position = next.get(current.id);
    if (!position) {
      return [];
    }
    if (position.status === current.status) {
      return position.order === current.order
        ? []
        : [{ id: current.id, changes: { order: position.order } }];
    }
    return [{ id: current.id, changes: position }];
  });
};

export const applyTaskUpdates = (tasks: Task[], updates: TaskUpdate[]) => {
  const changesById = new Map(updates.map(({ id, changes }) => [id, changes]));
  return tasks.map((task) =>
    changesById.has(task.id) ? { ...task, ...changesById.get(task.id) } : task
  );
};
