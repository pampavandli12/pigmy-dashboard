import {
  createBanksoftDeposit,
  exportDepositById,
} from '../services/agents';
import { uploadBanksoftAccounts } from '../services/account';
import type { UploadUserAccountPayload } from '../types/Accounts';
import { generateDepositDatFile } from '../utils/helpers';
import { buildCreateDepositPayload } from './depositPayload';
import type { BankTypeHandler, UploadAccountsInput } from './types';

const buildUploadAccountsPayload = ({
  fileContent,
  bankCode,
}: UploadAccountsInput): UploadUserAccountPayload => {
  const [agent, ...users] = fileContent.split('\n');
  const userList: UploadUserAccountPayload['users'] = [];
  users.forEach((element) => {
    const [
      schemeId,
      accountNumber,
      ,
      customerName,
      currentBalance,
      lastDepositDate,
    ] = element.split(',');
    if (!accountNumber || !customerName) return; // skip invalid lines
    userList.push({
      schemeId,
      accountNumber: Number(accountNumber),
      customerName,
      currentBalance: Number(currentBalance),
      lastDepositDate,
    });
  });
  const [, agentCode] = agent.split(',');
  return { agentCode: Number(agentCode), bankCode, users: userList };
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
  exportDeposit: async ({ depositId, agentCode, date, depositedAmount }) => {
    const response = await exportDepositById(
      depositId,
      agentCode,
      date,
      depositedAmount,
    );
    generateDepositDatFile(response);
  },
};
