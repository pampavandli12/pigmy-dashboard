import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import Main from '../../src/views/Main';

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the bank shell', () => {
    expect(renderRoute(<Main />)).toContain('Test Bank');
  });

  it('handles drawer toggle and logout', () => {
    const storeState = getRenderStoreState();
    storeState.auth.bankName = null;
    const { container, unmount } = renderRouteNode(<Main />);

    act(() => {
      Array.from(container.querySelectorAll('button')).forEach((button) => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });

    expect(storeState.auth.token).toBeNull();
    unmount();
  });
});
