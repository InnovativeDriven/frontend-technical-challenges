# AccessID TaskView

A fake task-tracking product used as the base for frontend interview challenges. All data is in memory and resets on reload.

## Setup

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:9040
```

| Script              | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Vite dev server                  |
| `npm run build`     | Typecheck and production build   |
| `npm run lint`      | ESLint + Prettier                |
| `npm run typecheck` | `tsc --noEmit`                   |
| `npm test`          | Vitest unit tests for operations |

## Routes

| Path                      | View                                                |
| ------------------------- | --------------------------------------------------- |
| `/board`                  | Kanban board with drag and drop                     |
| `/table`                  | MUI DataGrid of all tasks                           |
| `/query?q=...`            | Query editor; the applied query is stored in `q`    |
| `/<view>/tasks/:taskId`   | Task detail dialog over any view                    |
| any route `?ff=a,-b`      | Feature flag overrides (`-` disables)               |

Feature flags: `queryView`, `boardDragAndDrop`, `wipLimits`. They can also be toggled from the flag icon in the header.

## Structure

```
src/
  services/        fake API with simulated latency; seed data is deterministic
  ducks/<name>/    <name>.slice.ts, <name>.selectors.ts, <name>.operations.ts (+ tests)
  components/<name>/
                   index.ts, <name>.tsx, <name>.styles.scss, <name>.config.ts
                   components/ for child components used only by this one
  layouts/         app shell
  pages/           route-level components
```

Ducks: `tasks`, `users`, `query` (editor draft), `featureFlags`.

The query editor supports a single level of clauses joined by AND or OR. The URL holds the applied query; Redux holds the unsaved draft.
