import { describe, expect, it } from 'vitest';
import { API_URLS, appConfig } from '../../src/utils/constants';

describe('constants', () => {
  it('exports app config and API paths', () => {
    expect(appConfig).toMatchObject({
      apiDomain: 'https://pigmyapp-jomt.onrender.com',
      apiTimeout: 30000,
      logLevel: 'debug',
    });
    expect(API_URLS).toMatchObject({
      LOGIN: '/pigmy/v1/login',
      AGENT: '/pigmy/v1/agent',
      UPLOAD_ACCOUNTS: { banksoft: '/pigmy/v1/user' },
      CREATE_DEPOSIT: { banksoft: '/pigmy/v1/agent/deposit/multipleDate' },
    });
  });
});
