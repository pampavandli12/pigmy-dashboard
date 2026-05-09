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

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));

vi.mock('../../src/services/axios', () => ({ api: apiMock }));

import {
  fetchUserAccounts,
  updateUserAccounts,
  UpdateUserPhoneNumber,
  uploadUserAccount,
} from '../../src/services/account';
import { useAuthStore } from '../../src/store/AuthStore';
import { API_URLS } from '../../src/utils/constants';

describe('account service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ bankCode: 'BANK1', token: 'token' });
    apiMock.get.mockResolvedValue({ data: 'get-data' });
    apiMock.patch.mockResolvedValue({ data: 'patch-data' });
    apiMock.post.mockResolvedValue({ data: 'post-data' });
  });

  it('fetches and uploads user accounts', async () => {
    await expect(fetchUserAccounts()).resolves.toBe('get-data');
    expect(apiMock.get).toHaveBeenLastCalledWith(
      `${API_URLS.USER_ACCOUNTS}?bankCode=BANK1`,
    );

    const uploadPayload = { agentCode: 77, bankCode: 'BANK1', users: [] };
    await expect(uploadUserAccount(uploadPayload)).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(
      API_URLS.UPLOAD_ACCOUNTS,
      uploadPayload,
    );

    const updatePayload = {
      bankCode: 'BANK1',
      userDetailsList: [{ accountNumber: 100, mobilenumber: 9876543210 }],
    };
    await expect(updateUserAccounts(updatePayload)).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(
      API_URLS.UPDATE_PHONE,
      updatePayload,
    );

    await expect(UpdateUserPhoneNumber('9876543210', 7)).resolves.toBe(
      'patch-data',
    );
    expect(apiMock.patch).toHaveBeenLastCalledWith(
      `${API_URLS.UPDATE_PHONY_BY_ACCOUNT}?userId=7&updateMobileNumber=9876543210`,
    );
  });
});
