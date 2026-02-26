import type { LoginPayload } from "../types/sharedEnums";
import { appConfig } from "../utils/constants";

export const login = async (payload: LoginPayload) => {
  const url = appConfig.apiDomain + "/pigmy/v1/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
};
