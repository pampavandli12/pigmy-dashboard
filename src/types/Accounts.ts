export interface Account {
  schemeId: string;
  userId: number;
  accountNumber: number;
  customerName: string;
  currentBalance: number;
  lastDepositDate: string;
  agentCode?: number;
  bankCode: string;
}

export type AccountsResponse = Account[];
export type AccountFetchResponse = Array<Account & { agentName: string }>;
export type UploadUserAccountPayload = {
  agentCode: number;
  bankCode: string;
  users: Array<
    Pick<
      Account,
      | "schemeId"
      | "accountNumber"
      | "customerName"
      | "currentBalance"
      | "lastDepositDate"
    >
  >;
};
