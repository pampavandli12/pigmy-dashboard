import { beforeEach, describe, expect, it, vi } from 'vitest';

const serviceApi = vi.hoisted(() => ({
  uploadSledgerAccounts: vi.fn(),
  createSledgerDeposit: vi.fn(),
  exportDepositById: vi.fn(),
}));
const helperApi = vi.hoisted(() => ({
  generateSledgerDepositDatFile: vi.fn(),
}));

vi.mock('../../src/services/account', () => ({
  uploadSledgerAccounts: serviceApi.uploadSledgerAccounts,
}));
vi.mock('../../src/services/agents', () => ({
  createSledgerDeposit: serviceApi.createSledgerDeposit,
  exportDepositById: serviceApi.exportDepositById,
}));
vi.mock('../../src/utils/helpers', () => ({
  generateSledgerDepositDatFile: helperApi.generateSledgerDepositDatFile,
}));

import { sledgerHandler } from '../../src/bankTypes/sledger';

describe('sledgerHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds the upload payload from the fixed-field file content', async () => {
    serviceApi.uploadSledgerAccounts.mockResolvedValue('uploaded');

    const fileContent = [
      '$C0,3,0000,                ,0000000.00,0000000.00                ,          001,28.09.26,1234512345@',
      '001,+,PD001,1-DEPPD0011              ,0000000.00,DEVARAJ              ,    1051.00,18.07.24,0000000.00@',
      '001,+,PD001,2-DEPPD0012              ,0000000.00,SUGANAGODA              , 4170.00,19.07.24,0000000.00@',
      '   ', // whitespace-only row -> skipped
      '001,+,PD001,99-DEPPD00199              ,0000000.00,              ,    100.00,19.07.24,0000000.00@', // missing customer name -> skipped
    ].join('\n');

    await expect(
      sledgerHandler.uploadAccounts({ fileContent, bankCode: 'BANK1' }),
    ).resolves.toBe('uploaded');

    expect(serviceApi.uploadSledgerAccounts).toHaveBeenCalledWith({
      agentCode: 1,
      bankCode: 'BANK1',
      branchCode: '001',
      users: [
        {
          schemeId: 'PD001',
          accountNumber: '1',
          customerName: 'DEVARAJ',
          currentBalance: 1051,
          lastDepositDate: '28-09-26',
        },
        {
          schemeId: 'PD001',
          accountNumber: '2',
          customerName: 'SUGANAGODA',
          currentBalance: 4170,
          lastDepositDate: '28-09-26',
        },
      ],
    });
  });

  it('builds the deposit payload, calls the sledger api and generates the file', async () => {
    const response = { agentCode: 1, users: [] };
    serviceApi.createSledgerDeposit.mockResolvedValue(response);

    await sledgerHandler.createDeposit({
      agentCode: 1,
      agentName: 'Agent One',
      bankCode: 'SLD123',
      formValues: {
        depositingAmount: 150,
        voucherId: '4e56',
        dateRange: {
          startDate: '2026-09-15T00:00:00.000Z',
          endDate: '2026-09-17T00:00:00.000Z',
        },
      },
    });

    expect(serviceApi.createSledgerDeposit).toHaveBeenCalledWith({
      name: 'Agent One',
      agentCode: 1,
      bankCode: 'SLD123',
      depositingAmount: 150,
      voucherId: '4e56',
      from: '2026-09-15',
      to: '2026-09-17',
    });
    expect(helperApi.generateSledgerDepositDatFile).toHaveBeenCalledWith(
      response,
    );
  });

  it('exports a deposit through the sledger api and generates the file', async () => {
    const response = { agentCode: 1, users: [] };
    serviceApi.exportDepositById.mockResolvedValue(response);

    await sledgerHandler.exportDeposit({
      depositId: 5,
      agentCode: 1,
      date: '2026-09-17',
      depositedAmount: 150,
      bankCode: 'SLD123',
    });

    expect(serviceApi.exportDepositById).toHaveBeenCalledWith(
      5,
      1,
      '2026-09-17',
      150,
      'SLD123',
    );
    expect(helperApi.generateSledgerDepositDatFile).toHaveBeenCalledWith(
      response,
    );
  });
});
