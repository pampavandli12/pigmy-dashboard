import { describe, expect, it } from 'vitest';
import { useAlertStore } from '../../src/store/AlertStore';
import { Severity } from '../../src/types/sharedEnums';

describe('AlertStore', () => {
  it('stores alert details', () => {
    useAlertStore.getState().showAlert(true, 'Saved', Severity.Info);
    expect(useAlertStore.getState().alert).toEqual({
      open: true,
      message: 'Saved',
      severity: Severity.Info,
    });
  });
});

