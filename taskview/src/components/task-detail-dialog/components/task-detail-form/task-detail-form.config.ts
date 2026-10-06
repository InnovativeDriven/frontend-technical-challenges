import { Task, TaskChanges } from '../../../../types/task';

export const toFormValues = (task: Task) => ({
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  assigneeId: task.assigneeId === null ? '' : String(task.assigneeId),
  estimate: task.estimate === null ? '' : String(task.estimate),
  dueDate: task.dueDate ?? ''
});

export type TaskFormValues = ReturnType<typeof toFormValues>;

export const toTaskChanges = (values: TaskFormValues): TaskChanges => ({
  title: values.title.trim(),
  description: values.description,
  status: values.status,
  priority: values.priority,
  assigneeId: values.assigneeId === '' ? null : Number(values.assigneeId),
  estimate: values.estimate === '' ? null : Number(values.estimate),
  dueDate: values.dueDate === '' ? null : values.dueDate
});
