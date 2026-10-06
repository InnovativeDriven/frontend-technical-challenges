import { IconButton, MenuItem, TextField, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  getOperatorsForField,
  OPERATOR_LABELS,
  operatorNeedsValue,
  QUERY_FIELDS
} from '../../../../ducks/query/query.operations';
import {
  clauseFieldChanged,
  clauseRemoved,
  clauseUpdated
} from '../../../../ducks/query/query.slice';
import { selectAllUsers } from '../../../../ducks/users/users.selectors';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  QueryClause,
  QueryField,
  QueryOperator
} from '../../../../types/query';
import { FIELD_KEYS, INPUT_TYPES } from './query-clause-row.config';
import './query-clause-row.styles.scss';

interface QueryClauseRowProps {
  clause: QueryClause;
}

const QueryClauseRow = ({ clause }: QueryClauseRowProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const fieldConfig = QUERY_FIELDS[clause.field];
  const userOptions = users.map(({ id, name }) => ({
    value: String(id),
    label: name
  }));
  const options =
    fieldConfig.type === 'user' ? userOptions : fieldConfig.options;

  const updateClause = (
    changes: Partial<Pick<QueryClause, 'operator' | 'value'>>
  ) => dispatch(clauseUpdated({ id: clause.id, changes }));

  return (
    <div className="query-clause-row">
      <TextField
        select
        size="small"
        label="Field"
        className="query-clause-row__field"
        value={clause.field}
        onChange={(event) =>
          dispatch(
            clauseFieldChanged({
              id: clause.id,
              field: event.target.value as QueryField
            })
          )
        }
      >
        {FIELD_KEYS.map((field) => (
          <MenuItem key={field} value={field}>
            {QUERY_FIELDS[field].label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Operator"
        className="query-clause-row__operator"
        value={clause.operator}
        onChange={(event) =>
          updateClause({ operator: event.target.value as QueryOperator })
        }
      >
        {getOperatorsForField(clause.field).map((operator) => (
          <MenuItem key={operator} value={operator}>
            {OPERATOR_LABELS[operator]}
          </MenuItem>
        ))}
      </TextField>

      {operatorNeedsValue(clause.operator) &&
        (options ? (
          <TextField
            select
            size="small"
            label="Value"
            className="query-clause-row__value"
            value={clause.value}
            onChange={(event) => updateClause({ value: event.target.value })}
          >
            {options.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            size="small"
            label="Value"
            className="query-clause-row__value"
            type={INPUT_TYPES[fieldConfig.type]}
            InputLabelProps={{ shrink: true }}
            value={clause.value}
            onChange={(event) => updateClause({ value: event.target.value })}
          />
        ))}

      <Tooltip title="Remove clause">
        <IconButton
          size="small"
          onClick={() => dispatch(clauseRemoved(clause.id))}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default QueryClauseRow;
