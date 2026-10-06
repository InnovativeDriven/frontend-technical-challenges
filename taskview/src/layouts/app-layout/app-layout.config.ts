import { FeatureFlag } from '../../ducks/feature-flags/feature-flags.operations';

export const VIEW_TABS: { path: string; label: string; flag?: FeatureFlag }[] =
  [
    { path: '/board', label: 'Board' },
    { path: '/table', label: 'Table' },
    { path: '/query', label: 'Query', flag: 'queryView' }
  ];
