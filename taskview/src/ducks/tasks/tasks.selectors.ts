import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { selectUsersById } from '../users/users.selectors';
import { getTaskKey, groupTasksByStatus } from './tasks.operations';

const getTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = createSelector(
  [getTasksState],
  ({ tasks }) => tasks
);

export const selectTasksLoading = createSelector(
  [getTasksState],
  ({ status }) => status === 'idle' || status === 'loading'
);

export const selectTasksError = createSelector(
  [getTasksState],
  ({ error }) => error
);

export const selectTasksByStatus = createSelector(
  [selectAllTasks],
  groupTasksByStatus
);

export const selectTaskById = createSelector(
  [selectAllTasks, (_state: RootState, taskId: number | null) => taskId],
  (tasks, taskId) => tasks.find((task) => task.id === taskId)
);

export const selectIsTaskSaving = createSelector(
  [getTasksState, (_state: RootState, taskId: number | null) => taskId],
  ({ savingTaskIds }, taskId) =>
    taskId !== null && savingTaskIds.includes(taskId)
);

export const selectTaskRows = createSelector(
  [selectAllTasks, selectUsersById],
  (tasks, usersById) =>
    tasks.map((task) => ({
      ...task,
      key: getTaskKey(task.id),
      assigneeName:
        task.assigneeId !== null ? (usersById[task.assigneeId]?.name ?? '') : ''
    }))
);

export type TaskRow = ReturnType<typeof selectTaskRows>[number];
