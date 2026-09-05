import { useAuthStore } from '../store/AuthStore';
import type { DashboardResponse } from '../types/Dashboard';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

export const fetchDashboard = async (): Promise<DashboardResponse> => {
  const bankCode = useAuthStore.getState().bankCode;

  return api
    .get(`${API_URLS.DASHBOARD}?bankCode=${bankCode}`)
    .then((response) => response.data);
};
