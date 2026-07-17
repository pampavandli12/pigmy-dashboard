import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('../../src/services/axios', () => ({ api: apiMock }));

import { fetchAgents, fetchReportData } from '../../src/services/Report';
import { API_URLS } from '../../src/utils/constants';

describe('Report service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.get.mockResolvedValue({ data: 'report-data' });
  });

  it('fetches agents for a branch', async () => {
    await expect(fetchAgents('BANK1')).resolves.toBe('report-data');
    expect(apiMock.get).toHaveBeenCalledWith(`${API_URLS.AGENT}?bankCode=BANK1`);
  });

  it('fetches report data with the expected query string', async () => {
    const payload = {
      bankCode: 'BANK1',
      from: '2026-07-01',
      to: '2026-07-17',
      agent: 'ALL',
      schemeType: 'Pigmy Deposit',
      collectionStatus: 'Collected',
    };

    await expect(fetchReportData(payload)).resolves.toBe('report-data');
    expect(apiMock.get).toHaveBeenCalledWith(
      `${API_URLS.REPORT}?from=2026-07-01&to=2026-07-17&bankCode=BANK1&agent=ALL&schemeType=Pigmy Deposit&collectionStatus=Collected`,
    );
  });
});
