import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  agent,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import AgentForm from '../../src/components/AgentForm';

describe('AgentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders and submits the update form with its disabled password', async () => {
    const callback = vi.fn();
    const { container, unmount } = renderRouteNode(
      <AgentForm callback={callback} defaultValues={agent} isUpdate />,
    );
    const password = container.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );

    expect(password?.value).toBe('654321');
    expect(password?.disabled).toBe(true);
    expect(password?.type).toBe('password');

    act(() => {
      container
        .querySelector<HTMLButtonElement>('[aria-label="Show agent password"]')
        ?.click();
    });
    expect(password?.type).toBe('text');

    await act(async () => {
      container.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    });
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ password: '654321' }),
      expect.anything(),
    );
    unmount();
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
    const password = container.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );
    expect(password?.value).toMatch(/^\d{6}$/);
    expect(password?.disabled).toBe(true);
    unmount();
  });

  it('regenerates a six-digit password', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValue(0.5);
    const { container, unmount } = renderRouteNode(
      <AgentForm callback={vi.fn()} defaultValues={null} />,
    );
    const password = container.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );

    expect(password?.value).toBe('100000');
    act(() => {
      Array.from(container.querySelectorAll('button'))
        .find((button) => button.textContent === 'Generate')
        ?.click();
    });
    expect(password?.value).toBe('550000');

    random.mockRestore();
    unmount();
  });
});
