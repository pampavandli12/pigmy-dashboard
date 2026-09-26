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

export type ExportDepositInput = {
  depositId: number;
  agentCode: number;
  date: string;
  depositedAmount: number;
};

// Each bank type owns its complete flow: payload creation, API call and output.
export interface BankTypeHandler {
  uploadAccounts: (input: UploadAccountsInput) => Promise<unknown>;
  createDeposit: (input: CreateDepositInput) => Promise<void>;
  exportDeposit: (input: ExportDepositInput) => Promise<void>;
}
