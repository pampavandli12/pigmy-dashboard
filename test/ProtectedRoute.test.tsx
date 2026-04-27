import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRenderStoreState, renderRoute, resetRenderStores } from './renderTestUtils';
import { ProtectedRoute } from '../src/ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders loading, redirect, and outlet branches', () => {
    const storeState = getRenderStoreState();
    storeState.auth.isHydrated = false;
    expect(renderRoute(<ProtectedRoute />)).toContain('Loading');

    storeState.auth.isHydrated = true;
    storeState.auth.token = null;
    expect(renderRoute(<ProtectedRoute />)).toBe('');

    storeState.auth.token = 'token';
    expect(renderRoute(<ProtectedRoute />)).toContain('Nested child');
  });
});
