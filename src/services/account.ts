import type {
  AccountsResponse,
  AccountUpdatePayload,
  UploadPeocitAccountPayload,
  UploadUserAccountPayload,
} from '../types/Accounts';
import { API_URLS } from '../utils/constants';
import { api } from './axios';

// `bankCode` is supplied by the calling store, keeping services free of store imports.

export const uploadBanksoftAccounts = async (
  accountData: UploadUserAccountPayload,
): Promise<unknown> => {
  const response = await api.post(API_URLS.UPLOAD_ACCOUNTS.banksoft, accountData);
  return response.data;
};

export const uploadPeocitAccounts = async (
  accountData: UploadPeocitAccountPayload,
): Promise<unknown> => {
  const response = await api.post(API_URLS.UPLOAD_ACCOUNTS.peocit, accountData);
  return response.data;
};

export const fetchUserAccounts = async (
  bankCode: string,
): Promise<AccountsResponse> => {
  const response = await api.get(
    `${API_URLS.USER_ACCOUNTS}?bankCode=${encodeURIComponent(bankCode)}`,
  );
  return response.data;
};

export const updateUserAccounts = async (
  payload: AccountUpdatePayload,
): Promise<unknown> => {
  const response = await api.post(API_URLS.UPDATE_PHONE, payload);
  return response.data;
};

export const updateUserPhoneNumber = async (
  updateMobileNumber: string,
  userId: number,
): Promise<unknown> => {
  const response = await api.patch(
    `${API_URLS.UPDATE_PHONE_BY_ACCOUNT}?userId=${encodeURIComponent(
      userId,
    )}&mobilenumber=${encodeURIComponent(updateMobileNumber)}`,
  );
  return response.data;
};
