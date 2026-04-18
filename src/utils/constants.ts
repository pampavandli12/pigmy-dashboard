import type { CreateDepositResponse } from '../types/Agent';

export type AppConfig = {
  apiDomain: string;
  apiTimeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
};

type Environment = 'development' | 'staging' | 'production';

const getConfig = (env: Environment): AppConfig => {
  const configs: Record<Environment, AppConfig> = {
    development: {
      // apiDomain:
      //   "https://uncontrastively-nondyspeptical-mabelle.ngrok-free.dev",
      apiDomain: 'http://localhost:1002',
      apiTimeout: 30000,
      logLevel: 'debug',
    },
    staging: {
      apiDomain: 'https://api-staging.example.com',
      apiTimeout: 30000,
      logLevel: 'info',
    },
    production: {
      apiDomain: 'https://api.example.com',
      apiTimeout: 10000,
      logLevel: 'error',
    },
  };

  return configs[env];
};

export const appConfig = getConfig('development');

export const API_URLS = {
  LOGIN: '/pigmy/v1/login',
  AGENT: '/pigmy/v1/agent',
  AGENT_TRANSACTIONS: '/pigmy/v1/transaction',
  UPLOAD_ACCOUNTS: '/pigmy/v1/user',
  USER_ACCOUNTS: '/pigmy/v1/user',
  CREATE_DEPOSIT: '/pigmy/v1/agent/deposit/multipleDate',
  PAST_DEPOSITS: '/pigmy/v1/agent/pastDeposits',
  EXPORT_DEPOSITE_BY_ID: 'pigmy/v1/agent/export',
};

export const MOCK_DEPOSIT_RESPONSE: CreateDepositResponse = {
  agentCode: 1,
  bankCode: 'AGT123',
  totalDepositedAmount: 2000,
  depositedDate: '12.04.26',
  users: [
    {
      schemeId: '012d',
      accountNumber: 3,
      collectedAmount: 500,
      customerName: 'Rahul Mehta',
      collectedDate: '12.04.26',
    },
    {
      schemeId: '017d',
      accountNumber: 3,
      collectedAmount: 1500,
      customerName: 'Rahul Mehta',
      collectedDate: '12.04.26',
    },
  ],
};
