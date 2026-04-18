import { create } from 'zustand';
import {
  Severity,
  Status,
  type Agent,
  type AgentsResponse,
} from '../types/sharedEnums';
import type {
  AddAgentFormValues,
  CreateDepositFormValues,
} from '../utils/formSchemas';
import {
  createAgent,
  createDeposit,
  exportDepositById,
  fetchAgentByCode,
  fetchAgents,
  fetchPastDeposits,
  fetchTransactions,
  updateAgent,
} from '../services/agents';
import { useAlertStore } from './AlertStore';
import type {
  CreateDepositPayload,
  CreateDepositResponse,
  PastDeposit,
  TransactionsResponse,
} from '../types/Agent';
import { useAuthStore } from './AuthStore';
import dayjs from 'dayjs';
import { generateDepositDatFile } from '../utils/helpers';

type State = {
  fetchAgentLoadingStatus: Status;
  createAgentLoadingStatus: Status;
  updateAgentLoadingStatus: Status;
  fetchAgentByCodeLoadingStatus: Status;
  agents: AgentsResponse;
  selectedAgent: Agent | null;
  transactions: TransactionsResponse;
  fetchTransactionsLoadingStatus: Status;
  createDepositLoadingStatus: Status;
  fetchPastDepositsLoadingStatus: Status;
  exportDepositLoadingStatus: Status;
  pastDeposits: PastDeposit[];
};

