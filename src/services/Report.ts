import type { ReportPayload } from '../types/Report';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

export const fetchAgents = async (bankCode: string) => {
  return api
    .get(`${API_URLS.AGENT}?bankCode=${bankCode}`)
    .then((response) => response.data);
};

export const fetchReportData = async (payload: ReportPayload) => {
  return api
    .get(
      `${API_URLS.REPORT}?from=${payload.from}&to=${payload.to}&bankCode=${payload.bankCode}&agent=${payload.agent}&schemeType=${payload.schemeType}&collectionStatus=${payload.collectionStatus}`,
    )
    .then((response) => response.data);
};
// http://localhost:1002/pigmy/v1/transaction/search?bankCode=AGT123&from=2026-06-19&to=2026-06-21&agent=ALL&schemeType=Pigmy
