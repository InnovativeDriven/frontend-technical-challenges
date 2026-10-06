import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { services } from '../../services';
import { User } from '../../types/task';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await services.getUsers();
  return response.data;
});

interface UsersState {
  users: User[];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false
};

export const users = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  }
});

export default users.reducer;
