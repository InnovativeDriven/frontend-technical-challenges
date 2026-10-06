import { describe, expect, it } from 'vitest';
import { Task } from '../../types/task';
import {
  applyTaskUpdates,
  groupTasksByStatus,
  moveTask,
  parseTaskId
} from './tasks.operations';

const makeTask = (id: number, status: Task['status'], order: number): Task => ({
  id,
  title: `Task ${id}`,
  description: '',
  status,
  priority: 'medium',
  assigneeId: null,
  tags: [],
  estimate: null,
  dueDate: null,
  createdAt: '2026-10-01',
  order
});

const tasks = [
  makeTask(1, 'todo', 0),
  makeTask(2, 'todo', 1),
  makeTask(3, 'todo', 2),
  makeTask(4, 'done', 0)
];

const idsFor = (list: Task[], status: Task['status']) =>
  groupTasksByStatus(list)[status].map(({ id }) => id);

describe('parseTaskId', () => {
  it('accepts positive integers', () => {
    expect(parseTaskId('12')).toBe(12);
  });

  it.each([undefined, '', 'abc', '1.5', '-3', '0', '12abc'])(
    'rejects %s',
    (value) => {
      expect(parseTaskId(value)).toBeNull();
    }
  );
});

describe('moveTask', () => {
  it('reorders within a column', () => {
    const next = applyTaskUpdates(tasks, moveTask(tasks, 1, 'todo', 2));
    expect(idsFor(next, 'todo')).toEqual([2, 3, 1]);
  });

  it('moves across columns and resequences both', () => {
    const next = applyTaskUpdates(tasks, moveTask(tasks, 2, 'done', 0));
    expect(idsFor(next, 'todo')).toEqual([1, 3]);
    expect(idsFor(next, 'done')).toEqual([2, 4]);
    expect(next.find(({ id }) => id === 3)?.order).toBe(1);
  });

  it('clamps the target index', () => {
    const next = applyTaskUpdates(tasks, moveTask(tasks, 1, 'done', 99));
    expect(idsFor(next, 'done')).toEqual([4, 1]);
  });

  it('returns no updates when nothing moves', () => {
    expect(moveTask(tasks, 2, 'todo', 1)).toEqual([]);
  });

  it('returns no updates for an unknown task', () => {
    expect(moveTask(tasks, 99, 'todo', 0)).toEqual([]);
  });
});
