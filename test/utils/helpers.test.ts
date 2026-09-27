import { afterEach, describe, expect, it, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { MOCK_DEPOSIT_RESPONSE } from '../fixtures/deposits';
import {
  generateDepositDatFile,
  generatePeocitDepositDatFile,
  mapAccountsToAgents,
  parseCSVFile,
} from '../../src/utils/helpers';
import type { CreatePeocitDepositResponse } from '../../src/types/Agent';

class FileReaderMock {
  onerror: (() => void) | null = null;
  onload: ((event: { target: { result: ArrayBuffer } }) => void) | null = null;

  readAsArrayBuffer(file: File) {
    file.arrayBuffer().then(
      (result) => this.onload?.({ target: { result } }),
      () => this.onerror?.(),
    );
  }
}

class FileReaderErrorMock {
  onerror: (() => void) | null = null;

  readAsArrayBuffer() {
    this.onerror?.();
  }
}

const createWorkbookFile = (
  rows: Record<string, string | number>[],
  fileName = 'phone-numbers.xlsx',
) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  return new File([buffer], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

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

  it('builds the peocit deposit DAT download with CRLF fixed-width rows', () => {
    const click = vi.fn();
    const link = { click, href: '', download: '' };
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:peocit');
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

    const response: CreatePeocitDepositResponse = {
      agentCode: 1001,
      bankCode: 'PEO123',
      totalDepositedAmount: 24950,
      depositedDate: '19.08.26',
      users: [
        {
          schemeAccntNumber: '380291',
          collectedAmount: 2500,
          finalAmount: 15000,
          customerName: 'GULABI P',
          collectedDate: '18.08.26',
        },
        {
          schemeAccntNumber: '380260',
          collectedAmount: 4000,
          finalAmount: 12450,
          customerName: 'RANJIT RAJ P N',
          collectedDate: '18.08.26',
        },
      ],
    };

    generatePeocitDepositDatFile(response);

    expect(blobParts[0]).toBe(
      [
        '      ,000002,024950          ,001001,19.08.26,12341234',
        '380291,002500,GULABI P        ,015000,18.08.26,002500  ',
        '380260,004000,RANJIT RAJ P N  ,012450,18.08.26,004000  ',
      ].join('\r\n') + '\r\n',
    );
    expect(link).toMatchObject({ href: 'blob:peocit', download: 'pcrx.dat' });
    expect(click).toHaveBeenCalled();
  });

  it('parses phone number data from an XLSX file', async () => {
    vi.stubGlobal('FileReader', FileReaderMock);

    await expect(
      parseCSVFile(
        createWorkbookFile([
          { Mobile1: '9876543210', AccountNumber: 101 },
          { Mobile1: '9876543211', AccountNumber: 102 },
        ]),
      ),
    ).resolves.toEqual([
      { mobilenumber: '9876543210', accountNumber: 101 },
      { mobilenumber: '9876543211', accountNumber: 102 },
    ]);
  });

  it('rejects non-XLSX phone number files', async () => {
    await expect(
      parseCSVFile(new File(['Mobile1,AccountNumber'], 'phone-numbers.csv')),
    ).rejects.toThrow('Please upload a valid XLSX file.');
  });

  it('rejects missing and unreadable XLSX phone number files', async () => {
    await expect(parseCSVFile()).rejects.toThrow('Please upload an XLSX file.');

    vi.stubGlobal('FileReader', FileReaderErrorMock);

    await expect(parseCSVFile(createWorkbookFile([]))).rejects.toThrow(
      'Unable to read the XLSX file.',
    );
  });

  it('rejects empty XLSX phone number files', async () => {
    vi.stubGlobal('FileReader', FileReaderMock);

    await expect(parseCSVFile(createWorkbookFile([]))).rejects.toThrow(
      'The XLSX file should have some data.',
    );
  });

  it('rejects XLSX phone number files without required columns', async () => {
    vi.stubGlobal('FileReader', FileReaderMock);

    await expect(
      parseCSVFile(createWorkbookFile([{ Mobile1: '9876543210' }])),
    ).rejects.toThrow(
      'The XLSX file should include AccountNumber column.',
    );

    await expect(
      parseCSVFile(createWorkbookFile([{ CustomerName: 'Asha' }])),
    ).rejects.toThrow(
      'The XLSX file should include Mobile1, AccountNumber columns.',
    );
  });
});
