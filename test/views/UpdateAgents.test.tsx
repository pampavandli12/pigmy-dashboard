import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { getRenderStoreState, renderRoute, resetRenderStores } from '../renderTestUtils';
import { Status } from '../../src/types/sharedEnums';
import UpdateAgents from '../../src/views/UpdateAgents';

vi.mock('../../src/components/AgentForm', () => ({
  default: ({
    callback,
    defaultValues,
  }: {
    callback: (data: unknown) => void;
    defaultValues: unknown;
  }) => {
    callback({
      name: 'Agent One',
      address: 'Town',
      password: 'secret1',
      phone: '9876543210',
      email: 'agent@example.com',
      agentCode: 77,
      type: 'agent',
      status: 'active',
      limitAmount: 1000,
    });
    return <div>Agent Code {JSON.stringify(defaultValues)}</div>;
  },
}));

describe('UpdateAgents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
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

    act(() => {
      vi.runAllTimers();
    });
  });
});
