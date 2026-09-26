import { useAuthStore } from '../store/AuthStore';
import type {
  AccountsResponse,
  AccountUpdatePayload,
  UploadPeocitAccountPayload,
  UploadUserAccountPayload,
} from '../types/Accounts';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

export const uploadBanksoftAccounts = async (
  accountData: UploadUserAccountPayload,
): Promise<unknown> => {
  return api
    .post(API_URLS.UPLOAD_ACCOUNTS.banksoft, accountData)
    .then((response) => response.data);
};
export const uploadPeocitAccounts = async (
  accountData: UploadPeocitAccountPayload,
): Promise<unknown> => {
  return api
    .post(API_URLS.UPLOAD_ACCOUNTS.peocit, accountData)
    .then((response) => response.data);
};
export const fetchUserAccounts = async (): Promise<AccountsResponse> => {
  const bankCode = useAuthStore.getState().bankCode; // Get bankCode from Zustand store
  return api
    .get(`${API_URLS.USER_ACCOUNTS}?bankCode=${bankCode}`)
    .then((response) => response.data);
};
export const updateUserAccounts = async (
  payload: AccountUpdatePayload,
): Promise<unknown> => {
  return api
    .post(API_URLS.UPDATE_PHONE, payload)
    .then((response) => response.data);
};
export const UpdateUserPhoneNumber = async (
  updateMobileNumber: string,
  userId: number,
): Promise<unknown> => {
  const url = `${API_URLS.UPDATE_PHONY_BY_ACCOUNT}?userId=${userId}&mobilenumber=${updateMobileNumber}`;
  return api.patch(url).then((response) => response.data);
};
