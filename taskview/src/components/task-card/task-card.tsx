import { Avatar, Card, CardActionArea, Chip, Typography } from '@mui/material';
import { getTaskKey } from '../../ducks/tasks/tasks.operations';
import { Task, User } from '../../types/task';
import { classNames } from '../../utils/class-names';
import { PRIORITY_COLORS } from './task-card.config';
import './task-card.styles.scss';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  isOverlay?: boolean;
  onClick?: () => void;
}

const TaskCard = ({ task, assignee, isOverlay, onClick }: TaskCardProps) => (
  <Card
    className={classNames('task-card', { 'task-card--overlay': isOverlay })}
    variant="outlined"
  >
    <CardActionArea className="task-card__body" onClick={onClick}>
      <div className="task-card__meta">
        <Typography variant="caption" color="text.secondary">
          {getTaskKey(task.id)}
        </Typography>
        <Chip
          size="small"
          label={task.priority}
          color={PRIORITY_COLORS[task.priority]}
          variant="outlined"
        />
      </div>
      <Typography variant="body2" className="task-card__title">
        {task.title}
      </Typography>
      {task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.map((tag) => (
            <span key={tag} className="task-card__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="task-card__footer">
        <Typography variant="caption" color="text.secondary">
          {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
          {task.estimate !== null && ` · ${task.estimate} pts`}
        </Typography>
        {assignee && (
          <Avatar className="task-card__avatar" title={assignee.name}>
            {assignee.initials}
          </Avatar>
        )}
      </div>
    </CardActionArea>
  </Card>
);

export default TaskCard;
