import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Status, type Agent } from '../../src/types/sharedEnums';

const agentApi = vi.hoisted(() => ({
  fetchAgents: vi.fn(),
}));
const accountApi = vi.hoisted(() => ({
  fetchUserAccounts: vi.fn(),
  uploadUserAccount: vi.fn(),
}));

vi.mock('../../src/services/agents', () => ({
  fetchAgents: agentApi.fetchAgents,
}));
vi.mock('../../src/services/account', () => accountApi);

import { useAccountStore } from '../../src/store/AccountStore';
import { useAgentStore } from '../../src/store/AgentStore';

const agent: Agent = {
  id: 1,
  name: 'Agent One',
  address: 'Town',
  phone: '9876543210',
  email: 'agent@example.com',
  agentCode: 77,
  bankCode: 'BANK1',
  type: 'agent',
  status: 'active',
  limitAmount: 1000,
};

describe('AccountStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAgentStore.setState({
      fetchAgentLoadingStatus: Status.Idle,
      agents: [],
    });
    useAccountStore.setState({
      uploadUserAccountStatus: Status.Idle,
      userAccounts: [],
      userAccountsLoadingStatus: Status.Idle,
    });
  });

  it('fetches and uploads accounts with status updates', async () => {
    agentApi.fetchAgents.mockResolvedValue([agent]);
    accountApi.fetchUserAccounts.mockResolvedValue([
      {
        schemeId: '001',
        userId: 1,
        accountNumber: 100,
        customerName: 'Asha',
        currentBalance: 500,
        lastDepositDate: '2026-04-27',
        agentCode: 77,
        bankCode: 'BANK1',
      },
    ]);
    accountApi.uploadUserAccount.mockResolvedValue({});

    await useAccountStore.getState().fetchUserAccounts();
    expect(useAccountStore.getState()).toMatchObject({
      userAccountsLoadingStatus: Status.Success,
      userAccounts: [expect.objectContaining({ agentName: 'Agent One' })],
    });

    await useAccountStore.getState().uploadUserAccount({
      agentCode: 77,
      bankCode: 'BANK1',
      users: [],
    });
    expect(useAccountStore.getState().uploadUserAccountStatus).toBe(
      Status.Success,
    );

    accountApi.fetchUserAccounts.mockRejectedValue(new Error('fetch failed'));
    accountApi.uploadUserAccount.mockRejectedValue(new Error('upload failed'));
    await useAccountStore.getState().fetchUserAccounts();
    await useAccountStore
      .getState()
      .uploadUserAccount({ agentCode: 77, bankCode: 'BANK1', users: [] });
    expect(useAccountStore.getState()).toMatchObject({
      userAccountsLoadingStatus: Status.Error,
      uploadUserAccountStatus: Status.Error,
    });
  });
});
