import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosMock = vi.hoisted(() => {
  const handlers = {
    requestFulfilled: undefined as
      | ((config: { headers: Record<string, string> }) => unknown)
      | undefined,
    requestRejected: undefined as ((error: unknown) => Promise<never>) | undefined,
    responseFulfilled: undefined as ((response: unknown) => unknown) | undefined,
    responseRejected: undefined as ((error: {
      response?: { status: number };
    }) => Promise<never>) | undefined,
  };
  const api = {
    interceptors: {
      request: {
        use: vi.fn((fulfilled, rejected) => {
          handlers.requestFulfilled = fulfilled;
          handlers.requestRejected = rejected;
        }),
      },
      response: {
        use: vi.fn((fulfilled, rejected) => {
          handlers.responseFulfilled = fulfilled;
          handlers.responseRejected = rejected;
        }),
      },
    },
  };
  return {
    api,
    handlers,
    create: vi.fn(() => api),
  };
});

vi.mock('axios', () => ({
  default: {
    create: axiosMock.create,
  },
}));

import { api } from '../../src/services/axios';
import { useAuthStore } from '../../src/store/AuthStore';
import { appConfig } from '../../src/utils/constants';

describe('axios service', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: 'secret-token' });
    vi.stubGlobal('window', { location: { href: '' } });
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('creates the API client and decorates outgoing requests', () => {
    expect(axiosMock.create).toHaveBeenCalledWith({
      baseURL: appConfig.apiDomain,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(api).toBe(axiosMock.api);

    const config = axiosMock.handlers.requestFulfilled?.({ headers: {} });

    expect(config).toMatchObject({
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'secret-token',
      },
    });
  });

  it('rejects interceptor errors and logs out on forbidden responses', async () => {
    const requestError = new Error('request failed');
    await expect(
      axiosMock.handlers.requestRejected?.(requestError),
    ).rejects.toThrow('request failed');

    const response = { data: 'ok' };
    expect(axiosMock.handlers.responseFulfilled?.(response)).toBe(response);

    useAuthStore.setState({ token: 'secret-token', bankCode: 'BANK' });
    await expect(
      axiosMock.handlers.responseRejected?.({ response: { status: 403 } }),
    ).rejects.toEqual({ response: { status: 403 } });

    expect(useAuthStore.getState()).toMatchObject({
      token: null,
      bankCode: null,
      bankName: null,
    });
    expect(window.location.href).toBe('/signin');
  });
});

