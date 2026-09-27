import { createPeocitDeposit, exportDepositById } from '../services/agents';
import type { CreatePeocitDepositResponse } from '../types/Agent';
import { uploadPeocitAccounts } from '../services/account';
import type { UploadPeocitAccountPayload } from '../types/Accounts';
import { generatePeocitDepositDatFile } from '../utils/helpers';
import { buildCreateDepositPayload } from './depositPayload';
import {
  requireNumber,
  splitAccountsFile,
  toNumber,
  trimColumn,
} from './parseUtils';
import type { BankTypeHandler, UploadAccountsInput } from './types';

// The peocit file uses dotted dates (19.08.26); the backend expects dashes (19-08-26).
const toDashDate = (value: string | undefined): string =>
  trimColumn(value).replace(/\./g, '-');

const buildUploadAccountsPayload = ({
  fileContent,
  bankCode,
}: UploadAccountsInput): UploadPeocitAccountPayload => {
  const { header, rows } = splitAccountsFile(fileContent);
  const headerColumns = header.split(',');
  // Header carries the agent/vpn context and a single deposit date shared by all customers.
  const vpncode = trimColumn(headerColumns[0]);
  const agentCode = requireNumber(headerColumns[3], 'agent code');
  const lastDepositDate = toDashDate(headerColumns[4]);

  const users: UploadPeocitAccountPayload['users'] = [];
  rows.forEach((row) => {
    const columns = row.split(',');
    const accountId = trimColumn(columns[0]);
    const customerName = trimColumn(columns[2]);
    if (!accountId || !customerName) return; // skip invalid lines
    users.push({
      schemeId: accountId.slice(0, 2),
      accountNumber: accountId.slice(-3),
      customerName,
      currentBalance: toNumber(columns[3]),
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
  exportDeposit: async ({
    depositId,
    agentCode,
    date,
    depositedAmount,
    bankCode,
  }) => {
    const response = await exportDepositById<CreatePeocitDepositResponse>(
      depositId,
      agentCode,
      date,
      depositedAmount,
      bankCode,
    );
    generatePeocitDepositDatFile(response);
  },
};
