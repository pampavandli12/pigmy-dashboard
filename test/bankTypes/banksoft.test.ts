import { beforeEach, describe, expect, it, vi } from 'vitest';

const serviceApi = vi.hoisted(() => ({
  uploadBanksoftAccounts: vi.fn(),
  createBanksoftDeposit: vi.fn(),
  exportDepositById: vi.fn(),
}));
const helperApi = vi.hoisted(() => ({ generateDepositDatFile: vi.fn() }));

vi.mock('../../src/services/account', () => ({
  uploadBanksoftAccounts: serviceApi.uploadBanksoftAccounts,
}));
vi.mock('../../src/services/agents', () => ({
  createBanksoftDeposit: serviceApi.createBanksoftDeposit,
  exportDepositById: serviceApi.exportDepositById,
}));
vi.mock('../../src/utils/helpers', () => ({
  generateDepositDatFile: helperApi.generateDepositDatFile,
}));

import { banksoftHandler } from '../../src/bankTypes/banksoft';

describe('banksoftHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds the upload payload from the file content', async () => {
    serviceApi.uploadBanksoftAccounts.mockResolvedValue('uploaded');

    await expect(
      banksoftHandler.uploadAccounts({
        fileContent: [',77', '001,100,,Asha,500,2026-04-27', 'bad-row'].join(
          '\n',
        ),
        bankCode: 'BANK1',
      }),
    ).resolves.toBe('uploaded');

    expect(serviceApi.uploadBanksoftAccounts).toHaveBeenCalledWith({
      agentCode: 77,
      bankCode: 'BANK1',
      users: [
        {
          schemeId: '001',
          accountNumber: 100,
          customerName: 'Asha',
          currentBalance: 500,
          lastDepositDate: '2026-04-27',
        },
      ],
    });
  });

  it('builds the deposit payload, calls the api and generates the file', async () => {
    const response = { agentCode: 77, users: [] };
    serviceApi.createBanksoftDeposit.mockResolvedValue(response);

    await banksoftHandler.createDeposit({
      agentCode: 77,
      agentName: 'Agent One',
      bankCode: 'BANK1',
      formValues: {
        depositingAmount: 50,
        voucherId: 'V1',
        dateRange: {
          startDate: '2026-04-01T00:00:00.000Z',
          endDate: '2026-04-02T00:00:00.000Z',
        },
      },
    });

    expect(serviceApi.createBanksoftDeposit).toHaveBeenCalledWith({
      name: 'Agent One',
      agentCode: 77,
      bankCode: 'BANK1',
      depositingAmount: 50,
      voucherId: 'V1',
      from: '2026-04-01',
      to: '2026-04-02',
    });
    expect(helperApi.generateDepositDatFile).toHaveBeenCalledWith(response);
  });

  it('exports a deposit through the api and generates the file', async () => {
    const response = { agentCode: 77, users: [] };
    serviceApi.exportDepositById.mockResolvedValue(response);

    await banksoftHandler.exportDeposit({
      depositId: 5,
      agentCode: 77,
      date: '2026-04-02',
      depositedAmount: 900,
    });

    expect(serviceApi.exportDepositById).toHaveBeenCalledWith(
      5,
      77,
      '2026-04-02',
      900,
    );
    expect(helperApi.generateDepositDatFile).toHaveBeenCalledWith(response);
  });
});
