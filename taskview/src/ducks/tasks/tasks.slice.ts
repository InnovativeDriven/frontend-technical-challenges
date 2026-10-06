import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { services } from '../../services';
import { Task, TaskChanges, TaskStatus } from '../../types/task';
import type { RootState } from '../../store';
import { applyTaskUpdates, moveTask, TaskUpdate } from './tasks.operations';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await services.getTasks();
  return response.data;
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, changes }: { taskId: number; changes: TaskChanges }) => {
    const response = await services.updateTask(taskId, changes);
    return response.data;
  }
);

export const moveTaskOnBoard = createAsyncThunk<
  void,
  { taskId: number; toStatus: TaskStatus; toIndex: number },
  { state: RootState }
>(
  'tasks/moveTaskOnBoard',
  async ({ taskId, toStatus, toIndex }, { dispatch, getState }) => {
    const updates = moveTask(getState().tasks.tasks, taskId, toStatus, toIndex);
    if (updates.length === 0) {
      return;
    }

    dispatch(tasksPatched(updates));
    try {
      await services.updateTasks(updates);
    } catch {
      dispatch(fetchTasks());
    }
  }
);

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  savingTaskIds: number[];
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
  savingTaskIds: []
};

export const tasks = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    tasksPatched: (state, action: PayloadAction<TaskUpdate[]>) => {
      state.tasks = applyTaskUpdates(state.tasks, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load tasks';
      })
      .addCase(updateTask.pending, (state, action) => {
        state.savingTaskIds.push(action.meta.arg.taskId);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.savingTaskIds = state.savingTaskIds.filter(
          (id) => id !== action.meta.arg.taskId
        );
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.savingTaskIds = state.savingTaskIds.filter(
          (id) => id !== action.meta.arg.taskId
        );
        state.error = action.error.message ?? 'Failed to save task';
      });
  }
});

export const { tasksPatched } = tasks.actions;

export default tasks.reducer;
