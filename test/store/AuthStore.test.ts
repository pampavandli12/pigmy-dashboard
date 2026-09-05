import { describe, expect, it, vi } from 'vitest';

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

import { useAuthStore } from '../../src/store/AuthStore';

describe('AuthStore', () => {
  it('updates and clears auth state', () => {
    useAuthStore.setState({
      token: null,
      bankName: null,
      bankCode: null,
      isHydrated: false,
    });

    useAuthStore.getState().setToken('token');
    useAuthStore.getState().setBankName('Bank');
    useAuthStore.getState().setBankCode('BANK2');
    useAuthStore.getState().setBankType('banksoft');
    useAuthStore.getState().setHydrated();
    expect(useAuthStore.getState()).toMatchObject({
      token: 'token',
      bankName: 'Bank',
      bankCode: 'BANK2',
      bankType: 'banksoft',
      isHydrated: true,
    });

    useAuthStore.getState().logout();
    expect(useAuthStore.getState()).toMatchObject({
      token: null,
      bankName: null,
      bankCode: null,
      bankType: null,
    });
  });
});
