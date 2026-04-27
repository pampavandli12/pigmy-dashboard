import { describe, expect, it } from 'vitest';
import { API_URLS, MOCK_DEPOSIT_RESPONSE, appConfig } from '../../src/utils/constants';

describe('constants', () => {
  it('exports app config and API paths', () => {
    expect(appConfig).toMatchObject({
      apiDomain: 'http://localhost:1002',
      apiTimeout: 30000,
      logLevel: 'debug',
    });
    expect(API_URLS).toMatchObject({
      LOGIN: '/pigmy/v1/login',
      AGENT: '/pigmy/v1/agent',
      CREATE_DEPOSIT: '/pigmy/v1/agent/deposit/multipleDate',
    });
    expect(MOCK_DEPOSIT_RESPONSE.users).toHaveLength(2);
  });
});

