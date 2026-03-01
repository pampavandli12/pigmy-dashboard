import axios from "axios";
import { appConfig } from "../utils/constants";

export const api = axios.create({
  baseURL: appConfig.apiDomain,
  headers: {
    "Content-Type": "application/json",
  },
});
