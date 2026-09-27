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
  deleteTransaction,
  deviceReset,
  fetchAgentByCode,
  fetchAgents,
  fetchPastDeposits,
  fetchTransactions,
  updateAgent,
} from '../services/agents';
import { useAlertStore } from './AlertStore';
import type {
  PastDeposit,
  TransactionsResponse,
} from '../types/Agent';
import { useAuthStore } from './AuthStore';
import { getBankTypeHandler } from '../bankTypes';
import { extractApiErrorMessage } from '../utils/helpers';

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
  voidTransactionLoadingStatus: Status;
  pastDeposits: PastDeposit[];
  resetDeviceStatus: Status;
};

type Action = {
  fetchAgents: () => Promise<void>;
  fetchTransactions: (agentCode: number, date: string) => Promise<void>;
  createAgent: (payload: AddAgentFormValues) => Promise<void>;
  fetchAgentByCode: (agentCode: string) => Promise<void>;
  setSelectedAgent: (agent: Agent | null) => void;
  updateAgent: (agentCode: string, agentData: Partial<Agent>) => Promise<void>;
  resetDevice: (phoneNumber: string) => Promise<void>;
  setCreateAgentLoadingStatus: (status: Status) => void;
  setUpdateAgentLoadingStatus: (status: Status) => void;

  exportDepositeById: (
    depositeId: number,
    agentCode: number,
    date: string,
    depositedAmount: number,
  ) => Promise<void>;
  createDeposit: (
    formValues: CreateDepositFormValues,
    agentCode: number,
  ) => Promise<void>;
  fetchPastDeposits: (
    agentCode: number,
    fromDate: string,
    toDate: string,
  ) => Promise<void>;
  voidTransaction: (
    transactionId: number,
    agentCode: number,
    date: string,
  ) => Promise<void>;
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
  voidTransactionLoadingStatus: Status.Idle,
  pastDeposits: [],
  resetDeviceStatus: Status.Idle,
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  fetchAgents: async () => {
    set({ fetchAgentLoadingStatus: Status.Loading });
    try {
      const bankCode = useAuthStore.getState().bankCode ?? '';
      const agents = await fetchAgents(bankCode);
      set({ agents, fetchAgentLoadingStatus: Status.Success });
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      set({ fetchAgentLoadingStatus: Status.Error });
      useAlertStore
        .getState()
        .showAlert(true, 'Failed to fetch agents. Please try again.', Severity.Error);
    }
  },
  createAgent: async (payload: AddAgentFormValues) => {
    const showAlert = useAlertStore.getState().showAlert;
    set({ createAgentLoadingStatus: Status.Loading });
    try {
      await createAgent(payload, useAuthStore.getState().bankCode ?? '');
      set({ createAgentLoadingStatus: Status.Success });
      showAlert(true, 'Agent created successfully!!', Severity.Success);
    } catch (error) {
      console.error('Failed to create agent:', error);
      set({ createAgentLoadingStatus: Status.Error });
      showAlert(
        true,
        'Create Agent Failed, Please try again',
        Severity.Error,
      );
    }
  },
  fetchAgentByCode: async (agentCode: string) => {
    set({ fetchAgentByCodeLoadingStatus: Status.Loading });
    try {
      const bankCode = useAuthStore.getState().bankCode ?? '';
      const agent = await fetchAgentByCode(agentCode, bankCode);
      set({
        selectedAgent: agent,
        fetchAgentByCodeLoadingStatus: Status.Success,
      });
    } catch (error) {
      console.error('Failed to fetch agent by code:', error);
      set({ fetchAgentByCodeLoadingStatus: Status.Error });
      useAlertStore
        .getState()
        .showAlert(true, 'Failed to fetch agent. Please try again.', Severity.Error);
    }
  },
  fetchTransactions: async (agentCode: number, date: string) => {
    set({ fetchTransactionsLoadingStatus: Status.Loading, transactions: [] });
    const alertStore = useAlertStore.getState();
    try {
      const bankCode = useAuthStore.getState().bankCode ?? '';
      const transactions = await fetchTransactions(agentCode, date, bankCode);
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
      await updateAgent(
        agentCode,
        agentData,
        useAuthStore.getState().bankCode ?? '',
      );
      set({ updateAgentLoadingStatus: Status.Success });
      showAlert(true, 'Agent updated successfully!', Severity.Success);
    } catch (error) {
      console.error('Failed to update agent:', error);
      set({ updateAgentLoadingStatus: Status.Error });
      showAlert(
        true,
        'Failed to update agent. Please try again.',
        Severity.Error,
      );
    }
  },
  createDeposit: async (
    formValues: CreateDepositFormValues,
    agentCode: number,
  ) => {
    // Implement the logic to create a deposit using the form values
    // You can call an API service here and handle the response accordingly
    set({ createDepositLoadingStatus: Status.Loading });
    const { bankCode, bankType } = useAuthStore.getState();
    const showAlert = useAlertStore.getState().showAlert;
    const agentName =
      useAgentStore
        .getState()
        .agents.find((agent) => agent.agentCode === agentCode)?.name ||
      'Unknown Agent';
    try {
      await getBankTypeHandler(bankType).createDeposit({
        agentCode,
        agentName,
        bankCode: bankCode || '',
        formValues,
      });
      set({ createDepositLoadingStatus: Status.Success });
      showAlert(
        true,
        'Deposit created and file downloaded successfully!',
        Severity.Success,
      );
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      console.error('Failed to create deposit:', errorMessage);
      set({ createDepositLoadingStatus: Status.Error });
      showAlert(true, errorMessage, Severity.Error);
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
    const { bankType, bankCode } = useAuthStore.getState();
    try {
      await getBankTypeHandler(bankType).exportDeposit({
        depositId: depositeId,
        agentCode,
        date,
        depositedAmount,
        bankCode: bankCode ?? '',
      });
      set({ exportDepositLoadingStatus: Status.Success });
      showAlert(true, 'Deposit exported successfully!', Severity.Success);
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      console.error('Failed to export deposit:', errorMessage);
      set({ exportDepositLoadingStatus: Status.Error });
      showAlert(true, errorMessage, Severity.Error);
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
      const response = (await fetchPastDeposits({
        agentCode,
        bankCode: useAuthStore.getState().bankCode || '',
        fromDate,
        toDate,
      })) as PastDeposit[];
      set({
        pastDeposits: response,
        fetchPastDepositsLoadingStatus: Status.Success,
      });
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
  resetDevice: async (phoneNumber: string) => {
    set({ resetDeviceStatus: Status.Loading });
    const alertStore = useAlertStore.getState();
    try {
      await deviceReset(phoneNumber);
      set({ resetDeviceStatus: Status.Success });
      alertStore.showAlert(true, 'Device reset successfully', Severity.Success);
    } catch (error) {
      console.error('Failed to reset device:', error);
      set({ resetDeviceStatus: Status.Error });
      alertStore.showAlert(
        true,
        'Failed to reset device, please try again',
        Severity.Error,
      );
    }
  },
  voidTransaction: async (
    transactionId: number,
    agentCode: number,
    date: string,
  ) => {
    set({ voidTransactionLoadingStatus: Status.Loading });
    const alertStore = useAlertStore.getState();
    try {
      await deleteTransaction(transactionId);
      // Refresh the list inline (via the service) so only the void toast shows,
      // not a second "Transactions fetched successfully" toast.
      const bankCode = useAuthStore.getState().bankCode ?? '';
      const transactions = await fetchTransactions(agentCode, date, bankCode);
      set({ transactions, voidTransactionLoadingStatus: Status.Success });
      alertStore.showAlert(
        true,
        'Transaction voided successfully.',
        Severity.Success,
      );
    } catch (error) {
      console.error('Failed to void transaction:', error);
      set({ voidTransactionLoadingStatus: Status.Error });
      alertStore.showAlert(
        true,
        'Failed to void transaction. Please try again.',
        Severity.Error,
      );
    }
  },
  setCreateAgentLoadingStatus: (status: Status) =>
    set({ createAgentLoadingStatus: status }),
  setUpdateAgentLoadingStatus: (status: Status) =>
    set({ updateAgentLoadingStatus: status }),
}));
