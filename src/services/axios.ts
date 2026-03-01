import axios from "axios";
import { appConfig } from "../utils/constants";

export const api = axios.create({
  baseURL: appConfig.apiDomain,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for adding auth token and logging requests/responses
api.interceptors.request.use(
  (config) => {
    console.debug("API Request:", config);
    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] =
      `Bearer ${localStorage.getItem("token") || ""}`;
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
    if (error.response && error.response.status === 403) {
      console.warn("Unauthorized! Redirecting to login.");
      window.location.href = "/signin";
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
