import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import Deposits from '../../src/views/Deposits';

describe('Deposits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders deposits for an agent route', () => {
    expect(
      renderRoute(<Deposits />, '/agents/deposits/77', '/agents/deposits/:agentCode'),
    ).toContain('Deposits');
  });
});

