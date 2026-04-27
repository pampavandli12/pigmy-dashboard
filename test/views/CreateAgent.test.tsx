import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import CreateAgent from '../../src/views/CreateAgent';

describe('CreateAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the create agent form', () => {
    expect(renderRoute(<CreateAgent />)).toContain('Add New Agent');
  });
});

