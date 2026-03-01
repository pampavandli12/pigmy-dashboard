import { API_URLS } from "../utils/constants";
import { api } from "./axios";

export const fetchAgents = async () => {
  return api.get(API_URLS.FETCH_AGENTS).then((response) => response.data);
};
