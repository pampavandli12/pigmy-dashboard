import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRenderStoreState, renderRoute, resetRenderStores } from '../renderTestUtils';
import AlertProvider from '../../src/providers/AlertProvider';

describe('AlertProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the active alert around children', () => {
    const storeState = getRenderStoreState();
    storeState.alert.showAlert(true, 'Provider alert', 'warning');
    expect(renderRoute(<AlertProvider>Child</AlertProvider>)).toContain(
      'Provider alert',
    );
  });
});
