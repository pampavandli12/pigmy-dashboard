import {
  createPeocitDeposit,
  exportPeocitDepositById,
} from '../services/agents';
import { uploadPeocitAccounts } from '../services/account';
import type { UploadPeocitAccountPayload } from '../types/Accounts';
import { generatePeocitDepositDatFile } from '../utils/helpers';
import { buildCreateDepositPayload } from './depositPayload';
import type { BankTypeHandler, UploadAccountsInput } from './types';

// The peocit file uses dotted dates (19.08.26); the backend expects dashes (19-08-26).
const toDashDate = (value: string): string => value.trim().replace(/\./g, '-');

const buildUploadAccountsPayload = ({
  fileContent,
  bankCode,
}: UploadAccountsInput): UploadPeocitAccountPayload => {
  const [header, ...rows] = fileContent.split('\n');
  const headerColumns = header.split(',');
  // Header carries the agent/vpn context and a single deposit date shared by all customers.
  const vpncode = (headerColumns[0] ?? '').trim();
  const agentCode = Number((headerColumns[3] ?? '').trim());
  const lastDepositDate = toDashDate(headerColumns[4] ?? '');

  const users: UploadPeocitAccountPayload['users'] = [];
  rows.forEach((row) => {
    const columns = row.trim().split(',');
    const accountId = (columns[0] ?? '').trim();
    const customerName = (columns[2] ?? '').trim();
    if (!accountId || !customerName) return; // skip invalid lines
    users.push({
      schemeId: accountId.slice(0, 2),
      accountNumber: accountId.slice(-3),
      customerName,
      currentBalance: Number((columns[3] ?? '').trim()),
      lastDepositDate,
    });
  });

  return { agentCode, bankCode, vpncode, users };
};

export const peocitHandler: BankTypeHandler = {
  uploadAccounts: (input) =>
    uploadPeocitAccounts(buildUploadAccountsPayload(input)),
  createDeposit: async (input) => {
    const response = await createPeocitDeposit(buildCreateDepositPayload(input));
    generatePeocitDepositDatFile(response);
  },
  exportDeposit: async ({ depositId, agentCode, date, depositedAmount }) => {
    const response = await exportPeocitDepositById(
      depositId,
      agentCode,
      date,
      depositedAmount,
    );
    generatePeocitDepositDatFile(response);
  },
};
