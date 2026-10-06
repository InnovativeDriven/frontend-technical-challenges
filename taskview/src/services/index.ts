import { Task, TaskChanges, User } from '../types/task';
import { createSeedTasks, SEED_USERS } from './seed-data';

const LATENCY_MS = 300;

let db: { tasks: Task[]; users: User[] } = {
  tasks: createSeedTasks(),
  users: SEED_USERS
};

const respond = <T>(data: T): Promise<{ data: T }> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: structuredClone(data) }), LATENCY_MS)
  );

const getTasks = () => respond(db.tasks);

const getUsers = () => respond(db.users);

const updateTask = (taskId: number, changes: TaskChanges) => {
  const existing = db.tasks.find((task) => task.id === taskId);
  if (!existing) {
    return Promise.reject(new Error(`Task ${taskId} not found`));
  }
  const updated = { ...existing, ...changes };
  db = {
    ...db,
    tasks: db.tasks.map((task) => (task.id === taskId ? updated : task))
  };
  return respond(updated);
};

const updateTasks = (updates: { id: number; changes: TaskChanges }[]) => {
  const changesById = new Map(updates.map(({ id, changes }) => [id, changes]));
  db = {
    ...db,
    tasks: db.tasks.map((task) =>
      changesById.has(task.id) ? { ...task, ...changesById.get(task.id) } : task
    )
  };
  return respond(db.tasks.filter((task) => changesById.has(task.id)));
};

export const services = {
  getTasks,
  getUsers,
  updateTask,
  updateTasks
};
