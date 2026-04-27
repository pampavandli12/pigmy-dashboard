import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRenderStoreState, renderRoute, resetRenderStores } from './renderTestUtils';
import App from '../src/App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders public and protected route trees', () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = null;
    storeState.auth.isHydrated = true;
    expect(renderRoute(<App />, '/signin', '*')).toContain('Bank Admin Portal');

    storeState.auth.token = 'token';
    expect(renderRoute(<App />, '/', '*')).toContain('Dashboard');
  });
});
