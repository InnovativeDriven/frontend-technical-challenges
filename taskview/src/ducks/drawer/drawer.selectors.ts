import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { selectUsersById } from '../users/users.selectors';

const getDrawerState = (state: RootState) => state.drawer;

/**
 * Selects everything the drawer needs in a single, memoized selector.
 *
 * Because this uses createSelector, the result is memoized and the drawer
 * will only re-render when the drawer state actually changes. The task is
 * kept fresh because selectTaskById is memoized against the task list.
 */
export const selectDrawer = createSelector(
  [getDrawerState, selectUsersById],
  (drawer, usersById) => ({
    ...drawer,
    assignee:
      drawer.task && drawer.task.assigneeId !== null
        ? usersById[drawer.task.assigneeId]
        : undefined,
    compact: drawer.dimensions.width > 0 && drawer.dimensions.width < 400
  })
);
