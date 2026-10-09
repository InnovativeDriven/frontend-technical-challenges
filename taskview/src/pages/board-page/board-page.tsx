import { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import TaskBoard from '../../components/task-board';
import TaskDrawer from '../../components/task-drawer';
import { drawerOpened } from '../../ducks/drawer/drawer.slice';
import { selectAllTasks } from '../../ducks/tasks/tasks.selectors';
import { useAppDispatch, useAppSelector } from '../../store';
import './board-page.styles.scss';

const BoardPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);

  const handleTaskClick = useCallback(
    (taskId: number) => {
      const task = tasks.find(({ id }) => id === taskId);
      if (task) {
        dispatch(drawerOpened({ task, openedAt: Date.now() }));
      }
    },
    [dispatch, tasks]
  );

  return (
    <div className="board-page">
      <TaskBoard onTaskClick={handleTaskClick} />
      <TaskDrawer />
      <Outlet />
    </div>
  );
};

export default BoardPage;
