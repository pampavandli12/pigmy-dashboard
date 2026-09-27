import { beforeEach, describe, expect, it, vi } from 'vitest';

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

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../../src/services/axios', () => ({ api: apiMock }));

import {
  createAgent,
  createBanksoftDeposit,
  createPeocitDeposit,
  deleteTransaction,
  exportDepositById,
  fetchAgentByCode,
  fetchAgents,
  fetchPastDeposits,
  fetchTransactions,
  updateAgent,
} from '../../src/services/agents';
import { API_URLS } from '../../src/utils/constants';

describe('agents service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.get.mockResolvedValue({ data: 'get-data' });
    apiMock.post.mockResolvedValue({ data: 'post-data' });
    apiMock.patch.mockResolvedValue({ data: 'patch-data' });
    apiMock.delete.mockResolvedValue({ data: 'delete-data' });
  });

  it('calls agent read endpoints', async () => {
    await expect(fetchAgents('BANK1')).resolves.toBe('get-data');
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.AGENT}?bankCode=BANK1`,
    );

    await expect(fetchAgentByCode('77', 'BANK1')).resolves.toBe('get-data');
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.AGENT}?agentCode=77&bankCode=BANK1`,
    );

    await expect(fetchTransactions(77, '2026-04-27', 'BANK1')).resolves.toBe(
      'get-data',
    );
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.AGENT_TRANSACTIONS}?agentCode=77&bankCode=BANK1&date=2026-04-27`,
    );

    await expect(deleteTransaction(1830001)).resolves.toBe('delete-data');
    expect(apiMock.delete).toHaveBeenLastCalledWith(
      `${API_URLS.AGENT_TRANSACTIONS}?transactionId=1830001`,
    );
  });

  it('calls agent mutation and deposit endpoints', async () => {
    const agent = {
      name: 'Agent One',
      address: 'Town',
      password: 'secret1',
      phone: '9876543210',
      email: 'agent@example.com',
      agentCode: 77,
      bankCode: 'BANK1',
      type: 'agent' as const,
      status: 'active' as const,
      limitAmount: 1000,
    };

    await expect(createAgent(agent, 'BANK1')).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(API_URLS.AGENT, {
      ...agent,
      bankCode: 'BANK1',
    });

    await expect(
      updateAgent('77', { name: 'Updated' }, 'BANK1'),
    ).resolves.toBe('patch-data');
    expect(apiMock.patch).toHaveBeenLastCalledWith(
      `${API_URLS.AGENT}?agentCode=77&bankCode=BANK1`,
      { name: 'Updated', bankCode: 'BANK1', agentCode: 77 },
    );

    const depositPayload = {
      name: 'Agent One',
      agentCode: 77,
      bankCode: 'BANK1',
      depositingAmount: 100,
      voucherId: 'V1',
      from: '2026-04-01',
      to: '2026-04-02',
    };
    await expect(createBanksoftDeposit(depositPayload)).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(
      API_URLS.CREATE_DEPOSIT.banksoft,
      { ...depositPayload },
    );

    await expect(createPeocitDeposit(depositPayload)).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(
      API_URLS.CREATE_DEPOSIT.peocit,
      { ...depositPayload },
    );


    await expect(
      fetchPastDeposits({
        agentCode: 77,
        bankCode: 'BANK1',
        fromDate: '2026-04-01',
        toDate: '2026-04-02',
      }),
    ).resolves.toBe('get-data');
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.PAST_DEPOSITS}?agentCode=77&bankCode=BANK1&from=2026-04-01&to=2026-04-02`,
    );

    await expect(
      exportDepositById(5, 77, '2026-04-01', 900, 'BANK1'),
    ).resolves.toBe('get-data');
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.EXPORT_DEPOSIT_BY_ID}?depositId=5&bankCode=BANK1&agentCode=77&date=2026-04-01&depositedAmount=900`,
    );
  });
});
