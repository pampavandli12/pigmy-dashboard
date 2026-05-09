import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import Signin from '../../src/views/Signin';
import { login } from '../../src/services/login';

vi.mock('../../src/services/login', () => ({
  login: vi.fn(),
}));

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

  it('redirects when logged in and submits login form', async () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = 'token';
    expect(renderRoute(<Signin />, '/signin', '/signin')).not.toContain(
      'Bank Admin Portal',
    );

    storeState.auth.token = null;
    const { container, unmount } = renderRouteNode(
      <Signin />,
      '/signin',
      '/signin',
    );
    vi.mocked(login).mockResolvedValue({
      token: 'new-token',
      bankName: 'New Bank',
      bankCode: 'NEW',
    });

    const inputs = Array.from(container.querySelectorAll('input'));

    act(() => {
      [
        ['BK', inputs[0]],
        ['admin', inputs[1]],
        ['secret1', inputs[2]],
      ].forEach(([value, input]) => {
        if (input instanceof HTMLInputElement) {
          Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
          )?.set?.call(input, value as string);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    await act(async () => {
      container
        .querySelector('form')
        ?.dispatchEvent(new SubmitEvent('submit', { bubbles: true }));
    });

    expect(login).toHaveBeenCalled();
    unmount();
  });

  it('shows login failures', async () => {
    const storeState = getRenderStoreState();
    storeState.auth.token = null;
    vi.mocked(login).mockRejectedValue(new Error('bad credentials'));
    const { container, unmount } = renderRouteNode(
      <Signin />,
      '/signin',
      '/signin',
    );

    const inputs = Array.from(container.querySelectorAll('input'));

    act(() => {
      [
        ['BK', inputs[0]],
        ['admin', inputs[1]],
        ['secret1', inputs[2]],
      ].forEach(([value, input]) => {
        if (input instanceof HTMLInputElement) {
          Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
          )?.set?.call(input, value as string);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    await act(async () => {
      container
        .querySelector('form')
        ?.dispatchEvent(new SubmitEvent('submit', { bubbles: true }));
    });

    expect(login).toHaveBeenCalled();
    unmount();
  });
});
