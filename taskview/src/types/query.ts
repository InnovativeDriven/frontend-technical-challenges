export type QueryFieldType =
  'text' | 'enum' | 'user' | 'number' | 'date' | 'list';

export type QueryField =
  | 'title'
  | 'status'
  | 'priority'
  | 'assigneeId'
  | 'tags'
  | 'estimate'
  | 'dueDate'
  | 'createdAt';

export type QueryOperator =
  | 'contains'
  | 'notContains'
  | 'eq'
  | 'neq'
  | 'gt'
  | 'lt'
  | 'before'
  | 'after'
  | 'includes'
  | 'excludes'
  | 'isEmpty'
  | 'isNotEmpty';

export type QueryCombinator = 'and' | 'or';

export interface QueryClause {
  id: string;
  field: QueryField;
  operator: QueryOperator;
  value: string;
}

export interface Query {
  combinator: QueryCombinator;
  clauses: QueryClause[];
}
