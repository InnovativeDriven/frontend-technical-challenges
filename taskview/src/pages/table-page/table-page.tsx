import { Outlet } from 'react-router-dom';
import TaskTable from '../../components/task-table';
import {
  selectTaskRows,
  selectTasksLoading
} from '../../ducks/tasks/tasks.selectors';
import { useAppSelector } from '../../store';
import { useOpenTask } from '../../utils/use-open-task';
import './table-page.styles.scss';

const TablePage = () => {
  const rows = useAppSelector(selectTaskRows);
  const loading = useAppSelector(selectTasksLoading);
  const openTask = useOpenTask();

  return (
    <div className="table-page">
      <TaskTable rows={rows} loading={loading} onTaskClick={openTask} />
      <Outlet />
    </div>
  );
};

export default TablePage;
