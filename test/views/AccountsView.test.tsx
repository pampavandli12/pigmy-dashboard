import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import AccountsView from '../../src/views/AccountsView';

describe('AccountsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders customer deposits', () => {
    expect(renderRoute(<AccountsView />)).toContain('Customer Deposits');
  });
});

