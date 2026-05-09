import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Status, type Agent } from '../../src/types/sharedEnums';

vi.hoisted(() => {
  const storage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  });
});

const agentApi = vi.hoisted(() => ({
  fetchAgents: vi.fn(),
}));
const accountApi = vi.hoisted(() => ({
  fetchUserAccounts: vi.fn(),
  updateUserAccounts: vi.fn(),
  UpdateUserPhoneNumber: vi.fn(),
  uploadUserAccount: vi.fn(),
}));

vi.mock('../../src/services/agents', () => ({
  fetchAgents: agentApi.fetchAgents,
}));
vi.mock('../../src/services/account', () => accountApi);

import { useAccountStore } from '../../src/store/AccountStore';
import { useAlertStore } from '../../src/store/AlertStore';
import { useAgentStore } from '../../src/store/AgentStore';
import { useAuthStore } from '../../src/store/AuthStore';

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
      userPhoneNumberUpdateStatus: Status.Idle,
    });
    useAuthStore.setState({ bankCode: 'BANK1' });
    useAlertStore.setState({
      alert: { open: false, message: '', severity: 'success' },
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

  it('updates uploaded phone numbers with success and error statuses', async () => {
    accountApi.updateUserAccounts.mockResolvedValue({});
    useAuthStore.setState({ bankCode: null });

    await useAccountStore
      .getState()
      .updateUserAccounts([{ accountNumber: 100, mobilenumber: 9876543210 }]);

    expect(accountApi.updateUserAccounts).toHaveBeenCalledWith({
      bankCode: '',
      userDetailsList: [{ accountNumber: 100, mobilenumber: 9876543210 }],
    });
    expect(useAccountStore.getState().userPhoneNumberUpdateStatus).toBe(
      Status.Success,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Accounts updated successfully.',
      severity: 'success',
    });

    accountApi.updateUserAccounts.mockRejectedValue(new Error('update failed'));

    await useAccountStore
      .getState()
      .updateUserAccounts([{ accountNumber: 101, mobilenumber: 9876543211 }]);

    expect(useAccountStore.getState().userPhoneNumberUpdateStatus).toBe(
      Status.Error,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Failed to update accounts. Please try again.',
      severity: 'error',
    });
  });

  it('updates a single user phone number with success and error statuses', async () => {
    accountApi.UpdateUserPhoneNumber.mockResolvedValue({});
    accountApi.fetchUserAccounts.mockResolvedValue([]);

    await useAccountStore.getState().updateUserPhoneNumber('9876543210', 7);

    expect(accountApi.UpdateUserPhoneNumber).toHaveBeenCalledWith(
      '9876543210',
      7,
    );
    expect(accountApi.fetchUserAccounts).toHaveBeenCalled();
    expect(useAccountStore.getState().userAccountsLoadingStatus).toBe(
      Status.Success,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Phone number updated successfully.',
      severity: 'success',
    });

    accountApi.UpdateUserPhoneNumber.mockRejectedValue(new Error('patch failed'));

    await useAccountStore.getState().updateUserPhoneNumber('9876543211', 8);

    expect(useAccountStore.getState().userAccountsLoadingStatus).toBe(
      Status.Error,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Failed to update phone number. Please try again.',
      severity: 'error',
    });
  });
});
