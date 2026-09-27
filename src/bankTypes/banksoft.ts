import { createBanksoftDeposit, exportDepositById } from '../services/agents';
import type { CreateDepositResponse } from '../types/Agent';
import { uploadBanksoftAccounts } from '../services/account';
import type { UploadUserAccountPayload } from '../types/Accounts';
import { generateDepositDatFile } from '../utils/helpers';
import { buildCreateDepositPayload } from './depositPayload';
import {
  requireNumber,
  splitAccountsFile,
  toNumber,
  trimColumn,
} from './parseUtils';
import type { BankTypeHandler, UploadAccountsInput } from './types';

const buildUploadAccountsPayload = ({
  fileContent,
  bankCode,
}: UploadAccountsInput): UploadUserAccountPayload => {
  const { header: agent, rows } = splitAccountsFile(fileContent);
  const userList: UploadUserAccountPayload['users'] = [];
  rows.forEach((element) => {
    const [
      schemeId,
      accountNumber,
      ,
      customerName,
      currentBalance,
      lastDepositDate,
    ] = element.split(',');
    if (!trimColumn(accountNumber) || !trimColumn(customerName)) return; // skip invalid lines
    userList.push({
      schemeId: trimColumn(schemeId),
      accountNumber: requireNumber(accountNumber, 'account number'),
      customerName: trimColumn(customerName),
      currentBalance: toNumber(currentBalance),
      lastDepositDate: trimColumn(lastDepositDate),
    });
  });
  const [, agentCode] = agent.split(',');
  return {
    agentCode: requireNumber(agentCode, 'agent code'),
    bankCode,
    users: userList,
  };
};

export const banksoftHandler: BankTypeHandler = {
  uploadAccounts: (input) =>
    uploadBanksoftAccounts(buildUploadAccountsPayload(input)),
  createDeposit: async (input) => {
    const response = await createBanksoftDeposit(
      buildCreateDepositPayload(input),
    );
    generateDepositDatFile(response);
  },
  exportDeposit: async ({
    depositId,
    agentCode,
    date,
    depositedAmount,
    bankCode,
  }) => {
    const response = await exportDepositById<CreateDepositResponse>(
      depositId,
      agentCode,
      date,
      depositedAmount,
      bankCode,
    );
    generateDepositDatFile(response);
  },
};
