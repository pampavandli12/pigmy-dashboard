import { appConfig } from "../utils/constants";

export const fetchAgents = async () => {
  const url = appConfig.apiDomain + "/pigmy/v1/agent";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
};
