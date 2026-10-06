import { describe, expect, it } from 'vitest';
import { Task } from '../../types/task';
import {
  createClause,
  evaluateQuery,
  parseQuery,
  serializeQuery
} from './query.operations';

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 1,
  title: 'Task',
  description: '',
  status: 'todo',
  priority: 'medium',
  assigneeId: null,
  tags: [],
  estimate: null,
  dueDate: null,
  createdAt: '2026-10-01',
  order: 0,
  ...overrides
});

const tasks = [
  makeTask({ id: 1, title: 'Fix upload bug', tags: ['bug'], estimate: 3 }),
  makeTask({ id: 2, title: 'Add export', status: 'done', assigneeId: 2 }),
  makeTask({ id: 3, title: 'Upload progress', dueDate: '2026-10-10' })
];

const ids = (list: Task[]) => list.map(({ id }) => id);

describe('evaluateQuery', () => {
  it('returns all tasks for an empty query', () => {
    expect(evaluateQuery(tasks, { combinator: 'and', clauses: [] })).toEqual(
      tasks
    );
  });

  it('ignores incomplete clauses', () => {
    const query = { combinator: 'and' as const, clauses: [createClause()] };
    expect(evaluateQuery(tasks, query)).toEqual(tasks);
  });

  it('matches text case-insensitively', () => {
    const query = {
      combinator: 'and' as const,
      clauses: [createClause('title', 'contains', 'UPLOAD')]
    };
    expect(ids(evaluateQuery(tasks, query))).toEqual([1, 3]);
  });

  it('combines clauses with and / or', () => {
    const clauses = [
      createClause('title', 'contains', 'upload'),
      createClause('status', 'eq', 'done')
    ];
    expect(ids(evaluateQuery(tasks, { combinator: 'and', clauses }))).toEqual(
      []
    );
    expect(ids(evaluateQuery(tasks, { combinator: 'or', clauses }))).toEqual([
      1, 2, 3
    ]);
  });

  it('handles list, number, date, and empty operators', () => {
    const run = (clause: ReturnType<typeof createClause>) =>
      ids(evaluateQuery(tasks, { combinator: 'and', clauses: [clause] }));

    expect(run(createClause('tags', 'includes', 'bug'))).toEqual([1]);
    expect(run(createClause('estimate', 'gt', '2'))).toEqual([1]);
    expect(run(createClause('dueDate', 'after', '2026-10-01'))).toEqual([3]);
    expect(run(createClause('assigneeId', 'isEmpty'))).toEqual([1, 3]);
    expect(run(createClause('assigneeId', 'eq', '2'))).toEqual([2]);
  });
});

describe('serializeQuery / parseQuery', () => {
  it('round-trips a query', () => {
    const query = {
      combinator: 'or' as const,
      clauses: [
        createClause('title', 'contains', 'a & b'),
        createClause('assigneeId', 'isEmpty')
      ]
    };
    const parsed = parseQuery(serializeQuery(query));
    expect(parsed.combinator).toBe('or');
    expect(
      parsed.clauses.map(({ field, operator, value }) => [
        field,
        operator,
        value
      ])
    ).toEqual([
      ['title', 'contains', 'a & b'],
      ['assigneeId', 'isEmpty', '']
    ]);
  });

  it('serializes an empty query to an empty string', () => {
    expect(serializeQuery({ combinator: 'and', clauses: [] })).toBe('');
  });

  it.each([null, '', 'not json', '42', '{"c":"nope"}'])(
    'falls back to an empty query for %s',
    (raw) => {
      expect(parseQuery(raw).clauses).toEqual([]);
    }
  );

  it('drops clauses with unknown fields or invalid operators', () => {
    const raw = JSON.stringify({
      m: 'and',
      c: [
        ['title', 'contains', 'ok'],
        ['bogus', 'eq', 'x'],
        ['status', 'gt', 'todo'],
        ['estimate', 'eq', 5]
      ]
    });
    expect(parseQuery(raw).clauses).toHaveLength(1);
  });
});
