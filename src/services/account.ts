import { useAuthStore } from '../store/AuthStore';
import type {
  AccountsResponse,
  AccountUpdatePayload,
  UploadUserAccountPayload,
} from '../types/Accounts';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

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
  const url = `${API_URLS.UPDATE_PHONY_BY_ACCOUNT}?userId=${userId}&updateMobileNumber=${updateMobileNumber}`;
  return api.patch(url).then((response) => response.data);
};
