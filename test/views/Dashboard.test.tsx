import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRenderStoreState,
  renderRoute,
  resetRenderStores,
} from '../renderTestUtils';
import Dashboard from '../../src/views/Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders dashboard title', () => {
    expect(renderRoute(<Dashboard />)).toContain('Dashboard');
  });

  it('fetches dashboard data on load', () => {
    renderRoute(<Dashboard />);

    const { dashboardStore } = getRenderStoreState();
    expect(dashboardStore.fetchDashboard).toHaveBeenCalled();
  });

  it('renders license cards when dashboard data is available', () => {
    const { dashboardStore } = getRenderStoreState();
    dashboardStore.dashboardData = {
      daysLeft: 356,
      expiryDate: '2027-08-20',
      NoOfLicencedPurchased: 1,
      purchaseDate: '2026-08-20',
    };
    dashboardStore.dashboardLoadingStatus = 'Success';

    const html = renderRoute(<Dashboard />);

    expect(html).toContain('Days Left');
    expect(html).toContain('356');
    expect(html).toContain('Expiry Date');
    expect(html).toContain('20/08/2027');
    expect(html).toContain('Licenses Purchased');
    expect(html).toContain('Purchase Date');
    expect(html).toContain('20/08/2026');
    expect(html).not.toContain('Top Performing Agents');
    expect(html).not.toContain('Purchase License');
  });

  it('shows warning styling when days left are below 45', () => {
    const { dashboardStore } = getRenderStoreState();
    dashboardStore.dashboardData = {
      daysLeft: 30,
      expiryDate: '2027-08-20',
      NoOfLicencedPurchased: 1,
      purchaseDate: '2026-08-20',
    };
    dashboardStore.dashboardLoadingStatus = 'Success';

    const html = renderRoute(<Dashboard />);

    expect(html).toContain('30');
    expect(html).toContain('data-warning="true"');
  });
});
