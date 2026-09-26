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
  createAgent: vi.fn(),
  fetchAgentByCode: vi.fn(),
  updateAgent: vi.fn(),
  fetchTransactions: vi.fn(),
  deleteTransaction: vi.fn(),
  createBanksoftDeposit: vi.fn(),
  createPeocitDeposit: vi.fn(),
  exportDepositById: vi.fn(),
  exportPeocitDepositById: vi.fn(),
  fetchPastDeposits: vi.fn(),
  deviceReset: vi.fn(),
}));
const helperApi = vi.hoisted(() => ({
  generateDepositDatFile: vi.fn(),
  generatePeocitDepositDatFile: vi.fn(),
}));

vi.mock('../../src/services/agents', () => agentApi);
vi.mock('../../src/utils/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/helpers')>();
  return {
    ...actual,
    generateDepositDatFile: helperApi.generateDepositDatFile,
    generatePeocitDepositDatFile: helperApi.generatePeocitDepositDatFile,
  };
});

import { useAgentStore } from '../../src/store/AgentStore';
import { useAlertStore } from '../../src/store/AlertStore';
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
  graceDays: 5,
};

const validAgentPayload = {
  ...agent,
  password: 'secret1',
};

const resetAgentStore = () => {
  useAuthStore.setState({ bankCode: 'BANK1', bankType: null });
  useAgentStore.setState({
    fetchAgentLoadingStatus: Status.Idle,
    createAgentLoadingStatus: Status.Idle,
    updateAgentLoadingStatus: Status.Idle,
    fetchAgentByCodeLoadingStatus: Status.Idle,
    agents: [],
    selectedAgent: null,
    transactions: [],
    fetchTransactionsLoadingStatus: Status.Idle,
    createDepositLoadingStatus: Status.Idle,
    fetchPastDepositsLoadingStatus: Status.Idle,
    exportDepositLoadingStatus: Status.Idle,
    voidTransactionLoadingStatus: Status.Idle,
    pastDeposits: [],
    ResetDeviceStatus: Status.Idle,
  });
};

