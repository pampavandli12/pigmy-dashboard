import type { CreateDepositFormValues } from '../utils/formSchemas';

export type UploadAccountsInput = {
  fileContent: string;
  bankCode: string;
};

export type CreateDepositInput = {
  agentCode: number;
  agentName: string;
  bankCode: string;
  formValues: CreateDepositFormValues;
};

// Each bank type owns its complete flow: payload creation, API call and output.
export interface BankTypeHandler {
  uploadAccounts: (input: UploadAccountsInput) => Promise<unknown>;
  createDeposit: (input: CreateDepositInput) => Promise<void>;
}
