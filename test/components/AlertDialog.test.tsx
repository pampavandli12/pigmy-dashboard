import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { renderRoute, renderRouteNode, resetRenderStores } from '../renderTestUtils';
import AlertDialog from '../../src/components/AlertDialog';

describe('AlertDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders an open confirmation dialog', () => {
    expect(
      renderRoute(
        <AlertDialog
          open
          handleClose={vi.fn()}
          handleConfirm={vi.fn()}
          title='Confirm'
          description='Are you sure?'
        />,
      ),
    ).toContain('Confirm');
  });

  it('confirms and closes from dialog actions', async () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();
    const { container, unmount } = renderRouteNode(
      <AlertDialog
        open
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        title='Confirm'
        description='Are you sure?'
      />,
    );

    const yesButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Yes',
    );
    const noButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'No',
    );

    await act(async () => {
      noButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      yesButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleConfirm).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
    unmount();
  });

  it('resets the loading state so a second confirmation on the same instance is not stuck', async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const { container, unmount } = renderRouteNode(
      <AlertDialog
        open
        handleClose={vi.fn()}
        handleConfirm={handleConfirm}
        title='Confirm'
        description='Are you sure?'
      />,
    );

    const getYesButton = () =>
      Array.from(container.querySelectorAll('button')).find(
        (button) => button.textContent === 'Yes',
      );

    await act(async () => {
      getYesButton()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // Simulate the dialog reopening for a different row without remounting.
    await act(async () => {
      getYesButton()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handleConfirm).toHaveBeenCalledTimes(2);
    expect(getYesButton()?.disabled).toBe(false);
    unmount();
  });
});
