import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import Agents from '../../src/views/Agents';

describe('Agents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders agents from the store', () => {
    expect(renderRoute(<Agents />)).toContain('Agent One');
  });
});

