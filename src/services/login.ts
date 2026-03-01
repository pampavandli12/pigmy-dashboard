import type { LoginPayload } from "../types/sharedEnums";
import { API_URLS } from "../utils/constants";
import { api } from "./axios";

export const login = async (payload: LoginPayload) => {
  return api.post(API_URLS.LOGIN, payload).then((response) => response.data);
};
