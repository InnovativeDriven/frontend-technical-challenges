import { Navigate, Route, Routes } from 'react-router-dom';
import TaskDetailDialog from './components/task-detail-dialog';
import AppLayout from './layouts/app-layout';
import BoardPage from './pages/board-page';
import QueryPage from './pages/query-page';
import TablePage from './pages/table-page';

const taskDetailRoute = (
  <Route path="tasks/:taskId" element={<TaskDetailDialog />} />
);

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Navigate to="board" replace />} />
      <Route path="board" element={<BoardPage />}>
        {taskDetailRoute}
      </Route>
      <Route path="table" element={<TablePage />}>
        {taskDetailRoute}
      </Route>
      <Route path="query" element={<QueryPage />}>
        {taskDetailRoute}
      </Route>
      <Route path="*" element={<Navigate to="/board" replace />} />
    </Route>
  </Routes>
);

export default App;
