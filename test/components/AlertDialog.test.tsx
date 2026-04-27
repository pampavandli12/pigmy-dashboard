import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
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
});

