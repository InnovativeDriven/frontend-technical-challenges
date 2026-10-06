import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import featureFlags from './ducks/feature-flags/feature-flags.slice';
import query from './ducks/query/query.slice';
import tasks from './ducks/tasks/tasks.slice';
import users from './ducks/users/users.slice';

export const store = configureStore({
  reducer: {
    tasks,
    users,
    query,
    featureFlags
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
