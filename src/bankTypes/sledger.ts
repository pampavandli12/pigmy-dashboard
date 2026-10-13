import { createSledgerDeposit, exportDepositById } from '../services/agents';
import type { CreateSledgerDepositResponse } from '../types/Agent';
import { uploadSledgerAccounts } from '../services/account';
import type { UploadSledgerAccountPayload } from '../types/Accounts';
import { generateSledgerDepositDatFile } from '../utils/helpers';
import { buildCreateDepositPayload } from './depositPayload';
import {
  requireNumber,
  splitAccountsFile,
  toDashDate,
  toNumber,
  trimColumn,
} from './parseUtils';
import type { BankTypeHandler, UploadAccountsInput } from './types';

const buildUploadAccountsPayload = ({
  fileContent,
  bankCode,
}: UploadAccountsInput): UploadSledgerAccountPayload => {
  const { header, rows } = splitAccountsFile(fileContent);
  const headerColumns = header.split(',');
  // Header carries the agent code and a single deposit date shared by all customers.
  const agentCode = requireNumber(headerColumns[6], 'agent code');
  const lastDepositDate = toDashDate(headerColumns[7]);

  let branchCode = '';
  const users: UploadSledgerAccountPayload['users'] = [];
  rows.forEach((row) => {
    const columns = row.split(',');
    const schemeId = trimColumn(columns[2]);
    const [accountNumber] = trimColumn(columns[3]).split('-');
    const customerName = trimColumn(columns[5]);
    if (!accountNumber || !customerName) return; // skip invalid lines
    if (!branchCode) {
      branchCode = trimColumn(columns[0]);
    }
    users.push({
      schemeId,
      accountNumber,
      customerName,
      currentBalance: toNumber(columns[6]),
      lastDepositDate,
    });
  });

  return { agentCode, bankCode, branchCode, users };
};

export const sledgerHandler: BankTypeHandler = {
  uploadAccounts: (input) =>
    uploadSledgerAccounts(buildUploadAccountsPayload(input)),
  createDeposit: async (input) => {
    const response = await createSledgerDeposit(
      buildCreateDepositPayload(input),
    );
    generateSledgerDepositDatFile(response);
  },
  exportDeposit: async ({
    depositId,
    agentCode,
    date,
    depositedAmount,
    bankCode,
  }) => {
    const response = await exportDepositById<CreateSledgerDepositResponse>(
      depositId,
      agentCode,
      date,
      depositedAmount,
      bankCode,
    );
    generateSledgerDepositDatFile(response);
  },
};
