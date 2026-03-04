import { create } from "zustand";
import { Status, type Agent, type AgentsResponse } from "../types/sharedEnums";
import type { AddAgentFormValues } from "../utils/formSchemas";
import { createAgent, fetchAgents } from "../services/agents";

type State = {
  fetchAgentLoadingStatus: Status;
  createAgentLoadingStatus: Status;
  agents: AgentsResponse;
  selectedAgent: Agent | null;
};

type Action = {
  fetchAgents: () => void;
  createAgent: (paylaod: AddAgentFormValues) => void;
};

export const useAgentStore = create<State & Action>((set) => ({
  fetchAgentLoadingStatus: Status.Idle,
  createAgentLoadingStatus: Status.Idle,
  agents: [],
  selectedAgent: null,
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
    set({ createAgentLoadingStatus: Status.Loading });
    try {
      await createAgent(payload);
      set({ createAgentLoadingStatus: Status.Success });
    } catch (error) {
      console.error("Failed to create agent:", error);
      set({ createAgentLoadingStatus: Status.Error });
    }
  },
}));
