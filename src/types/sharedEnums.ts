export type LoginPayload = {
  bankCode: string;
  userName: string;
  password: string;
};

export type LoginSubBranch = {
  bankCode: string;
  bankName: string;
  city: string;
};

export type LoginResponse = {
  bankName: string;
  bankCode: string;
  token: string;
  city: string;
  subBranches: LoginSubBranch[];
  bankType: string;
};
export const Status = {
  Idle: 'Idle',
  Loading: 'Loading',
  Success: 'Success',
  Error: 'Error',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export type Agent = {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  agentCode: number;
  bankCode: string;
  type: 'agent' | 'employee';
  limitAmount: number;
  graceDays: number;
  status: 'active' | 'inactive';
  password?: string;
};

export type AgentsResponse = Agent[];
export const Severity = {
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
  Success: 'success',
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];
export const TransactionStatus = {
  C: 'Collected',
  Failed: 'Failed',
  Pending: 'Pending',
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const CollectionStatus = {
  Deposited: 'Deposited',
  Collected: 'Collected',
} as const;
export type CollectionStatus =
  (typeof CollectionStatus)[keyof typeof CollectionStatus];

export const SchemeType = {
  PigmyDeposit: 'Pigmy Deposit',
  DailyDeposit: 'Daily Deposit',
} as const;
export type SchemeType = (typeof SchemeType)[keyof typeof SchemeType];
