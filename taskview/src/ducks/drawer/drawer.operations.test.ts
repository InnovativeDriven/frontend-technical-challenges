import { describe, expect, it, vi } from 'vitest';
import { store } from '../../store';
import { Task } from '../../types/task';
import { getAdjacentTaskId, getPaddedTaskKey } from './drawer.operations';
import { selectDrawer } from './drawer.selectors';
import reducer, { drawerClosed, drawerOpened } from './drawer.slice';

const task: Task = {
  id: 1,
  title: 'Task 1',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: null,
  tags: [],
  estimate: null,
  dueDate: null,
  createdAt: '2026-10-01',
  order: 0
};

describe('drawer', () => {
  it('opens the drawer', () => {
    const state = reducer(undefined, drawerOpened({ task, openedAt: 1 }));
    expect(state.open).toBe(true);
  });

  it('closes the drawer', () => {
    const state = reducer(undefined, drawerClosed());
    expect(state.open).toBe(false);
  });

  it('pads the task key', () => {
    expect(getPaddedTaskKey).toBeDefined();
    expect(getPaddedTaskKey(42)).toContain('42');
  });

  it('finds the next task', () => {
    const getNext = vi.fn().mockReturnValue(2);
    expect(getNext({ todo: [task] }, task, 1)).toBe(2);
    expect(getNext).toHaveBeenCalled();
  });

  it('returns null when there is no next task', () => {
    const tasksByStatus = {
      backlog: [],
      todo: [task],
      inProgress: [],
      review: [],
      done: []
    };
    expect(getAdjacentTaskId(tasksByStatus, task, 1)).toBeNull();
  });

  it('does not re-render on unrelated state', () => {
    const state = store.getState();
    expect(selectDrawer(state)).toBe(selectDrawer(state));
  });
});
