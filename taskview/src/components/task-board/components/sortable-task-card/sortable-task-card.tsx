import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '../../../../types/task';
import TaskCard from '../../../task-card';

interface SortableTaskCardProps {
  task: Task;
  assignee?: User;
  disabled: boolean;
  onClick: () => void;
}

const SortableTaskCard = ({
  task,
  assignee,
  disabled,
  onClick
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} assignee={assignee} onClick={onClick} />
    </div>
  );
};

export default SortableTaskCard;
