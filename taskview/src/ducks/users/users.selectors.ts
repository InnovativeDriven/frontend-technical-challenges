import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { User } from '../../types/task';

const getUsersState = (state: RootState) => state.users;

export const selectAllUsers = createSelector(
  [getUsersState],
  ({ users }) => users
);

export const selectUsersById = createSelector([selectAllUsers], (users) =>
  users.reduce<Record<number, User>>(
    (byId, user) => ({ ...byId, [user.id]: user }),
    {}
  )
);
