import { create } from 'zustand';
import type { ReportPayload, ReportReponse } from '../types/Report';
import { Severity, Status, type AgentsResponse } from '../types/sharedEnums';
import { fetchAgents, fetchReportData } from '../services/Report';
import { useAlertStore } from './AlertStore';

interface ReportState {
  reportData: ReportReponse[];
  reportLoadingStatus: Status;
  agentLoadingStatus: Status;
  agents: AgentsResponse;
}
type Action = {
  fetchAgents: (branchCode: string) => void;
  fetchReportData: (payload: ReportPayload) => Promise<void>;
};
export const useReportStore = create<ReportState & Action>((set) => ({
  reportData: [],
  reportLoadingStatus: Status.Idle,
  agentLoadingStatus: Status.Idle,
  agents: [],
  fetchAgents: async (branchCode: string) => {
    set({ agentLoadingStatus: Status.Loading });
    try {
      const agents = await fetchAgents(branchCode);
      set({ agents, agentLoadingStatus: Status.Success });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Agents refreshed successfully.',
        Severity.Success,
      );
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      set({ agentLoadingStatus: Status.Error });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Failed to fetch agents. Please try again.',
        Severity.Error,
      );
    }
  },
  fetchReportData: async (payload: ReportPayload) => {
    set({ reportLoadingStatus: Status.Loading, reportData: [] });
    try {
      const response = await fetchReportData(payload);

      console.log('Response:', response);
      set({ reportData: response, reportLoadingStatus: Status.Success });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Reports fetched successfully.',
        Severity.Success,
      );
    } catch (error) {
      console.error(error);
      set({ reportLoadingStatus: Status.Error });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Failed to fetch reports. Please try again.',
        Severity.Error,
      );
    }
  },
}));
