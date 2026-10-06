import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { Query } from '../../types/query';
import { selectTaskRows } from '../tasks/tasks.selectors';
import { evaluateQuery, serializeQuery } from './query.operations';

const getQueryState = (state: RootState) => state.query;

export const selectQueryDraft = createSelector(
  [getQueryState],
  ({ draft }) => draft
);

export const selectSerializedDraft = createSelector(
  [selectQueryDraft],
  serializeQuery
);

export const selectQueryResultRows = createSelector(
  [selectTaskRows, (_state: RootState, query: Query) => query],
  evaluateQuery
);
