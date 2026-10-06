import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';
import type { TaskRow } from '../../ducks/tasks/tasks.selectors';
import { TASK_TABLE_COLUMNS } from './task-table.config';
import './task-table.styles.scss';

interface TaskTableProps {
  rows: TaskRow[];
  loading: boolean;
  onTaskClick: (taskId: number) => void;
  showToolbar?: boolean;
}

const TaskTable = ({
  rows,
  loading,
  onTaskClick,
  showToolbar = true
}: TaskTableProps) => (
  <div className="task-table">
    <DataGridPro
      rows={rows}
      columns={TASK_TABLE_COLUMNS}
      loading={loading}
      density="compact"
      disableRowSelectionOnClick
      onRowClick={({ row }) => onTaskClick(row.id)}
      slots={showToolbar ? { toolbar: GridToolbar } : undefined}
      slotProps={{ toolbar: { showQuickFilter: true } }}
      initialState={{
        sorting: { sortModel: [{ field: 'key', sort: 'asc' }] }
      }}
    />
  </div>
);

export default TaskTable;
