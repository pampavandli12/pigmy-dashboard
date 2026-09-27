import axios from "axios";
import { API_URLS, appConfig } from "../utils/constants";
import { useAuthStore } from "../store/AuthStore";
import { logger } from "../utils/logger";

// Auth failures that mean the session is no longer valid and the user must re-login.
const AUTH_FAILURE_STATUSES = [401, 403];

export const api = axios.create({
  baseURL: appConfig.apiDomain,
  timeout: appConfig.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: inject the auth token and the per-request bank type.
api.interceptors.request.use(
  (config) => {
    const { token, bankType } = useAuthStore.getState();

    // Log the method/url only — never the full config, which contains the token.
    logger.debug("API Request:", config.method?.toUpperCase(), config.url);

    if (token) {
      config.headers["Authorization"] = token;
    }
    // Every API except login is scoped to a bank type; the backend uses this header
    // to select the correct bank-specific behaviour.
    if (config.url !== API_URLS.LOGIN) {
      config.headers["bankType"] = bankType ?? "";
    }
    return config;
  },
  (error) => {
    logger.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor: on an auth failure, clear state and redirect to sign-in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status && AUTH_FAILURE_STATUSES.includes(status)) {
      logger.warn("Session expired or unauthorized. Redirecting to sign-in.");
      useAuthStore.getState().logout();
      window.location.href = "/signin";
    }
    logger.error("API Error:", error);
    return Promise.reject(error);
  },
);
