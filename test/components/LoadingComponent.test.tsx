import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import LoadingComponent from '../../src/components/LoadingComponent';

describe('LoadingComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders a progress indicator', () => {
    expect(renderRoute(<LoadingComponent />)).toContain('progressbar');
  });
});

