import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useOpenTask = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  return useCallback(
    (taskId: number) => navigate({ pathname: `tasks/${taskId}`, search }),
    [navigate, search]
  );
};
