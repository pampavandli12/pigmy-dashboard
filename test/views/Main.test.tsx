import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import Main from '../../src/views/Main';

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders the bank shell', () => {
    expect(renderRoute(<Main />)).toContain('Test Bank');
  });
});

