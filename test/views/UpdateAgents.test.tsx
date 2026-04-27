import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getRenderStoreState, renderRoute, resetRenderStores } from '../renderTestUtils';
import { Status } from '../../src/types/sharedEnums';
import UpdateAgents from '../../src/views/UpdateAgents';

describe('UpdateAgents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders loading and edit states', () => {
    const storeState = getRenderStoreState();
    storeState.agentStore.fetchAgentByCodeLoadingStatus = Status.Loading;
    expect(
      renderRoute(<UpdateAgents />, '/agents/editAgent/77', '/agents/editAgent/:agentCode'),
    ).toContain('progressbar');

    storeState.agentStore.fetchAgentByCodeLoadingStatus = Status.Success;
    expect(
      renderRoute(<UpdateAgents />, '/agents/editAgent/77', '/agents/editAgent/:agentCode'),
    ).toContain('Agent Code');
  });
});
