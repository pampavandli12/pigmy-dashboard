import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import NoRowsOverlay from '../../src/components/NoRowsOverlay';

describe('NoRowsOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the empty message', () => {
    expect(renderRoute(<NoRowsOverlay message='Nothing here' />)).toContain(
      'Nothing here',
    );
  });
});

