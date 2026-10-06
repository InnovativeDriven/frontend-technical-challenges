import { useEffect } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Alert, AppBar, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import FeatureFlagMenu from '../../components/feature-flag-menu';
import { flagOverridesApplied } from '../../ducks/feature-flags/feature-flags.slice';
import { parseFlagOverrides } from '../../ducks/feature-flags/feature-flags.operations';
import { selectFeatureFlags } from '../../ducks/feature-flags/feature-flags.selectors';
import { fetchTasks } from '../../ducks/tasks/tasks.slice';
import { selectTasksError } from '../../ducks/tasks/tasks.selectors';
import { fetchUsers } from '../../ducks/users/users.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { VIEW_TABS } from './app-layout.config';
import './app-layout.styles.scss';

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const flags = useAppSelector(selectFeatureFlags);
  const error = useAppSelector(selectTasksError);
  const flagParam = searchParams.get('ff');

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(flagOverridesApplied(parseFlagOverrides(flagParam)));
  }, [dispatch, flagParam]);

  const tabs = VIEW_TABS.filter(({ flag }) => !flag || flags[flag]);
  const activeTab = tabs.find(({ path }) => pathname.startsWith(path));

  return (
    <div className="app-layout">
      <AppBar position="static" elevation={0}>
        <Toolbar className="app-layout__toolbar">
          <Typography variant="h6" component="h1">
            AccessID TaskView
          </Typography>
          <Tabs
            value={activeTab?.path ?? false}
            textColor="inherit"
            TabIndicatorProps={{ className: 'app-layout__tab-indicator' }}
          >
            {tabs.map(({ path, label }) => (
              <Tab
                key={path}
                value={path}
                label={label}
                component={Link}
                to={path}
              />
            ))}
          </Tabs>
          <div className="app-layout__spacer" />
          <FeatureFlagMenu />
        </Toolbar>
      </AppBar>
      {error && (
        <Alert severity="error" className="app-layout__error">
          {error}
        </Alert>
      )}
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
