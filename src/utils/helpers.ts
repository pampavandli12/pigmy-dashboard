import type {
  AccountFetchResponse,
  AccountsResponse,
  ParsedPhoneNumberRow,
} from '../types/Accounts';
import type { AgentsResponse } from '../types/sharedEnums';
import type { CreateDepositResponse } from '../types/Agent';
import * as XLSX from 'xlsx';
import { useAlertStore } from '../store/AlertStore';

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

export const generateDepositDatFile = (
  depositData: CreateDepositResponse,
): void => {
  const lines: string[] = [];
  const formatColumn = (value: string | number, width: number): string =>
    String(value).slice(0, width).padEnd(width, ' ');
  const formatNumberColumn = (value: number, width: number): string =>
    String(value).slice(0, width).padStart(width, ' ');
  const formatZeroPaddedNumberColumn = (value: number, width: number): string =>
    String(value).slice(0, width).padStart(width, '0');

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

  const datContent = lines.join('\n');
  const blob = new Blob([datContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pcrx.dat`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          worksheet,
          { defval: '' },
        );

        if (jsonData.length === 0) {
          throw new Error('The XLSX file should have some data.');
        }

        const missingColumns = REQUIRED_PHONE_NUMBER_COLUMNS.filter(
          (column) => !(column in jsonData[0]),
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
