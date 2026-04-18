import type { TransactionStatus } from './sharedEnums';

export interface Transaction {
  trasactionId: number;
  accountNumber: number;
  customerName: string;
  collectedAmount: number;
  status: TransactionStatus;
  schemeName: string;
}

export interface PastDeposit {
  depositId: number;
  agentCode: number;
  bankCode: string;
  depositDate: string;
  totalDepositedAmount: number;
}

export type TransactionsResponse = Transaction[];
export interface CreateDepositPayload {
  name: string;
  agentCode: number;
  bankCode: string;
  depositingAmount: number;
  voucherId: string;
  from: string | Date;
  to: string | Date;
}
export interface PastDepositPayload {
  agentCode: number;
  fromDate: string;
  toDate: string;
  bankCode: string;
}

export interface DepositCollection {
  schemeId: string;
  accountNumber: number;
  collectedAmount: number;
  customerName: string;
  collectedDate: string;
}

export interface CreateDepositResponse {
  agentCode: number;
  bankCode: string;
  totalDepositedAmount: number;
  depositedDate: string;
  users: DepositCollection[];
}
