import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import AgentView from '../../src/views/AgentView';

describe('AgentView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders nested agent routes', () => {
    expect(renderRoute(<AgentView />)).toContain('Nested child');
  });
});

