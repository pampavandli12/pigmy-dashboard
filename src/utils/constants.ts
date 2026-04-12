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
};
