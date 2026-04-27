import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRenderStoreState, renderRoute, resetRenderStores } from '../renderTestUtils';
import Signin from '../../src/views/Signin';

describe('Signin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the sign in page when logged out', () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = null;
    expect(renderRoute(<Signin />, '/signin', '/signin')).toContain(
      'Bank Admin Portal',
    );
  });
});
