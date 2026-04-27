import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import Dashboard from '../../src/views/Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders dashboard content', () => {
    expect(renderRoute(<Dashboard />)).toContain('Top Performing Agents');
  });
});

