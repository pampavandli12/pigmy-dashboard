import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  const storage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  });
});

import { api } from '../../src/services/axios';
import { useAuthStore } from '../../src/store/AuthStore';
import { API_URLS } from '../../src/utils/constants';

type RequestInterceptor = (config: {
  url?: string;
  headers: Record<string, string>;
}) => { headers: Record<string, string> };

const runRequestInterceptor = (url?: string) => {
  const handlers = (
    api.interceptors.request as unknown as {
      handlers: { fulfilled: RequestInterceptor }[];
    }
  ).handlers;
  return handlers[0].fulfilled({ url, headers: {} });
};

describe('axios request interceptor', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 'token', bankType: 'peocit' });
  });

  it('attaches the bankType header for non-login requests', () => {
    const config = runRequestInterceptor(API_URLS.AGENT);
    expect(config.headers.bankType).toBe('peocit');
    expect(config.headers.Authorization).toBe('token');
  });

  it('omits the bankType header for the login request', () => {
    const config = runRequestInterceptor(API_URLS.LOGIN);
    expect(config.headers.bankType).toBeUndefined();
  });

  it('sends an empty bankType when none is set', () => {
    useAuthStore.setState({ bankType: null });
    const config = runRequestInterceptor(API_URLS.AGENT);
    expect(config.headers.bankType).toBe('');
  });
});
