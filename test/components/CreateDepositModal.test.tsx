import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import CreateDepositModal from '../../src/components/CreateDepositModal';

describe('CreateDepositModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders an open deposit modal', () => {
    expect(
      renderRoute(<CreateDepositModal isOpen onClose={vi.fn()} agentCode='77' />),
    ).toContain('Create Deposit');
  });
});

