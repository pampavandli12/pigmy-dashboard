import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import { Status } from '../../src/types/sharedEnums';
import Deposits from '../../src/views/Deposits';

describe('Deposits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders deposits for an agent route', () => {
    expect(
      renderRoute(<Deposits />, '/agents/deposits/77', '/agents/deposits/:agentCode'),
    ).toContain('Deposits');
  });

  it('handles deposit filtering, modal opening, and unknown agent rows', () => {
    const storeState = getRenderStoreState();
    storeState.agentStore.fetchAgentLoadingStatus = Status.Idle;
    storeState.agentStore.agents = [];
    const { container, unmount } = renderRouteNode(
      <Deposits />,
      '/agents/deposits/77',
      '/agents/deposits/:agentCode',
    );

    act(() => {
      Array.from(container.querySelectorAll('button')).forEach((button) => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });

    expect(storeState.agentStore.fetchAgents).toHaveBeenCalled();
    expect(storeState.agentStore.exportDepositeById).toHaveBeenCalled();
    unmount();
  });
});
