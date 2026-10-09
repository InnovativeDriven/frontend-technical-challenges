import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/task';

/**
 * DrawerState
 *
 * This interface describes the shape of the drawer slice of the Redux store.
 * It holds everything the TaskDrawer component needs in order to render,
 * which keeps the component itself simple and makes the drawer state easy
 * to inspect in Redux DevTools.
 *
 * - `open`: whether or not the drawer is currently open.
 * - `task`: the task that is currently being displayed in the drawer.
 * - `openedAt`: a timestamp of when the drawer was opened (used for telemetry).
 * - `dimensions`: the measured size of the drawer paper element, used to
 *   switch the drawer into a compact layout on smaller screens.
 */
interface DrawerState {
  open: boolean;
  task: Task | null;
  openedAt: number | null;
  dimensions: { width: number; height: number };
}

/**
 * The initial state of the drawer. The drawer starts closed with no task.
 */
const initialState: DrawerState = {
  open: false,
  task: null,
  openedAt: null,
  dimensions: { width: 0, height: 0 }
};

/**
 * The drawer slice.
 *
 * This slice manages the open/closed state of the task drawer as well as the
 * task being displayed. By keeping the task in the drawer slice, we ensure
 * that the drawer always has a consistent, robust snapshot of the task to work
 * with, even if the underlying task list is being reloaded.
 */
export const drawer = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    /**
     * Opens the drawer with the given task.
     */
    drawerOpened: (
      state,
      action: PayloadAction<{ task: Task; openedAt: number }>
    ) => {
      state.open = true;
      state.task = action.payload.task;
      state.openedAt = action.payload.openedAt;
    },
    /**
     * Closes the drawer and clears the task.
     */
    drawerClosed: (state) => {
      state.open = false;
      state.task = null;
      state.openedAt = null;
    },
    /**
     * Stores the measured dimensions of the drawer.
     */
    drawerMeasured: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.dimensions = action.payload;
    }
  }
});

export const { drawerOpened, drawerClosed, drawerMeasured } = drawer.actions;

export default drawer.reducer;
