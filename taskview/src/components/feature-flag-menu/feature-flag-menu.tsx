import { MouseEvent, useState } from 'react';
import {
  Button,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip
} from '@mui/material';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import {
  FEATURE_FLAG_KEYS,
  FEATURE_FLAGS
} from '../../ducks/feature-flags/feature-flags.operations';
import { selectFeatureFlags } from '../../ducks/feature-flags/feature-flags.selectors';
import {
  flagsReset,
  flagToggled
} from '../../ducks/feature-flags/feature-flags.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import './feature-flag-menu.styles.scss';

const FeatureFlagMenu = () => {
  const dispatch = useAppDispatch();
  const flags = useAppSelector(selectFeatureFlags);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Feature flags">
        <IconButton color="inherit" onClick={handleOpen}>
          <FlagOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {FEATURE_FLAG_KEYS.map((key) => (
          <MenuItem
            key={key}
            className="feature-flag-menu__item"
            onClick={() => dispatch(flagToggled(key))}
          >
            <ListItemText
              primary={FEATURE_FLAGS[key].label}
              secondary={FEATURE_FLAGS[key].description}
            />
            <Switch edge="end" checked={flags[key]} tabIndex={-1} />
          </MenuItem>
        ))}
        <Divider />
        <div className="feature-flag-menu__footer">
          <Button size="small" onClick={() => dispatch(flagsReset())}>
            Reset to defaults
          </Button>
        </div>
      </Menu>
    </>
  );
};

export default FeatureFlagMenu;
