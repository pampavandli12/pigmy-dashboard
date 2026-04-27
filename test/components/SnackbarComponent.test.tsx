import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import SnackbarComponent from '../../src/components/SnackbarComponent';

describe('SnackbarComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the snackbar message', () => {
    expect(
      renderRoute(
        <SnackbarComponent
          handleClose={vi.fn()}
          message='Saved'
          severity='success'
        />,
      ),
    ).toContain('Saved');
  });
});

