import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Query,
  QueryClause,
  QueryCombinator,
  QueryField
} from '../../types/query';
import {
  changeClauseField,
  createClause,
  EMPTY_QUERY
} from './query.operations';

interface QueryState {
  draft: Query;
}

const initialState: QueryState = {
  draft: EMPTY_QUERY
};

export const query = createSlice({
  name: 'query',
  initialState,
  reducers: {
    draftLoaded: (state, action: PayloadAction<Query>) => {
      state.draft = action.payload;
    },
    clauseAdded: (state) => {
      state.draft.clauses.push(createClause());
    },
    clauseRemoved: (state, action: PayloadAction<string>) => {
      state.draft.clauses = state.draft.clauses.filter(
        (clause) => clause.id !== action.payload
      );
    },
    clauseFieldChanged: (
      state,
      action: PayloadAction<{ id: string; field: QueryField }>
    ) => {
      state.draft.clauses = state.draft.clauses.map((clause) =>
        clause.id === action.payload.id
          ? changeClauseField(clause, action.payload.field)
          : clause
      );
    },
    clauseUpdated: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<Pick<QueryClause, 'operator' | 'value'>>;
      }>
    ) => {
      const clause = state.draft.clauses.find(
        ({ id }) => id === action.payload.id
      );
      if (clause) {
        Object.assign(clause, action.payload.changes);
      }
    },
    combinatorChanged: (state, action: PayloadAction<QueryCombinator>) => {
      state.draft.combinator = action.payload;
    },
    draftCleared: (state) => {
      state.draft = EMPTY_QUERY;
    }
  }
});

export const {
  draftLoaded,
  clauseAdded,
  clauseRemoved,
  clauseFieldChanged,
  clauseUpdated,
  combinatorChanged,
  draftCleared
} = query.actions;

export default query.reducer;
