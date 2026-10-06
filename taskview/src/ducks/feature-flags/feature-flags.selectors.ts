import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { FeatureFlag } from './feature-flags.operations';

const getFeatureFlagsState = (state: RootState) => state.featureFlags;

export const selectFeatureFlags = createSelector(
  [getFeatureFlagsState],
  ({ flags }) => flags
);

export const selectIsFlagEnabled = createSelector(
  [selectFeatureFlags, (_state: RootState, flag: FeatureFlag) => flag],
  (flags, flag) => flags[flag]
);
