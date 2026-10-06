import { describe, expect, it } from 'vitest';
import { parseFlagOverrides } from './feature-flags.operations';

describe('parseFlagOverrides', () => {
  it('returns no overrides for a missing param', () => {
    expect(parseFlagOverrides(null)).toEqual({});
  });

  it('enables, disables, and ignores unknown flags', () => {
    expect(parseFlagOverrides('wipLimits, -queryView,unknown')).toEqual({
      wipLimits: true,
      queryView: false
    });
  });
});
