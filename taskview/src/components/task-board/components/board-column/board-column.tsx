import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Chip, Typography } from '@mui/material';
import { selectIsFlagEnabled } from '../../../../ducks/feature-flags/feature-flags.selectors';
import { STATUS_LABELS } from '../../../../ducks/tasks/tasks.operations';
import { RootState, useAppSelector } from '../../../../store';
import { Task, TaskStatus, User } from '../../../../types/task';
import { classNames } from '../../../../utils/class-names';
import SortableTaskCard from '../sortable-task-card';
import { WIP_LIMITS } from '../../task-board.config';
import './board-column.styles.scss';

interface BoardColumnProps {
  id: string;
  status: TaskStatus;
  tasks: Task[];
  usersById: Record<number, User>;
  dragEnabled: boolean;
  onTaskClick: (taskId: number) => void;
}

const selectWipLimitsEnabled = (state: RootState) =>
  selectIsFlagEnabled(state, 'wipLimits');

const BoardColumn = ({
  id,
  status,
  tasks,
  usersById,
  dragEnabled,
  onTaskClick
}: BoardColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: !dragEnabled });
  const wipLimitsEnabled = useAppSelector(selectWipLimitsEnabled);
  const wipLimit = wipLimitsEnabled ? WIP_LIMITS[status] : undefined;
  const overLimit = wipLimit !== undefined && tasks.length > wipLimit;

  return (
    <section
      className={classNames('board-column', {
        'board-column--over': isOver,
        'board-column--over-limit': overLimit
      })}
    >
      <header className="board-column__header">
        <Typography variant="subtitle2">{STATUS_LABELS[status]}</Typography>
        <Chip
          size="small"
          color={overLimit ? 'error' : 'default'}
          label={wipLimit ? `${tasks.length} / ${wipLimit}` : tasks.length}
        />
      </header>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="board-column__cards">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              assignee={
                task.assigneeId !== null
                  ? usersById[task.assigneeId]
                  : undefined
              }
              disabled={!dragEnabled}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  );
};

export default BoardColumn;
