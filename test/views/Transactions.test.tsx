import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRenderStoreState,
  renderRoute,
  resetRenderStores,
} from '../renderTestUtils';
import Transactions from '../../src/views/Transactions';

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders transactions for an agent route', () => {
    expect(
      renderRoute(
        <Transactions />,
        '/agents/transactions/77',
        '/agents/transactions/:agentCode',
      ),
    ).toContain('Transactions List');
  });

  it('renders a void action for each transaction row', () => {
    const { agentStore } = getRenderStoreState();
    agentStore.transactions = [
      {
        trasactionId: 1830001,
        accountNumber: 100,
        customerName: 'Asha',
        collectedAmount: 50,
        status: 'C',
        schemeName: 'Daily',
      },
    ];

    const html = renderRoute(
      <Transactions />,
      '/agents/transactions/77',
      '/agents/transactions/:agentCode',
    );

    expect(html).toContain('Void');
  });
});

