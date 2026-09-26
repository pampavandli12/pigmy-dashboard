import { describe, expect, it } from 'vitest';
import { banksoftHandler } from '../../src/bankTypes/banksoft';
import { getBankTypeHandler } from '../../src/bankTypes';

describe('getBankTypeHandler', () => {
  it('returns the handler for a known bank type', () => {
    expect(getBankTypeHandler('banksoft')).toBe(banksoftHandler);
  });

  it('falls back to banksoft when bank type is missing', () => {
    expect(getBankTypeHandler(null)).toBe(banksoftHandler);
  });

  it('throws for an unsupported bank type', () => {
    expect(() => getBankTypeHandler('unknown')).toThrow(
      'Unsupported bank type: unknown',
    );
  });
});
