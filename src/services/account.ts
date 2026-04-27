import { useAuthStore } from "../store/AuthStore";
import type { AccountsResponse, UploadUserAccountPayload } from "../types/Accounts";
import { API_URLS } from "../utils/constants";
import { api } from "./axios";

export const uploadUserAccount = async (
  accountData: UploadUserAccountPayload,
): Promise<unknown> => {
  return api
    .post(API_URLS.UPLOAD_ACCOUNTS, accountData)
    .then((response) => response.data);
};
export const fetchUserAccounts = async (): Promise<AccountsResponse> => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store
  return api
    .get(`${API_URLS.USER_ACCOUNTS}?bankCode=${bankCode}`)
    .then((response) => response.data);
};
