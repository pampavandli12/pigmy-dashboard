import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import Reports from '../../src/views/Reports';

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders reports', () => {
    expect(renderRoute(<Reports />)).toContain('Reports');
  });
});

