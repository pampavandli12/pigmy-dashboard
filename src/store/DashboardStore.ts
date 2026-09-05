import { create } from 'zustand';
import { fetchDashboard } from '../services/dashboard';
import type { DashboardResponse } from '../types/Dashboard';
import { Severity, Status } from '../types/sharedEnums';
import { useAlertStore } from './AlertStore';

interface DashboardState {
  dashboardData: DashboardResponse | null;
  dashboardLoadingStatus: Status;
}

type Action = {
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState & Action>((set) => ({
  dashboardData: null,
  dashboardLoadingStatus: Status.Idle,
  fetchDashboard: async () => {
    set({ dashboardLoadingStatus: Status.Loading });

    try {
      const dashboardData = await fetchDashboard();
      set({ dashboardData, dashboardLoadingStatus: Status.Success });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      set({ dashboardLoadingStatus: Status.Error });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Failed to fetch dashboard data. Please try again.',
        Severity.Error,
      );
    }
  },
}));
