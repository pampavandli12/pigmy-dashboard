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

  // Generate data rows in the format shown in the attached file
  const emptySchema = '    ';
  const agentCode = String(depositData.agentCode).padStart(8, '0');
  const totalRowCount = depositData.users.length;
  const totalDepositedAmount = depositData.totalDepositedAmount;
  const agentRow = `${emptySchema},${agentCode},${totalRowCount},${totalDepositedAmount},${depositData.depositedDate},12345678`;
  lines.push(agentRow);
  depositData.users.forEach((user) => {
    // Format: schemeId,accountNumber,collectedAmount,customerName,000000,collectedDate,collectedAmount
    const schemeId = user.schemeId;
    const accountNumber = String(user.accountNumber).padStart(8, '0');
    const collectedAmount = user.collectedAmount;
    const customerName = user.customerName.padEnd(20); // Pad customer name to proper width
    const zeros = '000000'; // 6 zeros
    const collectedDate = user.collectedDate;

    const row = `${schemeId},${accountNumber},${collectedAmount},${customerName},${zeros},${collectedDate},${collectedAmount}`;
    lines.push(row);
  });

  const datContent = lines.join('\n');
  const blob = new Blob([datContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `deposit_${depositData.agentCode}_${new Date().getTime()}.dat`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
