import { ChipProps } from '@mui/material';
import { TaskPriority } from '../../types/task';

export const PRIORITY_COLORS: Record<TaskPriority, ChipProps['color']> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  critical: 'error'
};
