import axios from "axios";
import { API_URLS, appConfig } from "../utils/constants";
import { useAuthStore } from "../store/AuthStore";

export const api = axios.create({
  baseURL: appConfig.apiDomain,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding auth token and logging requests/responses
api.interceptors.request.use(
  (config) => {
    const { token, bankType } = useAuthStore.getState(); // Get auth details from Zustand store

    console.debug("API Request:", config);
    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] = `${token || ""}`;
    // Every API except login is scoped to a bank type; the backend uses this header
    // to select the correct bank-specific behaviour.
    if (config.url !== API_URLS.LOGIN) {
      config.headers["bankType"] = bankType ?? "";
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Interceptor for redirecting on 401 and logging responses/errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const logout = useAuthStore.getState().logout; // Get logout function from Zustand store
    if (error.response && error.response.status === 403) {
      console.warn("Unauthorized! Redirecting to login.");
      logout(); // Clear auth state
      window.location.href = "/signin";
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
