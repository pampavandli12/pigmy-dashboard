import type { LoginPayload, LoginResponse } from "../types/sharedEnums";
import { API_URLS } from "../utils/constants";
import { api } from "./axios";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return api.post(API_URLS.LOGIN, payload).then((response) => response.data);
};
