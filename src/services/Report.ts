import type { ReportPayload, ReportResponse } from '../types/Report';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

export const fetchReportData = async (
  payload: ReportPayload,
): Promise<ReportResponse[]> => {
  const query = new URLSearchParams({
    from: payload.from,
    to: payload.to,
    bankCode: payload.bankCode,
    agent: payload.agent,
    schemeType: payload.schemeType,
    collectionStatus: payload.collectionStatus,
  }).toString();
  const response = await api.get(`${API_URLS.REPORT}?${query}`);
  return response.data;
};
