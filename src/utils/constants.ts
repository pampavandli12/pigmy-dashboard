export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type AppConfig = {
  apiDomain: string;
  apiTimeout: number;
  logLevel: LogLevel;
};

// Fallbacks used when an env var is not set. VITE_* values (see .env.* files and
// the deploy platform) take precedence, so the API domain is configurable per build.
const DEFAULT_API_DOMAIN = 'https://pigmyapp-jomt.onrender.com';
const DEFAULT_API_TIMEOUT = import.meta.env.PROD ? 10000 : 30000;
const DEFAULT_LOG_LEVEL: LogLevel = import.meta.env.PROD ? 'error' : 'debug';

const parsedTimeout = Number(import.meta.env.VITE_API_TIMEOUT);

export const appConfig: AppConfig = {
  apiDomain: import.meta.env.VITE_API_DOMAIN || DEFAULT_API_DOMAIN,
  apiTimeout: Number.isFinite(parsedTimeout) && parsedTimeout > 0
    ? parsedTimeout
    : DEFAULT_API_TIMEOUT,
  logLevel: import.meta.env.VITE_LOG_LEVEL ?? DEFAULT_LOG_LEVEL,
};

export const API_URLS = {
  LOGIN: '/pigmy/v1/login',
  AGENT: '/pigmy/v1/agent',
  AGENT_TRANSACTIONS: '/pigmy/v1/transaction',
  UPLOAD_ACCOUNTS: {
    banksoft: '/pigmy/v1/user',
    peocit: '/pigmy/v1/user/peocit',
  },
  USER_ACCOUNTS: '/pigmy/v1/user',
  CREATE_DEPOSIT: {
    banksoft: '/pigmy/v1/agent/deposit/multipleDate',
    peocit: '/pigmy/v1/agent/deposit/multipleDate/peocit',
  },
  PAST_DEPOSITS: '/pigmy/v1/agent/pastDeposits',
  EXPORT_DEPOSIT_BY_ID: '/pigmy/v1/agent/export',
  UPDATE_PHONE: '/pigmy/v1/user/upload/mobilenumbers',
  UPDATE_PHONE_BY_ACCOUNT: '/pigmy/v1/user/updateMobileNumber',
  REPORT: '/pigmy/v1/transaction/search',
  RESET_DEVICE: '/pigmy/v1/agent/revoke',
  DASHBOARD: '/pigmy/v1/dashboard',
};
