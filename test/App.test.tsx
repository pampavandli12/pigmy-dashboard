import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRenderStoreState,
  renderRouteNode,
  resetRenderStores,
} from './renderTestUtils';
import App from '../src/App';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the public sign-in route', async () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = null;
    storeState.auth.isHydrated = true;

    const { container, unmount } = renderRouteNode(<App />, '/signin', '*');
    // Views are code-split (React.lazy), so wait for the chunk to resolve.
    await vi.waitFor(() =>
      expect(container.innerHTML).toContain('Bank Admin Portal'),
    );
    unmount();
  });

  it('renders the protected dashboard route', async () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = 'token';
    storeState.auth.isHydrated = true;

    const { container, unmount } = renderRouteNode(<App />, '/', '*');
    await vi.waitFor(() => expect(container.innerHTML).toContain('Dashboard'));
    unmount();
  });
});