type Action = {
  fetchAgents: () => void;
  fetchTransactions: (agentCode: number, date: string) => void;
  createAgent: (paylaod: AddAgentFormValues) => void;
  fetchAgentByCode: (agentCode: string) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  updateAgent: (agentCode: string, agentData: Partial<Agent>) => void;
  setCreateAgentLoadingStatus: (status: Status) => void;
  setUpdateAgentLoadingStatus: (status: Status) => void;
  exportDepositeById: (
    depositeId: number,
    agentCode: number,
    date: string,
    depositedAmount: number,
  ) => void;
  createDeposit: (
    formValues: CreateDepositFormValues,
    agentCode: number,
  ) => void;
  fetchPastDeposits: (
    agentCode: number,
    fromDate: string,
    toDate: string,
  ) => void;
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
  createDepositLoadingStatus: Status.Idle,
  fetchPastDepositsLoadingStatus: Status.Idle,
  exportDepositLoadingStatus: Status.Idle,
  pastDeposits: [],
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  fetchAgents: async () => {
    set({ fetchAgentLoadingStatus: Status.Loading });
    try {
      const agents = await fetchAgents();
      set({ agents, fetchAgentLoadingStatus: Status.Success });
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      set({ fetchAgentLoadingStatus: Status.Error });
    }
  },
  createAgent: async (payload: AddAgentFormValues) => {
    const showAlert = useAlertStore.getState().showAlert;
    set({ createAgentLoadingStatus: Status.Loading });
    try {
      await createAgent(payload);
      set({ createAgentLoadingStatus: Status.Success });
      showAlert(true, 'Agent created successfully!!', Severity.Success);
    } catch (error) {
      console.error('Failed to create agent:', error);
      set({ createAgentLoadingStatus: Status.Error });
      showAlert(
        false,
        'Create Agent Failed, Please try again',
        Severity.Warning,
      );
    }
  },
  fetchAgentByCode: async (agentCode: string) => {
    set({ fetchAgentByCodeLoadingStatus: Status.Loading });
    try {
      const agent = await fetchAgentByCode(agentCode);
      console.log('Fetched agent by code:', agent);
      set({
        selectedAgent: agent,
        fetchAgentByCodeLoadingStatus: Status.Success,
      });
    } catch (error) {
      console.error('Failed to fetch agent by code:', error);
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
        'Transactions fetched successfully.',
        Severity.Success,
      );
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      set({ fetchTransactionsLoadingStatus: Status.Error });
      alertStore.showAlert(
        true,
        'Failed to fetch transactions. Please try again.',
        Severity.Error,
      );
    }
  },
  updateAgent: async (agentCode: string, agentData: Partial<Agent>) => {
    set({ updateAgentLoadingStatus: Status.Loading });
    const showAlert = useAlertStore.getState().showAlert;
    try {
      await updateAgent(agentCode, agentData);
      set({ updateAgentLoadingStatus: Status.Success });
      showAlert(true, 'Agent updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update agent:', error);
      set({ updateAgentLoadingStatus: Status.Error });
      showAlert(true, 'Failed to update agent. Please try again.', 'error');
    }
  },
  createDeposit: async (
    formValues: CreateDepositFormValues,
    agentCode: number,
  ) => {
    // Implement the logic to create a deposit using the form values
    // You can call an API service here and handle the response accordingly
    set({ createDepositLoadingStatus: Status.Loading });
    const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store
    const showAlert = useAlertStore.getState().showAlert;
    const agentName =
      useAgentStore
        .getState()
        .agents.find((agent) => agent.agentCode === agentCode)?.name ||
      'Unknown Agent';
    const payload: CreateDepositPayload = {
      name: agentName,
      agentCode: agentCode,
      bankCode: bankCode || '',
      depositingAmount: formValues.depositingAmount,
      voucherId: formValues.voucherId,
      from: dayjs(formValues.dateRange.startDate).format('YYYY-MM-DD'),
      to: dayjs(formValues.dateRange.endDate).format('YYYY-MM-DD'),
    };
    console.log('Creating deposit with values:', formValues);
    try {
      const response: CreateDepositResponse = await createDeposit(payload);
      console.log('Deposit created successfully:', response);
      generateDepositDatFile(response);
      set({ createDepositLoadingStatus: Status.Success });
      showAlert(
        true,
        'Deposit created and file downloaded successfully!',
        'success',
      );
    } catch (error) {
      const errorObj = error as {
        response?: { data: string };
        message?: string;
      };
      const errorMessage = errorObj.response?.data
        ? JSON.parse(errorObj.response.data)?.error || 'Unknown error'
        : errorObj.message || 'Unknown error';
      console.error('Failed to create deposit:', errorMessage);
      set({ createDepositLoadingStatus: Status.Error });
      showAlert(true, errorMessage, 'error');
    }
  },
  exportDepositeById: async (
    depositeId: number,
    agentCode: number,
    date: string,
    depositedAmount: number,
  ) => {
    set({ exportDepositLoadingStatus: Status.Loading });
    const showAlert = useAlertStore.getState().showAlert;
    try {
      const response = await exportDepositById(
        depositeId,
        agentCode,
        date,
        depositedAmount,
      );
      generateDepositDatFile(response);
      set({ exportDepositLoadingStatus: Status.Success });
      showAlert(true, 'Deposit exported successfully!', 'success');
    } catch (error) {
      const errorObj = error as {
        response?: { data: string };
        message?: string;
      };
      const errorMessage = errorObj.response?.data
        ? JSON.parse(errorObj.response.data)?.error || 'Unknown error'
        : errorObj.message || 'Unknown error';
      console.error('Failed to export deposit:', errorMessage);
      set({ exportDepositLoadingStatus: Status.Error });
      showAlert(true, errorMessage, 'error');
    }
  },
  fetchPastDeposits: async (
    agentCode: number,
    fromDate: string,
    toDate: string,
  ) => {
    set({ fetchPastDepositsLoadingStatus: Status.Loading });
    const alertStore = useAlertStore.getState();
    try {
      const response = await fetchPastDeposits({
        agentCode,
        bankCode: useAuthStore.getState().bankCode || '',
        fromDate,
        toDate,
      });
      set({ pastDeposits: response });
      set({ fetchPastDepositsLoadingStatus: Status.Success });
      alertStore.showAlert(
        true,
        'Past deposits fetched successfully.',
        Severity.Success,
      );
    } catch (error) {
      console.error('Failed to fetch past deposits:', error);
      set({ fetchPastDepositsLoadingStatus: Status.Error });
      alertStore.showAlert(
        true,
        'Failed to fetch past deposits. Please try again.',
        Severity.Error,
      );
    }
  },
  setCreateAgentLoadingStatus: (status: Status) =>
    set({ createAgentLoadingStatus: status }),
  setUpdateAgentLoadingStatus: (status: Status) =>
    set({ updateAgentLoadingStatus: status }),
}));
