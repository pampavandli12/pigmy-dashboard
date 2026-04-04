import { create } from "zustand";
import {
  Severity,
  Status,
  type Agent,
  type AgentsResponse,
} from "../types/sharedEnums";
import type { AddAgentFormValues } from "../utils/formSchemas";
import {
  createAgent,
  fetchAgentByCode,
  fetchAgents,
  fetchTransactions,
  updateAgent,
} from "../services/agents";
import { useAlertStore } from "./AlertStore";
import type { TransactionsResponse } from "../types/Agent";

type State = {
  fetchAgentLoadingStatus: Status;
  createAgentLoadingStatus: Status;
  updateAgentLoadingStatus: Status;
  fetchAgentByCodeLoadingStatus: Status;
  agents: AgentsResponse;
  selectedAgent: Agent | null;
  transactions: TransactionsResponse;
  fetchTransactionsLoadingStatus: Status;
};

type Action = {
  fetchAgents: () => void;
  fetchTransactions: (agentCode: number, date: string) => void;
  createAgent: (paylaod: AddAgentFormValues) => void;
  fetchAgentByCode: (agentCode: string) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  updateAgent: (agentCode: string, agentData: AddAgentFormValues) => void;
  setCreateAgentLoadingStatus: (status: Status) => void;
  setUpdateAgentLoadingStatus: (status: Status) => void;
};

export const useAgentStore = create<State & Action>((set) => ({
  fetchAgentLoadingStatus: Status.Idle,
  createAgentLoadingStatus: Status.Idle,
  fetchAgentByCodeLoadingStatus: Status.Idle,
  updateAgentLoadingStatus: Status.Idle,
  transactions: [],
  fetchTransactionsLoadingStatus: Status.Idle,
  agents: [],
  selectedAgent: null,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  fetchAgents: async () => {
    set({ fetchAgentLoadingStatus: Status.Loading });
    try {
      const agents = await fetchAgents();
      set({ agents, fetchAgentLoadingStatus: Status.Success });
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      set({ fetchAgentLoadingStatus: Status.Error });
    }
  },
  createAgent: async (payload: AddAgentFormValues) => {
    const showAlert = useAlertStore.getState().showAlert;
    set({ createAgentLoadingStatus: Status.Loading });
    try {
      await createAgent(payload);
      set({ createAgentLoadingStatus: Status.Success });
      showAlert(true, "Agent created successfully!!", Severity.Success);
    } catch (error) {
      console.error("Failed to create agent:", error);
      set({ createAgentLoadingStatus: Status.Error });
      showAlert(
        false,
        "Create Agent Failed, Please try again",
        Severity.Warning,
      );
    }
  },
  fetchAgentByCode: async (agentCode: string) => {
    set({ fetchAgentByCodeLoadingStatus: Status.Loading });
    try {
      const agent = await fetchAgentByCode(agentCode);
      console.log("Fetched agent by code:", agent);
      set({
        selectedAgent: agent,
        fetchAgentByCodeLoadingStatus: Status.Success,
      });
    } catch (error) {
      console.error("Failed to fetch agent by code:", error);
      set({ fetchAgentByCodeLoadingStatus: Status.Error });
    }
  },
  fetchTransactions: async (agentCode: number, date: string) => {
    set({ fetchTransactionsLoadingStatus: Status.Loading, transactions: [] });
    const alertStore = useAlertStore.getState();
    try {
      const transactions = await fetchTransactions(agentCode, date);
      set({
        transactions,
        fetchTransactionsLoadingStatus: Status.Success,
      });
      alertStore.showAlert(
        true,
        "Transactions fetched successfully.",
        Severity.Success,
      );
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      set({ fetchTransactionsLoadingStatus: Status.Error });
      alertStore.showAlert(
        true,
        "Failed to fetch transactions. Please try again.",
        Severity.Error,
      );
    }
  },
  updateAgent: async (agentCode: string, agentData: AddAgentFormValues) => {
    set({ updateAgentLoadingStatus: Status.Loading });
    const showAlert = useAlertStore.getState().showAlert;
    try {
      await updateAgent(agentCode, agentData);
      set({ updateAgentLoadingStatus: Status.Success });
      showAlert(true, "Agent updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update agent:", error);
      set({ updateAgentLoadingStatus: Status.Error });
      showAlert(true, "Failed to update agent. Please try again.", "error");
    }
  },
  setCreateAgentLoadingStatus: (status: Status) =>
    set({ createAgentLoadingStatus: status }),
  setUpdateAgentLoadingStatus: (status: Status) =>
    set({ updateAgentLoadingStatus: status }),
}));
