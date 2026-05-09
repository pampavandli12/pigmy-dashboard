import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import { Status } from '../../src/types/sharedEnums';
import Agents from '../../src/views/Agents';

describe('Agents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders agents from the store', () => {
    expect(renderRoute(<Agents />)).toContain('Agent One');
  });

  it('renders loading state and handles agent actions', async () => {
    const storeState = getRenderStoreState();
    storeState.agentStore.fetchAgentLoadingStatus = Status.Loading;
    expect(renderRoute(<Agents />)).toContain('progressbar');

    resetRenderStores();
    storeState.agentStore.agents = [
      ...storeState.agentStore.agents,
      {
        ...storeState.agentStore.agents[0],
        id: 2,
        name: 'Solo',
        agentCode: 88,
        status: 'inactive',
      },
      {
        ...storeState.agentStore.agents[0],
        id: 3,
        name: 'Mystery Status',
        agentCode: 99,
        status: 'paused',
      },
    ];
    const { container, unmount } = renderRouteNode(<Agents />);

    await act(async () => {
      Array.from(container.querySelectorAll('button')).forEach((button) => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });
    await act(async () => {
      Array.from(container.querySelectorAll('button'))
        .find((button) => button.textContent === 'Yes')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(storeState.agentStore.setSelectedAgent).toHaveBeenCalled();
    unmount();
  });
});
