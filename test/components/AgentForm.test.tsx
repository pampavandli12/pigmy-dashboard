import { beforeEach, describe, expect, it, vi } from 'vitest';
import { agent, renderRoute, resetRenderStores } from '../renderTestUtils';
import AgentForm from '../../src/components/AgentForm';

describe('AgentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the update form with default values', () => {
    expect(
      renderRoute(<AgentForm callback={vi.fn()} defaultValues={agent} isUpdate />),
    ).toContain('Agent Code');
  });
});

