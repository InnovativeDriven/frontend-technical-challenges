import { useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField
} from '@mui/material';
import { STATUS_LABELS } from '../../../../ducks/tasks/tasks.operations';
import { updateTask } from '../../../../ducks/tasks/tasks.slice';
import { selectIsTaskSaving } from '../../../../ducks/tasks/tasks.selectors';
import { selectAllUsers } from '../../../../ducks/users/users.selectors';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskPriority,
  TaskStatus
} from '../../../../types/task';
import { toFormValues, toTaskChanges } from './task-detail-form.config';
import './task-detail-form.styles.scss';

interface TaskDetailFormProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailForm = ({ task, onClose }: TaskDetailFormProps) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const saving = useAppSelector((state) => selectIsTaskSaving(state, task.id));
  const [values, setValues] = useState(() => toFormValues(task));

  const setValue = <K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K]
  ) => setValues((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    const result = await dispatch(
      updateTask({ taskId: task.id, changes: toTaskChanges(values) })
    );
    if (updateTask.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <>
      <DialogContent className="task-detail-form">
        <TextField
          label="Title"
          value={values.title}
          onChange={(event) => setValue('title', event.target.value)}
          fullWidth
          required
        />
        <div className="task-detail-form__row">
          <TextField
            select
            label="Status"
            value={values.status}
            onChange={(event) =>
              setValue('status', event.target.value as TaskStatus)
            }
            fullWidth
          >
            {TASK_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            value={values.priority}
            onChange={(event) =>
              setValue('priority', event.target.value as TaskPriority)
            }
            fullWidth
          >
            {TASK_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="task-detail-form__row">
          <TextField
            select
            label="Assignee"
            value={values.assigneeId}
            onChange={(event) => setValue('assigneeId', event.target.value)}
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={String(user.id)}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Estimate"
            type="number"
            value={values.estimate}
            onChange={(event) => setValue('estimate', event.target.value)}
            fullWidth
          />
          <TextField
            label="Due date"
            type="date"
            value={values.dueDate}
            onChange={(event) => setValue('dueDate', event.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </div>
        <TextField
          label="Description"
          value={values.description}
          onChange={(event) => setValue('description', event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || values.title.trim() === ''}
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
};

export default TaskDetailForm;
