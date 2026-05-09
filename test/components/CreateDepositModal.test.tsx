import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import CreateDepositModal from '../../src/components/CreateDepositModal';

describe('CreateDepositModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders an open deposit modal', () => {
    expect(
      renderRoute(<CreateDepositModal isOpen onClose={vi.fn()} agentCode='77' />),
    ).toContain('Create Deposit');
  });

  it('submits deposit data and closes', async () => {
    const onClose = vi.fn();
    const storeState = getRenderStoreState();
    const { container, unmount } = renderRouteNode(
      <CreateDepositModal isOpen onClose={onClose} agentCode='77' />,
    );
    const inputs = Array.from(container.querySelectorAll('input'));

    act(() => {
      [
        ['100', inputs[0]],
        ['V1', inputs[1]],
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

    expect(storeState.agentStore.createDeposit).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    unmount();
  });
});
