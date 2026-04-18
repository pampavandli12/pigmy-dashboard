import type { AccountFetchResponse, AccountsResponse } from '../types/Accounts';
import type { AgentsResponse } from '../types/sharedEnums';
import type { CreateDepositResponse } from '../types/Agent';

export const mapAccountsToAgents = (
  accounts: AccountsResponse,
  agents: AgentsResponse,
): AccountFetchResponse => {
  const agentMap: AccountFetchResponse = accounts.map((account) => {
    const agent = agents.find((agent) => agent.agentCode === account.agentCode);
    return {
      ...account,
      agentName: agent ? agent.name : 'N/A',
    };
  });
  return agentMap;
};

export const generateDepositDatFile = (
  depositData: CreateDepositResponse,
): void => {
  const lines: string[] = [];
  const formatColumn = (value: string | number, width: number): string =>
    String(value).slice(0, width).padEnd(width, ' ');
  const formatNumberColumn = (value: number, width: number): string =>
    String(value).slice(0, width).padStart(width, ' ');
  const formatZeroPaddedNumberColumn = (value: number, width: number): string =>
    String(value).slice(0, width).padStart(width, '0');

  const agentInformationRow = [
    formatColumn('', 4),
    formatZeroPaddedNumberColumn(depositData.agentCode, 8),
    formatNumberColumn(depositData.users.length, 6),
    formatColumn(depositData.totalDepositedAmount, 16),
    formatZeroPaddedNumberColumn(depositData.agentCode, 6),
    formatColumn(depositData.depositedDate, 8),
    formatColumn('12345678', 8),
  ].join(',');

  lines.push(agentInformationRow);

  depositData.users.forEach((user) => {
    const row = [
      formatColumn(user.schemeId, 4),
      String(user.accountNumber).padStart(8, '0'),
      formatNumberColumn(user.collectedAmount, 6),
      formatColumn(user.customerName, 16),
      formatColumn('000000', 6),
      formatColumn(user.collectedDate, 8),
      formatNumberColumn(user.collectedAmount, 6),
    ].join(',');

    lines.push(row);
  });

  const datContent = lines.join('\n');
  const blob = new Blob([datContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pcrx.dat`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
