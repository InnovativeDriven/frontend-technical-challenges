import {
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
  selectQueryDraft,
  selectSerializedDraft
} from '../../ducks/query/query.selectors';
import {
  clauseAdded,
  combinatorChanged,
  draftCleared
} from '../../ducks/query/query.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { QueryCombinator } from '../../types/query';
import QueryClauseRow from './components/query-clause-row';
import './query-editor.styles.scss';

interface QueryEditorProps {
  appliedQuery: string;
  onRun: (serializedQuery: string) => void;
}

const QueryEditor = ({ appliedQuery, onRun }: QueryEditorProps) => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector(selectQueryDraft);
  const serializedDraft = useAppSelector(selectSerializedDraft);
  const isDirty = serializedDraft !== appliedQuery;

  const handleCombinatorChange = (
    _event: unknown,
    value: QueryCombinator | null
  ) => {
    if (value) {
      dispatch(combinatorChanged(value));
    }
  };

  return (
    <Paper variant="outlined" className="query-editor">
      <div className="query-editor__header">
        <Typography variant="subtitle1">Query</Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={draft.combinator}
          onChange={handleCombinatorChange}
        >
          <ToggleButton value="and">Match all</ToggleButton>
          <ToggleButton value="or">Match any</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="query-editor__clauses">
        {draft.clauses.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No clauses. All tasks match.
          </Typography>
        )}
        {draft.clauses.map((clause) => (
          <QueryClauseRow key={clause.id} clause={clause} />
        ))}
      </div>

      <div className="query-editor__actions">
        <Button startIcon={<AddIcon />} onClick={() => dispatch(clauseAdded())}>
          Add clause
        </Button>
        <div className="query-editor__spacer" />
        <Button
          onClick={() => dispatch(draftCleared())}
          disabled={draft.clauses.length === 0}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          onClick={() => onRun(serializedDraft)}
          disabled={!isDirty}
        >
          Run query
        </Button>
      </div>
    </Paper>
  );
};

export default QueryEditor;
