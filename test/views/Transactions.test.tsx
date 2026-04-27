import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
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
});

