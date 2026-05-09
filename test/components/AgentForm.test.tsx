import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  agent,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
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

  it('renders create form controls and handles cancel actions', () => {
    const { container, unmount } = renderRouteNode(
      <AgentForm callback={vi.fn()} defaultValues={null} />,
    );

    const buttons = Array.from(container.querySelectorAll('button'));

    act(() => {
      buttons.forEach((button) => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });

    expect(container.innerHTML).toContain('Select Type');
    expect(container.innerHTML).toContain('Save');
    unmount();
  });
});
