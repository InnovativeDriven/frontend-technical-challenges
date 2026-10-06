import { useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { selectIsFlagEnabled } from '../../ducks/feature-flags/feature-flags.selectors';
import { moveTaskOnBoard } from '../../ducks/tasks/tasks.slice';
import { selectTasksByStatus } from '../../ducks/tasks/tasks.selectors';
import { selectUsersById } from '../../ducks/users/users.selectors';
import { RootState, useAppDispatch, useAppSelector } from '../../store';
import { TASK_STATUSES } from '../../types/task';
import TaskCard from '../task-card';
import BoardColumn from './components/board-column';
import { getColumnId, resolveDropTarget } from './task-board.config';
import './task-board.styles.scss';

interface TaskBoardProps {
  onTaskClick: (taskId: number) => void;
}

const selectDragAndDropEnabled = (state: RootState) =>
  selectIsFlagEnabled(state, 'boardDragAndDrop');

const TaskBoard = ({ onTaskClick }: TaskBoardProps) => {
  const dispatch = useAppDispatch();
  const tasksByStatus = useAppSelector(selectTasksByStatus);
  const usersById = useAppSelector(selectUsersById);
  const dragEnabled = useAppSelector(selectDragAndDropEnabled);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeTask = TASK_STATUSES.flatMap(
    (status) => tasksByStatus[status]
  ).find((task) => task.id === activeTaskId);

  const handleDragStart = ({ active }: DragStartEvent) =>
    setActiveTaskId(Number(active.id));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null);
    const target = over && resolveDropTarget(tasksByStatus, over.id);
    if (!target) {
      return;
    }
    dispatch(moveTaskOnBoard({ taskId: Number(active.id), ...target }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTaskId(null)}
    >
      <div className="task-board">
        {TASK_STATUSES.map((status) => (
          <BoardColumn
            key={status}
            id={getColumnId(status)}
            status={status}
            tasks={tasksByStatus[status]}
            usersById={usersById}
            dragEnabled={dragEnabled}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            assignee={
              activeTask.assigneeId !== null
                ? usersById[activeTask.assigneeId]
                : undefined
            }
            isOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
