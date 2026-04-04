import type { TransactionStatus } from "./sharedEnums";

export interface Transaction {
  trasactionId: number;
  accountNumber: number;
  customerName: string;
  collectedAmount: number;
  status: TransactionStatus;
  schemeName: string;
}

export type TransactionsResponse = Transaction[];
