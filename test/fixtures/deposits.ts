import type { CreateDepositResponse } from '../../src/types/Agent';

// Sample deposit response used across tests for .DAT file generation.
export const MOCK_DEPOSIT_RESPONSE: CreateDepositResponse = {
  agentCode: 1,
  bankCode: 'AGT123',
  totalDepositedAmount: 2000,
  depositedDate: '12.04.26',
  users: [
    {
      schemeId: '012d',
      accountNumber: 3,
      collectedAmount: 500,
      customerName: 'Rahul Mehta',
      collectedDate: '12.04.26',
    },
    {
      schemeId: '017d',
      accountNumber: 3,
      collectedAmount: 1500,
      customerName: 'Rahul Mehta',
      collectedDate: '12.04.26',
    },
  ],
};