describe('AgentStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAgentStore();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('handles success flows', async () => {
    agentApi.fetchAgents.mockResolvedValue([agent]);
    agentApi.createAgent.mockResolvedValue(agent);
    agentApi.fetchAgentByCode.mockResolvedValue(agent);
    agentApi.fetchTransactions.mockResolvedValue([
      {
        trasactionId: 1,
        accountNumber: 100,
        customerName: 'Asha',
        collectedAmount: 50,
        status: 'C',
        schemeName: 'Daily',
      },
    ]);
    agentApi.updateAgent.mockResolvedValue({ ...agent, name: 'Updated' });
    agentApi.createBanksoftDeposit.mockResolvedValue({
      agentCode: 77,
      bankCode: 'BANK1',
      totalDepositedAmount: 50,
      depositedDate: '27.04.26',
      users: [],
    });
    agentApi.exportDepositById.mockResolvedValue({
      agentCode: 77,
      bankCode: 'BANK1',
      totalDepositedAmount: 50,
      depositedDate: '27.04.26',
      users: [],
    });
    agentApi.fetchPastDeposits.mockResolvedValue([
      {
        depositId: 1,
        agentCode: 77,
        bankCode: 'BANK1',
        depositDate: '2026-04-27',
        totalDepositedAmount: 50,
      },
    ]);
    agentApi.deleteTransaction.mockResolvedValue(undefined);
    agentApi.fetchTransactions
      .mockResolvedValueOnce([
        {
          trasactionId: 1,
          accountNumber: 100,
          customerName: 'Asha',
          collectedAmount: 50,
          status: 'C',
          schemeName: 'Daily',
        },
      ])
      .mockResolvedValueOnce([]);

    await useAgentStore.getState().fetchAgents();
    await useAgentStore.getState().createAgent(validAgentPayload);
    await useAgentStore.getState().fetchAgentByCode('77');
    await useAgentStore.getState().fetchTransactions(77, '2026-04-27');
    await useAgentStore.getState().updateAgent('77', { name: 'Updated' });
    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V1',
        dateRange: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-02T00:00:00.000Z',
        },
      },
      77,
    );
    await useAgentStore.getState().exportDepositeById(1, 77, '2026-04-27', 50);
    await useAgentStore
      .getState()
      .fetchPastDeposits(77, '2026-04-01', '2026-04-27');
    await useAgentStore
      .getState()
      .voidTransaction(1, 77, '2026-04-27');

    expect(useAgentStore.getState()).toMatchObject({
      agents: [agent],
      selectedAgent: agent,
      fetchAgentLoadingStatus: Status.Success,
      createAgentLoadingStatus: Status.Success,
      updateAgentLoadingStatus: Status.Success,
      createDepositLoadingStatus: Status.Success,
      exportDepositLoadingStatus: Status.Success,
      fetchPastDepositsLoadingStatus: Status.Success,
      voidTransactionLoadingStatus: Status.Success,
    });
    expect(useAgentStore.getState().transactions).toHaveLength(0);
    expect(useAgentStore.getState().pastDeposits).toHaveLength(1);
    expect(agentApi.createBanksoftDeposit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Agent One',
        bankCode: 'BANK1',
        from: '2026-04-01',
        to: '2026-04-02',
      }),
    );
    expect(helperApi.generateDepositDatFile).toHaveBeenCalledTimes(2);

    useAgentStore.getState().setSelectedAgent(null);
    useAgentStore.getState().setCreateAgentLoadingStatus(Status.Idle);
    useAgentStore.getState().setUpdateAgentLoadingStatus(Status.Idle);
    expect(useAgentStore.getState()).toMatchObject({
      selectedAgent: null,
      createAgentLoadingStatus: Status.Idle,
      updateAgentLoadingStatus: Status.Idle,
    });
  });

  it('routes deposit and export through the peocit handler when bankType is peocit', async () => {
    useAuthStore.setState({ bankType: 'peocit', bankCode: 'PEO123' });
    useAgentStore.setState({ agents: [agent] });
    const peocitResponse = {
      agentCode: 1001,
      bankCode: 'PEO123',
      totalDepositedAmount: 150,
      depositedDate: '21.09.26',
      users: [],
    };
    agentApi.createPeocitDeposit.mockResolvedValue(peocitResponse);
    agentApi.exportPeocitDepositById.mockResolvedValue(peocitResponse);

    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 150,
        voucherId: '4e56',
        dateRange: {
          startDate: '2026-09-15T00:00:00.000Z',
          endDate: '2026-09-17T00:00:00.000Z',
        },
      },
      77,
    );
    await useAgentStore.getState().exportDepositeById(5, 77, '2026-09-17', 150);

    expect(agentApi.createPeocitDeposit).toHaveBeenCalledTimes(1);
    expect(agentApi.exportPeocitDepositById).toHaveBeenCalledWith(
      5,
      77,
      '2026-09-17',
      150,
    );
    expect(helperApi.generatePeocitDepositDatFile).toHaveBeenCalledTimes(2);
    // Banksoft paths stay untouched — bank logic is isolated by bankType.
    expect(agentApi.createBanksoftDeposit).not.toHaveBeenCalled();
    expect(agentApi.exportDepositById).not.toHaveBeenCalled();
    expect(helperApi.generateDepositDatFile).not.toHaveBeenCalled();
    expect(useAgentStore.getState()).toMatchObject({
      createDepositLoadingStatus: Status.Success,
      exportDepositLoadingStatus: Status.Success,
    });
  });

  it('handles error flows', async () => {
    agentApi.fetchAgents.mockRejectedValue(new Error('agents failed'));
    agentApi.createAgent.mockRejectedValue(new Error('create failed'));
    agentApi.fetchAgentByCode.mockRejectedValue(new Error('lookup failed'));
    agentApi.fetchTransactions.mockRejectedValue(new Error('tx failed'));
    agentApi.updateAgent.mockRejectedValue(new Error('update failed'));
    agentApi.createBanksoftDeposit.mockRejectedValue({ message: 'deposit failed' });
    agentApi.exportDepositById.mockRejectedValue({
      response: { data: JSON.stringify({ error: 'export failed' }) },
    });
    agentApi.fetchPastDeposits.mockRejectedValue(new Error('past failed'));
    agentApi.deleteTransaction.mockRejectedValue(new Error('void failed'));

    await useAgentStore.getState().fetchAgents();
    await useAgentStore.getState().createAgent(validAgentPayload);
    await useAgentStore.getState().fetchAgentByCode('77');
    await useAgentStore.getState().fetchTransactions(77, '2026-04-27');
    await useAgentStore.getState().updateAgent('77', { name: 'Updated' });
    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V1',
        dateRange: {
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-04-02'),
        },
      },
      404,
    );
    await useAgentStore.getState().exportDepositeById(1, 77, '2026-04-27', 50);
    await useAgentStore
      .getState()
      .fetchPastDeposits(77, '2026-04-01', '2026-04-27');
    await useAgentStore
      .getState()
      .voidTransaction(1, 77, '2026-04-27');

    expect(useAgentStore.getState()).toMatchObject({
      fetchAgentLoadingStatus: Status.Error,
      createAgentLoadingStatus: Status.Error,
      fetchAgentByCodeLoadingStatus: Status.Error,
      fetchTransactionsLoadingStatus: Status.Error,
      updateAgentLoadingStatus: Status.Error,
      createDepositLoadingStatus: Status.Error,
      exportDepositLoadingStatus: Status.Error,
      fetchPastDepositsLoadingStatus: Status.Error,
      voidTransactionLoadingStatus: Status.Error,
    });
    expect(useAlertStore.getState().alert.open).toBe(true);
  });

  it('covers deposit fallback branches', async () => {
    useAuthStore.setState({ bankCode: null });

    agentApi.createBanksoftDeposit.mockResolvedValue({
      agentCode: 404,
      bankCode: '',
      totalDepositedAmount: 50,
      depositedDate: '27.04.26',
      users: [],
    });
    agentApi.fetchPastDeposits.mockResolvedValue([]);

    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V2',
        dateRange: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-02T00:00:00.000Z',
        },
      },
      404,
    );
    expect(agentApi.createBanksoftDeposit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        name: 'Unknown Agent',
        bankCode: '',
      }),
    );

    await useAgentStore
      .getState()
      .fetchPastDeposits(404, '2026-04-01', '2026-04-27');
    expect(agentApi.fetchPastDeposits).toHaveBeenLastCalledWith(
      expect.objectContaining({ bankCode: '' }),
    );

    agentApi.createBanksoftDeposit.mockRejectedValue({ response: { data: '{}' } });
    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V3',
        dateRange: {
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-04-02'),
        },
      },
      404,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      message: 'Unknown error',
      severity: 'error',
    });

    agentApi.createBanksoftDeposit.mockRejectedValue({});
    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V4',
        dateRange: {
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-04-02'),
        },
      },
      404,
    );
    expect(useAlertStore.getState().alert).toMatchObject({
      message: 'Unknown error',
      severity: 'error',
    });

    agentApi.exportDepositById.mockRejectedValue({ response: { data: '{}' } });
    await useAgentStore.getState().exportDepositeById(1, 404, '2026-04-27', 50);
    expect(useAlertStore.getState().alert).toMatchObject({
      message: 'Unknown error',
      severity: 'error',
    });

    agentApi.exportDepositById.mockRejectedValue({});
    await useAgentStore.getState().exportDepositeById(1, 404, '2026-04-27', 50);
    expect(useAlertStore.getState().alert).toMatchObject({
      message: 'Unknown error',
      severity: 'error',
    });
  });

  it('reports an error for an unsupported bank type on deposit', async () => {
    useAuthStore.setState({ bankType: 'unknown' });

    await useAgentStore.getState().createDeposit(
      {
        depositingAmount: 50,
        voucherId: 'V9',
        dateRange: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-02T00:00:00.000Z',
        },
      },
      77,
    );

    expect(agentApi.createBanksoftDeposit).not.toHaveBeenCalled();
    expect(useAgentStore.getState().createDepositLoadingStatus).toBe(
      Status.Error,
    );
    expect(useAlertStore.getState().alert.message).toBe(
      'Unsupported bank type: unknown',
    );
    useAuthStore.setState({ bankType: null });
  });
});
