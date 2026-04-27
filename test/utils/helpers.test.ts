import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_DEPOSIT_RESPONSE } from '../../src/utils/constants';
import { generateDepositDatFile, mapAccountsToAgents } from '../../src/utils/helpers';

describe('helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('maps agent names to accounts', () => {
    expect(
      mapAccountsToAgents(
        [
          {
            schemeId: '001',
            userId: 1,
            accountNumber: 10,
            customerName: 'Asha',
            currentBalance: 100,
            lastDepositDate: '2026-04-01',
            agentCode: 7,
            bankCode: 'BANK',
          },
          {
            schemeId: '002',
            userId: 2,
            accountNumber: 11,
            customerName: 'Dev',
            currentBalance: 200,
            lastDepositDate: '2026-04-02',
            agentCode: 9,
            bankCode: 'BANK',
          },
        ],
        [
          {
            name: 'Nila Rao',
            address: 'Main Road',
            phone: '9999999999',
            email: 'nila@example.com',
            agentCode: 7,
            bankCode: 'BANK',
            type: 'agent',
            limitAmount: 5000,
            status: 'active',
          },
        ],
      ),
    ).toMatchObject([{ agentName: 'Nila Rao' }, { agentName: 'N/A' }]);
  });

  it('builds the deposit DAT download', () => {
    const click = vi.fn();
    const link = { click, href: '', download: '' };
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:deposit');
    const revokeObjectURL = vi.fn();
    const blobParts: string[] = [];

    vi.stubGlobal('document', {
      body: { appendChild, removeChild },
      createElement: vi.fn(() => link),
    });
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.stubGlobal(
      'Blob',
      vi.fn(function BlobMock(parts: string[]) {
        blobParts.push(...parts);
        return { parts };
      }),
    );

    generateDepositDatFile(MOCK_DEPOSIT_RESPONSE);

    expect(blobParts[0]).toBe(
      [
        '    ,00000001,     2,2000            ,000001,12.04.26,12345678',
        '012d,00000003,   500,Rahul Mehta     ,000000,12.04.26,   500',
        '017d,00000003,  1500,Rahul Mehta     ,000000,12.04.26,  1500',
      ].join('\n'),
    );
    expect(link).toMatchObject({ href: 'blob:deposit', download: 'pcrx.dat' });
    expect(appendChild).toHaveBeenCalledWith(link);
    expect(click).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalledWith(link);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:deposit');
  });
});

