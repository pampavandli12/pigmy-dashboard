import type {
  CreateDepositPayload,
  CreateDepositResponse,
  CreatePeocitDepositResponse,
  PastDepositPayload,
  TransactionsResponse,
} from '../types/Agent';
import type { Agent, AgentsResponse } from '../types/sharedEnums';
import { API_URLS } from '../utils/constants';
import type { AddAgentFormValues } from '../utils/formSchemas';
import { api } from './axios';

// `bankCode` is passed in by the calling store so services stay a thin HTTP layer
// (views → stores → services → HTTP), never reaching back up into the store.

const qs = (params: Record<string, string | number>): string =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

export const fetchAgents = async (
  bankCode: string,
): Promise<AgentsResponse> => {
  const response = await api.get(`${API_URLS.AGENT}?${qs({ bankCode })}`);
  return response.data;
};

export const createAgent = async (
  agentData: AddAgentFormValues,
  bankCode: string,
): Promise<Agent> => {
  const response = await api.post(API_URLS.AGENT, { ...agentData, bankCode });
  return response.data;
};

export const fetchAgentByCode = async (
  agentCode: string,
  bankCode: string,
): Promise<Agent> => {
  const response = await api.get(
    `${API_URLS.AGENT}?${qs({ agentCode, bankCode })}`,
  );
  return response.data;
};

export const updateAgent = async (
  agentCode: string,
  agentData: Partial<Agent>,
  bankCode: string,
): Promise<Agent> => {
  const response = await api.patch(
    `${API_URLS.AGENT}?${qs({ agentCode, bankCode })}`,
    {
      ...agentData,
      bankCode,
      agentCode: Number(agentCode),
    },
  );
  return response.data;
};

export const fetchTransactions = async (
  agentCode: number,
  date: string,
  bankCode: string,
): Promise<TransactionsResponse> => {
  const response = await api.get(
    `${API_URLS.AGENT_TRANSACTIONS}?${qs({ agentCode, bankCode, date })}`,
  );
  return response.data;
};

export const deleteTransaction = async (
  transactionId: number,
): Promise<unknown> => {
  const response = await api.delete(
    `${API_URLS.AGENT_TRANSACTIONS}?${qs({ transactionId })}`,
  );
  return response.data;
};

export const createBanksoftDeposit = async (
  payload: CreateDepositPayload,
): Promise<CreateDepositResponse> => {
  const response = await api.post(API_URLS.CREATE_DEPOSIT.banksoft, {
    ...payload,
  });
  return response.data;
};

export const createPeocitDeposit = async (
  payload: CreateDepositPayload,
): Promise<CreatePeocitDepositResponse> => {
  const response = await api.post(API_URLS.CREATE_DEPOSIT.peocit, {
    ...payload,
  });
  return response.data;
};

export const fetchPastDeposits = async (
  payload: PastDepositPayload,
): Promise<unknown> => {
  const response = await api.get(
    `${API_URLS.PAST_DEPOSITS}?${qs({
      agentCode: payload.agentCode,
      bankCode: payload.bankCode,
      from: payload.fromDate,
      to: payload.toDate,
    })}`,
  );
  return response.data;
};

// Both bank types share one export endpoint; the caller specifies the response shape.
export const exportDepositById = async <
  T = CreateDepositResponse | CreatePeocitDepositResponse,
>(
  depositId: number,
  agentCode: number,
  date: string,
  depositedAmount: number,
  bankCode: string,
): Promise<T> => {
  const response = await api.get(
    `${API_URLS.EXPORT_DEPOSIT_BY_ID}?${qs({
      depositId,
      bankCode,
      agentCode,
      date,
      depositedAmount,
    })}`,
  );
  return response.data;
};

export const deviceReset = async (phoneNumber: string): Promise<unknown> => {
  const response = await api.delete(
    `${API_URLS.RESET_DEVICE}?${qs({ mobileNumber: phoneNumber })}`,
  );
  return response.data;
};
