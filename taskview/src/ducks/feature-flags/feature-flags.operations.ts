export const FEATURE_FLAGS = {
  queryView: {
    label: 'Query view',
    description: 'Enables the query editor tab',
    defaultValue: true
  },
  boardDragAndDrop: {
    label: 'Board drag & drop',
    description: 'Lets users move cards between columns',
    defaultValue: true
  },
  wipLimits: {
    label: 'WIP limits',
    description: 'Highlights board columns over their work-in-progress limit',
    defaultValue: false
  }
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export type FeatureFlagValues = Record<FeatureFlag, boolean>;

export const FEATURE_FLAG_KEYS = Object.keys(FEATURE_FLAGS) as FeatureFlag[];

export const getDefaultFlags = (): FeatureFlagValues =>
  FEATURE_FLAG_KEYS.reduce(
    (flags, key) => ({ ...flags, [key]: FEATURE_FLAGS[key].defaultValue }),
    {} as FeatureFlagValues
  );

const isFeatureFlag = (key: string): key is FeatureFlag =>
  FEATURE_FLAG_KEYS.includes(key as FeatureFlag);

export const parseFlagOverrides = (
  param: string | null
): Partial<FeatureFlagValues> => {
  if (!param) {
    return {};
  }
  return param.split(',').reduce<Partial<FeatureFlagValues>>((flags, raw) => {
    const token = raw.trim();
    const enabled = !token.startsWith('-');
    const key = enabled ? token : token.slice(1);
    return isFeatureFlag(key) ? { ...flags, [key]: enabled } : flags;
  }, {});
};
