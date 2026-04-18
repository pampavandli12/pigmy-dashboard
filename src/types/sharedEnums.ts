export type LoginPayload = {
  bankCode: string;
  userName: string;
  password: string;
};
export const Status = {
  Idle: 'Idle',
  Loading: 'Loafing',
  Success: 'Success',
  Error: 'Error',
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export type Agent = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  agentCode: number;
  bankCode: string;
  type: 'agent' | 'employee';
  limitAmount: number;
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
