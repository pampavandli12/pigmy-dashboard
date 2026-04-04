export interface Transaction {
  trasactionId: number;
  accountNumber: number;
  customerName: string;
  collectedAmount: number;
}

export type TransactionsResponse = Transaction[];
