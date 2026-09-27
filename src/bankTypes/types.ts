import type { CreateDepositFormValues } from '../utils/formSchemas';

// The backend "bank types" the app supports; drives handler selection and the
// `bankType` request header.
export type BankType = 'banksoft' | 'peocit';

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
  bankCode: string;
};

// Each bank type owns its complete flow: payload creation, API call and output.
export interface BankTypeHandler {
  uploadAccounts: (input: UploadAccountsInput) => Promise<unknown>;
  createDeposit: (input: CreateDepositInput) => Promise<void>;
  exportDeposit: (input: ExportDepositInput) => Promise<void>;
}
