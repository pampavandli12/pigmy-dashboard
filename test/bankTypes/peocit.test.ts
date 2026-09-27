import { beforeEach, describe, expect, it, vi } from 'vitest';

const serviceApi = vi.hoisted(() => ({
  uploadPeocitAccounts: vi.fn(),
  createPeocitDeposit: vi.fn(),
  exportDepositById: vi.fn(),
}));
const helperApi = vi.hoisted(() => ({
  generatePeocitDepositDatFile: vi.fn(),
}));

vi.mock('../../src/services/account', () => ({
  uploadPeocitAccounts: serviceApi.uploadPeocitAccounts,
}));
vi.mock('../../src/services/agents', () => ({
  createPeocitDeposit: serviceApi.createPeocitDeposit,
  exportDepositById: serviceApi.exportDepositById,
}));
vi.mock('../../src/utils/helpers', () => ({
  generatePeocitDepositDatFile: helperApi.generatePeocitDepositDatFile,
}));

import { peocitHandler } from '../../src/bankTypes/peocit';

describe('peocitHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds the upload payload from the CRLF, space-padded file content', async () => {
    serviceApi.uploadPeocitAccounts.mockResolvedValue('uploaded');

    const fileContent = [
      '380292,000000,000000          ,001001,19.08.26,12341234',
      '380087,000000,B VINAY KUMAR   ,022990,06.06.24,0       ',
      '380104,000000,VEERUPAKSHA GOUD,000090,22.08.24,0       ',
      '   ', // whitespace-only row -> skipped
      '380113,000000,,000090,24.10.24,0', // missing customer name -> skipped
    ].join('\r\n');

    await expect(
      peocitHandler.uploadAccounts({ fileContent, bankCode: 'BANK1' }),
    ).resolves.toBe('uploaded');

    expect(serviceApi.uploadPeocitAccounts).toHaveBeenCalledWith({
      agentCode: 1001,
      bankCode: 'BANK1',
      vpncode: '380292',
      users: [
        {
          schemeId: '38',
          accountNumber: '087',
          customerName: 'B VINAY KUMAR',
          currentBalance: 22990,
          lastDepositDate: '19-08-26',
        },
        {
          schemeId: '38',
          accountNumber: '104',
          customerName: 'VEERUPAKSHA GOUD',
          currentBalance: 90,
          lastDepositDate: '19-08-26',
        },
      ],
    });
  });

  it('builds the deposit payload, calls the peocit api and generates the file', async () => {
    const response = { agentCode: 1001, users: [] };
    serviceApi.createPeocitDeposit.mockResolvedValue(response);

    await peocitHandler.createDeposit({
      agentCode: 1001,
      agentName: 'Agent One',
      bankCode: 'PEO123',
      formValues: {
        depositingAmount: 150,
        voucherId: '4e56',
        dateRange: {
          startDate: '2026-09-15T00:00:00.000Z',
          endDate: '2026-09-17T00:00:00.000Z',
        },
      },
    });

    expect(serviceApi.createPeocitDeposit).toHaveBeenCalledWith({
      name: 'Agent One',
      agentCode: 1001,
      bankCode: 'PEO123',
      depositingAmount: 150,
      voucherId: '4e56',
      from: '2026-09-15',
      to: '2026-09-17',
    });
    expect(helperApi.generatePeocitDepositDatFile).toHaveBeenCalledWith(response);
  });

  it('exports a deposit through the peocit api and generates the file', async () => {
    const response = { agentCode: 1001, users: [] };
    serviceApi.exportDepositById.mockResolvedValue(response);

    await peocitHandler.exportDeposit({
      depositId: 5,
      agentCode: 1001,
      date: '2026-09-17',
      depositedAmount: 150,
      bankCode: 'PEO123',
    });

    expect(serviceApi.exportDepositById).toHaveBeenCalledWith(
      5,
      1001,
      '2026-09-17',
      150,
      'PEO123',
    );
    expect(helperApi.generatePeocitDepositDatFile).toHaveBeenCalledWith(response);
  });
});
