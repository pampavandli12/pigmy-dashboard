import { useAuthStore } from '../store/AuthStore';
import type {
  CreateDepositPayload,
  TransactionsResponse,
} from '../types/Agent';
import { API_URLS } from '../utils/constants';
import type { AddAgentFormValues } from '../utils/formSchemas';
import { api } from './axios';

export const fetchAgents = async () => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store

  return api
    .get(`${API_URLS.AGENT}?bankCode=${bankCode}`)
    .then((response) => response.data);
};
export const createAgent = async (agentData: AddAgentFormValues) => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store

  return api
    .post(API_URLS.AGENT, { ...agentData, bankCode })
    .then((response) => response.data);
};
export const fetchAgentByCode = async (agentCode: string) => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store
  return api
    .get(`${API_URLS.AGENT}?agentCode=${agentCode}&bankCode=${bankCode}`)
    .then((response) => response.data);
};
export const updateAgent = async (
  agentCode: string,
  agentData: AddAgentFormValues,
) => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store

  return api
    .patch(`${API_URLS.AGENT}?agentCode=${agentCode}&bankCode=${bankCode}`, {
      ...agentData,
      bankCode,
      agentCode: Number(agentCode),
    })
    .then((response) => response.data);
};
export const fetchTransactions = async (
  agentCode: number,
  date: string,
): Promise<TransactionsResponse> => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store

  return api
    .get(
      `${API_URLS.AGENT_TRANSACTIONS}?agentCode=${agentCode}&bankCode=${bankCode}&date=${date}`,
    )
    .then((response) => response.data);
};
export const createDeposit = async (
  payload: CreateDepositPayload,
): Promise<void> => {
  return api
    .post(API_URLS.CREATE_DEPOSIT, { ...payload })
    .then((response) => response.data);
};
