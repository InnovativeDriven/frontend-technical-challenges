import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { getTaskKey, parseTaskId } from '../../ducks/tasks/tasks.operations';
import {
  selectTaskById,
  selectTasksLoading
} from '../../ducks/tasks/tasks.selectors';
import { useAppSelector } from '../../store';
import TaskDetailForm from './components/task-detail-form';
import './task-detail-dialog.styles.scss';

const TaskDetailDialog = () => {
  const { taskId: taskIdParam } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const taskId = parseTaskId(taskIdParam);
  const task = useAppSelector((state) => selectTaskById(state, taskId));
  const loading = useAppSelector(selectTasksLoading);

  const handleClose = () => navigate({ pathname: '..', search });

  const renderContent = () => {
    if (task) {
      return <TaskDetailForm key={task.id} task={task} onClose={handleClose} />;
    }
    if (loading) {
      return (
        <DialogContent className="task-detail-dialog__loading">
          <CircularProgress />
        </DialogContent>
      );
    }
    return (
      <DialogContent>
        <Alert severity="warning">
          Task &quot;{taskIdParam}&quot; was not found.
        </Alert>
      </DialogContent>
    );
  };

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{task ? getTaskKey(task.id) : 'Task'}</DialogTitle>
      {renderContent()}
    </Dialog>
  );
};

export default TaskDetailDialog;
