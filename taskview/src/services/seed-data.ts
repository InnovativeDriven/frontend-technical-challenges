import {
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskStatus,
  User
} from '../types/task';

export const SEED_USERS: User[] = [
  { id: 1, name: 'Avery Chen', initials: 'AC' },
  { id: 2, name: 'Jordan Patel', initials: 'JP' },
  { id: 3, name: 'Riley Okafor', initials: 'RO' },
  { id: 4, name: 'Morgan Silva', initials: 'MS' },
  { id: 5, name: 'Casey Nguyen', initials: 'CN' }
];

const TITLES = [
  'Add audit trail to matter exports',
  'Migrate upload widget to new API',
  'Fix pagination on workspace list',
  'Support SSO for client admins',
  'Release notes editor autosave',
  'Bulk-assign users to matters',
  'Dark mode for knowledge base',
  'Retry failed Relativity syncs',
  'Invoice PDF renders blank page',
  'Add CSV export to reports',
  'Throttle search requests',
  'Show upload progress per file',
  'Consolidate date formatting utils',
  'Remove legacy matter settings page',
  'Feature flag cleanup for Q3 flags',
  'Accessibility pass on data grids',
  'Add keyboard shortcuts to board',
  'Cache workspace settings',
  'Investigate slow matter load',
  'Permissions check on backoffice routes',
  'Add tooltips to report filters',
  'Upgrade MUI data grid',
  'Validate file types before upload',
  'Notification center for sync errors',
  'Client logo upload in admin',
  'Copy matter settings between matters',
  'Empty states for all tables',
  'Persist table column widths',
  'Error boundary around remote apps',
  'Session timeout warning dialog'
];

const TAGS = ['frontend', 'api', 'bug', 'ux', 'tech-debt', 'security', 'perf'];

const BASE_DATE = Date.UTC(2026, 9, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const toIsoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const createSeedTasks = (count = 60, seed = 42): Task[] => {
  const random = createRandom(seed);
  const pick = <T>(items: readonly T[]) =>
    items[Math.floor(random() * items.length)];
  const orderByStatus = new Map<TaskStatus, number>();

  return Array.from({ length: count }, (_, index) => {
    const status = pick(TASK_STATUSES);
    const order = orderByStatus.get(status) ?? 0;
    orderByStatus.set(status, order + 1);

    const tagCount = Math.floor(random() * 3);
    const tags = Array.from(
      new Set(Array.from({ length: tagCount }, () => pick(TAGS)))
    );
    const hasAssignee = random() > 0.15;
    const hasEstimate = random() > 0.2;
    const hasDueDate = random() > 0.4;

    return {
      id: index + 1,
      title: `${TITLES[index % TITLES.length]}${index >= TITLES.length ? ' (follow-up)' : ''}`,
      description: `Details for task ${index + 1}.`,
      status,
      priority: pick(TASK_PRIORITIES),
      assigneeId: hasAssignee ? pick(SEED_USERS).id : null,
      tags,
      estimate: hasEstimate ? pick([1, 2, 3, 5, 8, 13]) : null,
      dueDate: hasDueDate
        ? toIsoDate(BASE_DATE + Math.floor(random() * 60 - 20) * DAY_MS)
        : null,
      createdAt: toIsoDate(BASE_DATE - Math.floor(random() * 90) * DAY_MS),
      order
    };
  });
};
