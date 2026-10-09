import React, { useEffect, useRef, useState } from 'react';
import { Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import {
  DRAWER_TRANSITION_MS,
  getAdjacentTaskId,
  getPaddedTaskKey
} from '../../ducks/drawer/drawer.operations';
import { selectDrawer } from '../../ducks/drawer/drawer.selectors';
import {
  drawerClosed,
  drawerMeasured,
  drawerOpened
} from '../../ducks/drawer/drawer.slice';
import { selectTasksByStatus } from '../../ducks/tasks/tasks.selectors';
import { useAppDispatch, useAppSelector } from '../../store';
import TaskCard from '../task-card';
import TaskDetailForm from '../task-detail-dialog/components/task-detail-form';
import { DRAWER_WIDTH, trackDrawerEvent } from './task-drawer.config';
import './task-drawer.styles.scss';

/**
 * TaskDrawerContent
 *
 * Renders the contents of the task drawer: a header with the task key and
 * a close button, a preview of the task card, and the task detail form.
 *
 * This component also registers keyboard shortcuts so that users can
 * navigate between tasks without leaving the drawer:
 * - Escape closes the drawer.
 * - ArrowDown opens the next task in the same column.
 * - ArrowUp opens the previous task in the same column.
 *
 * @param props - The component props.
 * @param props.task - The task to display.
 * @param props.assignee - The user the task is assigned to, if any.
 * @param props.compact - Whether the drawer should use the compact layout.
 * @param props.onClose - Callback invoked when the drawer should close.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TaskDrawerContent: React.FC<any> = function (props) {
  const dispatch = useAppDispatch();
  const tasksByStatus = useAppSelector(selectTasksByStatus);

  /**
   * Handles keyboard shortcuts for the drawer.
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      props.onClose();
      return;
    }
    if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
      const nextId = getAdjacentTaskId(
        tasksByStatus,
        props.task,
        event.key == 'ArrowDown' ? 1 : -1
      );
      const nextTask = Object.values(tasksByStatus)
        .flat()
        .find((task) => task.id == nextId);
      if (nextTask) {
        dispatch(drawerOpened({ task: nextTask, openedAt: Date.now() }));
      }
    }
  }

  /**
   * Registers the keyboard listener once when the drawer content mounts.
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // handleKeyDown only reads props and dispatch, which are stable, so it is
    // safe to register it once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dueLabel = props.task.dueDate
    ? moment(props.task.dueDate).fromNow()
    : null;

  return (
    <div className={cx('task-drawer__content', { compact: props.compact })}>
      <div className="task-drawer__header">
        <h1>{getPaddedTaskKey(props.task.id)}</h1>
        <IconButton onClick={props.onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
      {dueLabel && (
        <Typography variant="caption" className="task-drawer__due">
          Due {dueLabel}
        </Typography>
      )}
      <div className="task-drawer__preview">
        <TaskCard task={props.task} assignee={props.assignee} />
      </div>
      <div className="task-drawer__form">
        <TaskDetailForm
          key={props.task.id}
          task={props.task}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
};

/**
 * TaskDrawer
 *
 * A drawer that slides in from the right-hand side of the board page and
 * shows the details of the selected task. The drawer reads its state from
 * the drawer slice, which keeps it fully decoupled from the router and
 * the rest of the board.
 *
 * The drawer manages its own transition phase ('closed' | 'opening' |
 * 'open' | 'closing') so that the content stays mounted while the drawer
 * animates out, giving users a smooth and seamless experience.
 */
const TaskDrawer: React.FC = function () {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector(selectDrawer);
  const paperRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>(
    'closed'
  );

  /**
   * When the drawer opens, move through the opening phase and then into the
   * open phase once the transition has finished.
   */
  useEffect(() => {
    if (drawer.open) {
      setPhase('opening');
      setTimeout(() => setPhase('open'), DRAWER_TRANSITION_MS);
      trackDrawerEvent('drawer_opened', _.get(drawer, 'task.id', 0));
    }
  }, [drawer.open]);

  /**
   * Measures the drawer after each paint so that the compact layout can be
   * applied on smaller screens. requestAnimationFrame ensures we only
   * measure once per frame, so this is cheap.
   */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      dispatch(
        drawerMeasured({
          width: paperRef.current?.offsetWidth ?? DRAWER_WIDTH,
          height: paperRef.current?.offsetHeight ?? 0
        })
      );
    });
    return () => cancelAnimationFrame(frame);
  });

  /**
   * Closes the drawer. The task is cleared from the store only after the
   * closing transition has finished, so the content does not disappear
   * while the drawer is still animating.
   */
  const handleClose = () => {
    setPhase('closing');
    setTimeout(() => {
      setPhase('closed');
      dispatch(drawerClosed());
    }, DRAWER_TRANSITION_MS);
  };

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={phase == 'opening' || phase == 'open'}
      className="task-drawer"
      PaperProps={{ ref: paperRef }}
    >
      {drawer.task && (
        <TaskDrawerContent
          task={drawer.task}
          assignee={drawer.assignee}
          compact={drawer.compact}
          onClose={handleClose}
        />
      )}
    </Drawer>
  );
};

export default TaskDrawer;
