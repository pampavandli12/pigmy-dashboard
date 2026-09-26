import dayjs from 'dayjs';
import { createBanksoftDeposit } from '../services/agents';
import { uploadBanksoftAccounts } from '../services/account';
import type { UploadUserAccountPayload } from '../types/Accounts';
import type { CreateDepositPayload } from '../types/Agent';
import { generateDepositDatFile } from '../utils/helpers';
import type {
  BankTypeHandler,
  CreateDepositInput,
  UploadAccountsInput,
} from './types';

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

const buildCreateDepositPayload = ({
  agentCode,
  agentName,
  bankCode,
  formValues,
}: CreateDepositInput): CreateDepositPayload => ({
  name: agentName,
  agentCode,
  bankCode,
  depositingAmount: formValues.depositingAmount,
  voucherId: formValues.voucherId,
  from: dayjs(formValues.dateRange.startDate).format('YYYY-MM-DD'),
  to: dayjs(formValues.dateRange.endDate).format('YYYY-MM-DD'),
});

export const banksoftHandler: BankTypeHandler = {
  uploadAccounts: (input) =>
    uploadBanksoftAccounts(buildUploadAccountsPayload(input)),
  createDeposit: async (input) => {
    const response = await createBanksoftDeposit(
      buildCreateDepositPayload(input),
    );
    generateDepositDatFile(response);
  },
};
