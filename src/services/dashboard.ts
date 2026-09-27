import type { DashboardResponse } from '../types/Dashboard';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

export const fetchDashboard = async (
  bankCode: string,
): Promise<DashboardResponse> => {
  const response = await api.get(
    `${API_URLS.DASHBOARD}?bankCode=${encodeURIComponent(bankCode)}`,
  );
  return response.data;
};
