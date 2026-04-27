import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock('../../src/services/axios', () => ({ api: apiMock }));

import { login } from '../../src/services/login';
import { API_URLS } from '../../src/utils/constants';

describe('login service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.post.mockResolvedValue({ data: 'post-data' });
  });

  it('posts login credentials', async () => {
    const credentials = {
      bankCode: 'BANK1',
      userName: 'admin',
      password: 'secret1',
    };
    await expect(login(credentials)).resolves.toBe('post-data');
    expect(apiMock.post).toHaveBeenLastCalledWith(API_URLS.LOGIN, credentials);
  });
});

