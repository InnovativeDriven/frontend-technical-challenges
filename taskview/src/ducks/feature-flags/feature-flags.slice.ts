import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FeatureFlag,
  FeatureFlagValues,
  getDefaultFlags
} from './feature-flags.operations';

interface FeatureFlagsState {
  flags: FeatureFlagValues;
}

const initialState: FeatureFlagsState = {
  flags: getDefaultFlags()
};

export const featureFlags = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    flagToggled: (state, action: PayloadAction<FeatureFlag>) => {
      state.flags[action.payload] = !state.flags[action.payload];
    },
    flagOverridesApplied: (
      state,
      action: PayloadAction<Partial<FeatureFlagValues>>
    ) => {
      state.flags = { ...state.flags, ...action.payload };
    },
    flagsReset: (state) => {
      state.flags = getDefaultFlags();
    }
  }
});

export const { flagToggled, flagOverridesApplied, flagsReset } =
  featureFlags.actions;

export default featureFlags.reducer;
