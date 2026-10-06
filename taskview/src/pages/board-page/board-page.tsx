import { Outlet } from 'react-router-dom';
import TaskBoard from '../../components/task-board';
import { useOpenTask } from '../../utils/use-open-task';
import './board-page.styles.scss';

const BoardPage = () => {
  const openTask = useOpenTask();

  return (
    <div className="board-page">
      <TaskBoard onTaskClick={openTask} />
      <Outlet />
    </div>
  );
};

export default BoardPage;
