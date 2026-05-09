import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import CreateAgent from '../../src/views/CreateAgent';

vi.mock('../../src/components/AgentForm', () => ({
  default: ({ callback }: { callback: (data: unknown) => void }) => {
    callback({
      name: 'Agent One',
      address: 'Town',
      password: 'secret1',
      phone: '9876543210',
      email: 'agent@example.com',
      agentCode: 77,
      type: 'agent',
      status: 'active',
      limitAmount: 1000,
    });
    return <div>Add New Agent</div>;
  },
}));

describe('CreateAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the create agent form', () => {
    expect(renderRoute(<CreateAgent />)).toContain('Add New Agent');

    act(() => {
      vi.runAllTimers();
    });
  });
});
