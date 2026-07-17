import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Severity, Status } from '../../src/types/sharedEnums';

const reportApi = vi.hoisted(() => ({
  fetchAgents: vi.fn(),
  fetchReportData: vi.fn(),
}));

vi.mock('../../src/services/Report', () => reportApi);

import { useAlertStore } from '../../src/store/AlertStore';
import { useReportStore } from '../../src/store/ReportStore';

const reportRow = {
  accountNumber: 100,
  customerName: 'Asha',
  collectedAmount: 250,
  schemeName: 'Pigmy Deposit',
  status: 'Collected',
  agentName: 'Agent One',
  collectedDate: '2026-07-17',
};

describe('ReportStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    useAlertStore.setState({
      alert: { open: false, message: '', severity: Severity.Success },
    });
    useReportStore.setState({
      reportData: [],
      reportLoadingStatus: Status.Idle,
      agentLoadingStatus: Status.Idle,
      agents: [],
    });
  });

  it('loads agents and reports successfully', async () => {
    reportApi.fetchAgents.mockResolvedValue([
      {
        id: 1,
        name: 'Agent One',
        address: 'Town',
        phone: '9876543210',
        email: 'agent@example.com',
        agentCode: 77,
        bankCode: 'BANK1',
        type: 'agent',
        status: 'active',
        limitAmount: 1000,
      },
    ]);
    reportApi.fetchReportData.mockResolvedValue([reportRow]);

    await useReportStore.getState().fetchAgents('BANK1');
    await useReportStore.getState().fetchReportData({
      bankCode: 'BANK1',
      from: '2026-07-01',
      to: '2026-07-17',
      agent: 'ALL',
      schemeType: 'ALL',
      collectionStatus: 'ALL',
    });

    expect(useReportStore.getState()).toMatchObject({
      agents: [expect.objectContaining({ name: 'Agent One' })],
      agentLoadingStatus: Status.Success,
      reportData: [reportRow],
      reportLoadingStatus: Status.Success,
    });
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Reports fetched successfully.',
      severity: Severity.Success,
    });
  });

  it('handles agent and report fetch failures', async () => {
    reportApi.fetchAgents.mockRejectedValue(new Error('agents failed'));
    reportApi.fetchReportData.mockRejectedValue(new Error('reports failed'));

    await useReportStore.getState().fetchAgents('BANK1');
    await useReportStore.getState().fetchReportData({
      bankCode: 'BANK1',
      from: '2026-07-01',
      to: '2026-07-17',
      agent: 'ALL',
      schemeType: 'ALL',
      collectionStatus: 'ALL',
    });

    expect(useReportStore.getState()).toMatchObject({
      agentLoadingStatus: Status.Error,
      reportLoadingStatus: Status.Error,
      reportData: [],
    });
    expect(useAlertStore.getState().alert).toMatchObject({
      open: true,
      message: 'Failed to fetch reports. Please try again.',
      severity: Severity.Error,
    });
  });
});
