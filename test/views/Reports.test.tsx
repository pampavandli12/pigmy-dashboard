import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRenderStoreState,
  renderRoute,
  resetRenderStores,
} from '../renderTestUtils';
import Reports from '../../src/views/Reports';

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders reports', () => {
    expect(renderRoute(<Reports />)).toContain('Reports');
  });

  it('fetches agents and initial report data for the current branch', () => {
    renderRoute(<Reports />);

    const { reportStore } = getRenderStoreState();
    expect(reportStore.fetchAgents).toHaveBeenCalledWith('BANK1');
    expect(reportStore.fetchReportData).toHaveBeenCalledWith(
      expect.objectContaining({
        bankCode: 'BANK1',
        agent: 'ALL',
        schemeType: 'ALL',
        collectionStatus: 'ALL',
      }),
    );
  });

  it('renders successfully when sub-branches are present', () => {
    const { auth } = getRenderStoreState();
    auth.subBranches = [
      { bankCode: 'BANK2', bankName: 'Branch Two', city: 'Madurai' },
    ];

    const html = renderRoute(<Reports />);

    expect(html).toContain('Test Bank');
    expect(html).toContain('Chennai');
    expect(html).toContain('Apply Filter');
  });
});
