import { GridColDef } from '@mui/x-data-grid-pro';
import { STATUS_LABELS } from '../../ducks/tasks/tasks.operations';
import type { TaskRow } from '../../ducks/tasks/tasks.selectors';
import { TASK_PRIORITIES, TASK_STATUSES, TaskStatus } from '../../types/task';

export const TASK_TABLE_COLUMNS: GridColDef<TaskRow>[] = [
  {
    field: 'key',
    headerName: 'Key',
    width: 90,
    sortComparator: (_a, _b, first, second) =>
      Number(first.id) - Number(second.id)
  },
  { field: 'title', headerName: 'Title', flex: 1, minWidth: 240 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    type: 'singleSelect',
    valueOptions: TASK_STATUSES.map((value) => ({
      value,
      label: STATUS_LABELS[value]
    })),
    valueFormatter: ({ value }) => STATUS_LABELS[value as TaskStatus]
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 110,
    type: 'singleSelect',
    valueOptions: [...TASK_PRIORITIES]
  },
  { field: 'assigneeName', headerName: 'Assignee', width: 150 },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 180,
    sortable: false,
    valueGetter: ({ row }) => row.tags.join(', ')
  },
  { field: 'estimate', headerName: 'Estimate', type: 'number', width: 100 },
  { field: 'dueDate', headerName: 'Due', width: 120 },
  { field: 'createdAt', headerName: 'Created', width: 120 }
];
