import { useAuthStore } from "../store/AuthStore";
import { API_URLS } from "../utils/constants";
import type { AddAgentFormValues } from "../utils/formSchemas";
import { api } from "./axios";

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
