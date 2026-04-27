import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('../../src/services/axios', () => ({ api: apiMock }));

import { fetchUserAccounts, uploadUserAccount } from '../../src/services/account';
import { useAuthStore } from '../../src/store/AuthStore';
import { API_URLS } from '../../src/utils/constants';

describe('account service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ bankCode: 'BANK1', token: 'token' });
    apiMock.get.mockResolvedValue({ data: 'get-data' });
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
  });
});

