import type {
  AccountFetchResponse,
  AccountsResponse,
  ParsedPhoneNumberRow,
} from '../types/Accounts';
import type { AgentsResponse } from '../types/sharedEnums';
import type {
  CreateDepositResponse,
  CreatePeocitDepositResponse,
} from '../types/Agent';
import * as XLSX from 'xlsx';
import { useAlertStore } from '../store/AlertStore';

/**
 * Safely extract a user-facing message from an unknown error thrown by axios.
 * Handles both an already-parsed object `response.data` and a raw JSON string,
 * so parsing never throws inside a `catch` block.
 */
export const extractApiErrorMessage = (error: unknown): string => {
  const errorObj = error as {
    response?: { data?: unknown };
    message?: string;
  };
  const data = errorObj?.response?.data;

  if (data && typeof data === 'object' && 'error' in data) {
    const message = (data as { error?: unknown }).error;
    if (typeof message === 'string' && message) return message;
  }

  if (typeof data === 'string' && data) {
    try {
      const parsed = JSON.parse(data) as { error?: unknown };
      if (typeof parsed?.error === 'string' && parsed.error) return parsed.error;
    } catch {
      return data;
    }
  }

  return errorObj?.message || 'Unknown error';
};

export const mapAccountsToAgents = (
  accounts: AccountsResponse,
  agents: AgentsResponse,
): AccountFetchResponse => {
  const agentMap: AccountFetchResponse = accounts.map((account) => {
    const agent = agents.find((agent) => agent.agentCode === account.agentCode);
    return {
      ...account,
      agentName: agent ? agent.name : 'N/A',
    };
  });
  return agentMap;
};

// Left-aligned column: truncate to width, then pad the remainder with spaces.
const formatColumn = (value: string | number, width: number): string =>
  String(value).slice(0, width).padEnd(width, ' ');
// Right-aligned numeric column padded with spaces.
const formatNumberColumn = (value: number, width: number): string =>
  String(value).slice(0, width).padStart(width, ' ');
// Right-aligned numeric column padded with zeros.
const formatZeroPaddedNumberColumn = (value: number, width: number): string =>
  String(value).slice(0, width).padStart(width, '0');

// Shared browser download of a generated .DAT file.
const downloadDatFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateDepositDatFile = (
  depositData: CreateDepositResponse,
): void => {
  const lines: string[] = [];

  const agentInformationRow = [
    formatColumn('', 4),
    formatZeroPaddedNumberColumn(depositData.agentCode, 8),
    formatNumberColumn(depositData.users.length, 6),
    formatColumn(depositData.totalDepositedAmount, 16),
    formatZeroPaddedNumberColumn(depositData.agentCode, 6),
    formatColumn(depositData.depositedDate, 8),
    formatColumn('12345678', 8),
  ].join(',');

  lines.push(agentInformationRow);

  depositData.users.forEach((user) => {
    const row = [
      formatColumn(user.schemeId, 4),
      String(user.accountNumber).padStart(8, '0'),
      formatNumberColumn(user.collectedAmount, 6),
      formatColumn(user.customerName, 16),
      formatColumn('000000', 6),
      formatColumn(user.collectedDate, 8),
      formatNumberColumn(user.collectedAmount, 6),
    ].join(',');

    lines.push(row);
  });

  downloadDatFile(lines.join('\n'), 'pcrx.dat');
};

// Peocit .DAT layout differs from banksoft: combined scheme/account number, a separate
// finalAmount column, fixed 55-char CRLF-terminated rows.
export const generatePeocitDepositDatFile = (
  depositData: CreatePeocitDepositResponse,
): void => {
  const lines: string[] = [];

  const agentInformationRow = [
    ' '.repeat(6),
    formatZeroPaddedNumberColumn(depositData.users.length, 6),
    formatColumn(
      formatZeroPaddedNumberColumn(depositData.totalDepositedAmount, 6),
      16,
    ),
    formatZeroPaddedNumberColumn(depositData.agentCode, 6),
    formatColumn(depositData.depositedDate, 8),
    '12341234',
  ].join(',');

  lines.push(agentInformationRow);

  depositData.users.forEach((user) => {
    const row = [
      formatColumn(user.schemeAccntNumber, 6),
      formatZeroPaddedNumberColumn(user.collectedAmount, 6),
      formatColumn(user.customerName, 16),
      formatZeroPaddedNumberColumn(user.finalAmount, 6),
      formatColumn(user.collectedDate, 8),
      formatColumn(formatZeroPaddedNumberColumn(user.collectedAmount, 6), 8),
    ].join(',');

    lines.push(row);
  });

  downloadDatFile(`${lines.join('\r\n')}\r\n`, 'pcrx.dat');
};

const REQUIRED_PHONE_NUMBER_COLUMNS = ['Mobile1', 'AccountNumber'] as const;

export const parseCSVFile = async (
  file?: File,
): Promise<ParsedPhoneNumberRow[]> => {
  const showAlert = useAlertStore.getState().showAlert;
  if (!file) {
    showAlert(true, 'Please upload an XLSX file.', 'error');
    throw new Error('Please upload an XLSX file.');
  }

  const isXlsxFile = file.name.toLowerCase().endsWith('.xlsx');
  if (!isXlsxFile) {
    showAlert(true, 'Please upload a valid XLSX file.', 'error');
    throw new Error('Please upload a valid XLSX file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      showAlert(true, 'Unable to read the XLSX file.', 'error');
      reject(new Error('Unable to read the XLSX file.'));
    };

    reader.onload = (event) => {
      try {
        const data = event.target?.result;

        const workbook = XLSX.read(data, {
          type: 'array',
        });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          throw new Error('The XLSX file should have some data.');
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error('The XLSX file should have some data.');
        }
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: '' },
        );

        const firstRow = jsonData[0];
        if (!firstRow) {
          throw new Error('The XLSX file should have some data.');
        }

        const missingColumns = REQUIRED_PHONE_NUMBER_COLUMNS.filter(
          (column) => !(column in firstRow),
        );

        if (missingColumns.length > 0) {
          throw new Error(
            `The XLSX file should include ${missingColumns.join(', ')} column${missingColumns.length > 1 ? 's' : ''}.`,
          );
        }

        resolve(
          jsonData.map((row) => ({
            mobilenumber: row.Mobile1 as number,
            accountNumber: row.AccountNumber as number,
          })),
        );
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};
