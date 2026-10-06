import { useEffect, useMemo } from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import QueryEditor from '../../components/query-editor';
import TaskTable from '../../components/task-table';
import { selectFeatureFlags } from '../../ducks/feature-flags/feature-flags.selectors';
import { parseQuery, serializeQuery } from '../../ducks/query/query.operations';
import { selectQueryResultRows } from '../../ducks/query/query.selectors';
import { draftLoaded } from '../../ducks/query/query.slice';
import { selectTasksLoading } from '../../ducks/tasks/tasks.selectors';
import { useAppDispatch, useAppSelector } from '../../store';
import { useOpenTask } from '../../utils/use-open-task';
import './query-page.styles.scss';

const QUERY_PARAM = 'q';

const QueryPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { queryView } = useAppSelector(selectFeatureFlags);
  const loading = useAppSelector(selectTasksLoading);
  const openTask = useOpenTask();

  const rawQuery = searchParams.get(QUERY_PARAM);
  const appliedQuery = useMemo(() => parseQuery(rawQuery), [rawQuery]);
  const results = useAppSelector((state) =>
    selectQueryResultRows(state, appliedQuery)
  );

  useEffect(() => {
    dispatch(draftLoaded(appliedQuery));
  }, [dispatch, appliedQuery]);

  const handleRun = (serializedQuery: string) =>
    setSearchParams((params) => {
      if (serializedQuery) {
        params.set(QUERY_PARAM, serializedQuery);
      } else {
        params.delete(QUERY_PARAM);
      }
      return params;
    });

  if (!queryView) {
    return <Navigate to="/board" replace />;
  }

  return (
    <div className="query-page">
      <QueryEditor
        appliedQuery={serializeQuery(appliedQuery)}
        onRun={handleRun}
      />
      <Typography variant="body2" color="text.secondary">
        {results.length} matching {results.length === 1 ? 'task' : 'tasks'}
      </Typography>
      <div className="query-page__results">
        <TaskTable
          rows={results}
          loading={loading}
          onTaskClick={openTask}
          showToolbar={false}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default QueryPage;
