import type { AccountFetchResponse, AccountsResponse } from "../types/Accounts";
import type { AgentsResponse } from "../types/sharedEnums";

export const mapAccountsToAgents = (
  accounts: AccountsResponse,
  agents: AgentsResponse,
): AccountFetchResponse => {
  const agentMap: AccountFetchResponse = accounts.map((account) => {
    const agent = agents.find((agent) => agent.agentCode === account.agentCode);
    return {
      ...account,
      agentName: agent ? agent.name : "N/A",
    };
  });
  return agentMap;
};
