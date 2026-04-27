import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute, resetRenderStores } from '../renderTestUtils';
import SideDrawer from '../../src/components/SideDrawer';

describe('SideDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
  });

  it('renders expanded and collapsed navigation states', () => {
    expect(renderRoute(<SideDrawer drawerExpanded />)).toContain('Dashboard');
    expect(renderRoute(<SideDrawer drawerExpanded={false} />)).toContain(
      'title="Accounts"',
    );
  });
});

