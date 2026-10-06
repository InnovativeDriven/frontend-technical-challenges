import { QUERY_FIELDS } from '../../../../ducks/query/query.operations';
import { QueryField, QueryFieldType } from '../../../../types/query';

export const FIELD_KEYS = Object.keys(QUERY_FIELDS) as QueryField[];

export const INPUT_TYPES: Record<QueryFieldType, string> = {
  text: 'text',
  enum: 'text',
  user: 'text',
  number: 'number',
  date: 'date',
  list: 'text'
};
