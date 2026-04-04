import { create } from "zustand";
import { fetchUserAccounts, uploadUserAccount } from "../services/account";
import { useAlertStore } from "./AlertStore";
import { Severity, Status } from "../types/sharedEnums";
import type { AccountFetchResponse, AccountsResponse } from "../types/Accounts";
import { mapAccountsToAgents } from "../utils/helpers";
import { useAgentStore } from "./AgentStore";

interface AccountState {
  uploadUserAccountStatus: Status;
  uploadUserAccount: (accountData: FormData) => Promise<void>;
  userAccounts: AccountFetchResponse;
  userAccountsLoadingStatus: Status;
}
type Action = {
  uploadUserAccount: (accountData: FormData) => Promise<void>;
  fetchUserAccounts: () => Promise<void>;
};
export const useAccountStore = create<AccountState & Action>((set) => ({
  uploadUserAccountStatus: Status.Idle,
  userAccounts: [],
  userAccountsLoadingStatus: Status.Idle,

  fetchUserAccounts: async () => {
    const agentLoadingStatus = useAgentStore.getState().fetchAgentLoadingStatus;
    const fetchAgents = useAgentStore.getState().fetchAgents;

    set({ userAccountsLoadingStatus: Status.Loading });

    try {
      if (agentLoadingStatus === Status.Idle) {
        await fetchAgents();
      }
      const accounts = await fetchUserAccounts();
      const agents = useAgentStore.getState().agents;
      set({
        userAccounts: mapAccountsToAgents(accounts, agents),
        userAccountsLoadingStatus: Status.Success,
      });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        "User accounts fetched successfully.",
        Severity.Success,
      );
    } catch (e) {
      set({ userAccountsLoadingStatus: Status.Error });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        "Failed to fetch user accounts. Please try again.",
        Severity.Error,
      );
    }
  },
  uploadUserAccount: async (accountData: any) => {
    const alertStore = useAlertStore.getState();
    set({ uploadUserAccountStatus: Status.Loading });

    try {
      await uploadUserAccount(accountData);
      set({ uploadUserAccountStatus: Status.Success });
      alertStore.showAlert(
        true,
        "Customers are added successfully...",
        Severity.Success,
      );
    } catch (e) {
      set({ uploadUserAccountStatus: Status.Error });
      alertStore.showAlert(
        true,
        "Failed to upload accounts. Please try again.",
        Severity.Error,
      );
    }
  },
}));
