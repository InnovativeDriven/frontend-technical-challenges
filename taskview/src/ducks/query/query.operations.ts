import {
  Query,
  QueryClause,
  QueryCombinator,
  QueryField,
  QueryFieldType,
  QueryOperator
} from '../../types/query';
import { Task, TASK_PRIORITIES, TASK_STATUSES } from '../../types/task';
import { STATUS_LABELS } from '../tasks/tasks.operations';

interface QueryFieldConfig {
  label: string;
  type: QueryFieldType;
  options?: { value: string; label: string }[];
}

export const QUERY_FIELDS: Record<QueryField, QueryFieldConfig> = {
  title: { label: 'Title', type: 'text' },
  status: {
    label: 'Status',
    type: 'enum',
    options: TASK_STATUSES.map((value) => ({
      value,
      label: STATUS_LABELS[value]
    }))
  },
  priority: {
    label: 'Priority',
    type: 'enum',
    options: TASK_PRIORITIES.map((value) => ({ value, label: value }))
  },
  assigneeId: { label: 'Assignee', type: 'user' },
  tags: { label: 'Tags', type: 'list' },
  estimate: { label: 'Estimate', type: 'number' },
  dueDate: { label: 'Due date', type: 'date' },
  createdAt: { label: 'Created', type: 'date' }
};

export const OPERATOR_LABELS: Record<QueryOperator, string> = {
  contains: 'contains',
  notContains: 'does not contain',
  eq: '=',
  neq: '≠',
  gt: '>',
  lt: '<',
  before: 'before',
  after: 'after',
  includes: 'includes',
  excludes: 'excludes',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty'
};

export const OPERATORS_BY_TYPE: Record<QueryFieldType, QueryOperator[]> = {
  text: ['contains', 'notContains', 'eq', 'neq'],
  enum: ['eq', 'neq'],
  user: ['eq', 'neq', 'isEmpty', 'isNotEmpty'],
  number: ['eq', 'neq', 'gt', 'lt', 'isEmpty', 'isNotEmpty'],
  date: ['eq', 'before', 'after', 'isEmpty', 'isNotEmpty'],
  list: ['includes', 'excludes', 'isEmpty', 'isNotEmpty']
};

const VALUELESS_OPERATORS: QueryOperator[] = ['isEmpty', 'isNotEmpty'];

export const EMPTY_QUERY: Query = { combinator: 'and', clauses: [] };

export const operatorNeedsValue = (operator: QueryOperator) =>
  !VALUELESS_OPERATORS.includes(operator);

export const getOperatorsForField = (field: QueryField) =>
  OPERATORS_BY_TYPE[QUERY_FIELDS[field].type];

let nextClauseId = 1;

export const createClause = (
  field: QueryField = 'title',
  operator: QueryOperator = getOperatorsForField(field)[0],
  value = ''
): QueryClause => ({
  id: `clause-${nextClauseId++}`,
  field,
  operator,
  value
});

export const changeClauseField = (
  clause: QueryClause,
  field: QueryField
): QueryClause => ({
  ...clause,
  field,
  operator: getOperatorsForField(field)[0],
  value: ''
});

export const isClauseComplete = ({ operator, value }: QueryClause) =>
  !operatorNeedsValue(operator) || value.trim() !== '';

const isEmptyValue = (value: unknown) =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

export const evaluateClause = (task: Task, clause: QueryClause): boolean => {
  const actual = task[clause.field];
  const expected = clause.value.trim();
  const { type } = QUERY_FIELDS[clause.field];

  if (clause.operator === 'isEmpty') {
    return isEmptyValue(actual);
  }
  if (clause.operator === 'isNotEmpty') {
    return !isEmptyValue(actual);
  }

  if (type === 'list') {
    const values = (actual as string[]).map((v) => v.toLowerCase());
    const hasValue = values.includes(expected.toLowerCase());
    return clause.operator === 'includes' ? hasValue : !hasValue;
  }

  if (type === 'number') {
    const left = actual as number | null;
    const right = Number(expected);
    if (left === null || Number.isNaN(right)) {
      return clause.operator === 'neq';
    }
    switch (clause.operator) {
      case 'eq':
        return left === right;
      case 'neq':
        return left !== right;
      case 'gt':
        return left > right;
      case 'lt':
        return left < right;
      default:
        return false;
    }
  }

  if (type === 'date') {
    const left = actual as string | null;
    if (left === null) {
      return false;
    }
    switch (clause.operator) {
      case 'eq':
        return left === expected;
      case 'before':
        return left < expected;
      case 'after':
        return left > expected;
      default:
        return false;
    }
  }

  const left = actual === null ? '' : String(actual).toLowerCase();
  const right = expected.toLowerCase();
  switch (clause.operator) {
    case 'contains':
      return left.includes(right);
    case 'notContains':
      return !left.includes(right);
    case 'eq':
      return left === right;
    case 'neq':
      return left !== right;
    default:
      return false;
  }
};

export const evaluateQuery = <T extends Task>(
  tasks: T[],
  query: Query
): T[] => {
  const clauses = query.clauses.filter(isClauseComplete);
  if (clauses.length === 0) {
    return tasks;
  }
  return tasks.filter((task) =>
    query.combinator === 'and'
      ? clauses.every((clause) => evaluateClause(task, clause))
      : clauses.some((clause) => evaluateClause(task, clause))
  );
};

type SerializedQuery = {
  m: QueryCombinator;
  c: [QueryField, QueryOperator, string][];
};

export const serializeQuery = (query: Query): string => {
  const serialized: SerializedQuery = {
    m: query.combinator,
    c: query.clauses
      .filter(isClauseComplete)
      .map(({ field, operator, value }) => [field, operator, value])
  };
  return serialized.c.length > 0 ? JSON.stringify(serialized) : '';
};

const isQueryField = (field: unknown): field is QueryField =>
  typeof field === 'string' && field in QUERY_FIELDS;

export const parseQuery = (raw: string | null): Query => {
  if (!raw) {
    return EMPTY_QUERY;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_QUERY;
  }
  if (!parsed || typeof parsed !== 'object') {
    return EMPTY_QUERY;
  }

  const { m, c } = parsed as Partial<SerializedQuery>;
  const combinator: QueryCombinator = m === 'or' ? 'or' : 'and';
  const clauses = (Array.isArray(c) ? c : []).flatMap((entry) => {
    if (!Array.isArray(entry)) {
      return [];
    }
    const [field, operator, value] = entry;
    if (
      !isQueryField(field) ||
      !getOperatorsForField(field).includes(operator) ||
      typeof value !== 'string'
    ) {
      return [];
    }
    return [createClause(field, operator, value)];
  });

  return { combinator, clauses };
};
