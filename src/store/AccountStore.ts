import { create } from 'zustand';
import {
  fetchUserAccounts,
  updateUserAccounts,
  UpdateUserPhoneNumber,
  uploadUserAccount,
} from '../services/account';
import { useAlertStore } from './AlertStore';
import { Severity, Status } from '../types/sharedEnums';
import type {
  AccountFetchResponse,
  AccountUpdatePayload,
  ParsedPhoneNumberRow,
  UploadUserAccountPayload,
} from '../types/Accounts';
import { mapAccountsToAgents } from '../utils/helpers';
import { useAgentStore } from './AgentStore';
import { useAuthStore } from './AuthStore';

interface AccountState {
  uploadUserAccountStatus: Status;
  uploadUserAccount: (accountData: UploadUserAccountPayload) => Promise<void>;
  userAccounts: AccountFetchResponse;
  userAccountsLoadingStatus: Status;
  userPhoneNumberUpdateStatus: Status;
}
type Action = {
  uploadUserAccount: (accountData: UploadUserAccountPayload) => Promise<void>;
  fetchUserAccounts: () => Promise<void>;
  updateUserAccounts: (accounts: ParsedPhoneNumberRow[]) => Promise<void>;
  updateUserPhoneNumber: (
    updateMobileNumber: string,
    userId: number,
  ) => Promise<void>;
};
export const useAccountStore = create<AccountState & Action>((set) => ({
  uploadUserAccountStatus: Status.Idle,
  userAccounts: [],
  userAccountsLoadingStatus: Status.Idle,
  userPhoneNumberUpdateStatus: Status.Idle,
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
        'User accounts fetched successfully.',
        Severity.Success,
      );
    } catch {
      set({ userAccountsLoadingStatus: Status.Error });
      const alertStore = useAlertStore.getState();
      alertStore.showAlert(
        true,
        'Failed to fetch user accounts. Please try again.',
        Severity.Error,
      );
    }
  },
  uploadUserAccount: async (accountData: UploadUserAccountPayload) => {
    const alertStore = useAlertStore.getState();
    set({ uploadUserAccountStatus: Status.Loading });

    try {
      await uploadUserAccount(accountData);
      set({ uploadUserAccountStatus: Status.Success });
      alertStore.showAlert(
        true,
        'Customers are added successfully...',
        Severity.Success,
      );
    } catch {
      set({ uploadUserAccountStatus: Status.Error });
      alertStore.showAlert(
        true,
        'Failed to upload accounts. Please try again.',
        Severity.Error,
      );
    }
  },
  updateUserAccounts: async (accountData: ParsedPhoneNumberRow[]) => {
    const alertStore = useAlertStore.getState();
    const authStore = useAuthStore.getState();
    set({ userPhoneNumberUpdateStatus: Status.Loading });
    try {
      const payload: AccountUpdatePayload = {
        bankCode: authStore.bankCode || '',
        userDetailsList: accountData,
      };
      await updateUserAccounts(payload);
      set({ userPhoneNumberUpdateStatus: Status.Success });
      alertStore.showAlert(
        true,
        'Accounts updated successfully.',
        Severity.Success,
      );
    } catch {
      alertStore.showAlert(
        true,
        'Failed to update accounts. Please try again.',
        Severity.Error,
      );
      set({ userPhoneNumberUpdateStatus: Status.Error });
    }
    // Here you would typically make an API call to update the accounts with the new phone numbers
  },
  updateUserPhoneNumber: async (updateMobileNumber: string, userId: number) => {
    const alertStore = useAlertStore.getState();
    set({ userAccountsLoadingStatus: Status.Loading });
    try {
      await UpdateUserPhoneNumber(updateMobileNumber, userId);
      await fetchUserAccounts(); // Refresh accounts after updating phone number
      set({ userAccountsLoadingStatus: Status.Success });
      alertStore.showAlert(
        true,
        'Phone number updated successfully.',
        Severity.Success,
      );
    } catch {
      alertStore.showAlert(
        true,
        'Failed to update phone number. Please try again.',
        Severity.Error,
      );
      set({ userAccountsLoadingStatus: Status.Error });
    }
  },
}));
