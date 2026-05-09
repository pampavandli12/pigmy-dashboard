import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import {
  getRenderStoreState,
  renderRoute,
  renderRouteNode,
  resetRenderStores,
} from '../renderTestUtils';
import AccountsView from '../../src/views/AccountsView';
import { parseCSVFile } from '../../src/utils/helpers';

vi.mock('../../src/utils/helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/utils/helpers')>();
  return {
    ...actual,
    parseCSVFile: vi.fn(),
  };
});

class FileReaderMock {
  onload: ((event: { target: { result: string } }) => void) | null = null;

  readAsText() {
    this.onload?.({
      target: {
        result: [
          ',77',
          '001,100,,Asha,500,2026-04-27',
          'bad-row',
        ].join('\n'),
      },
    });
  }
}

describe('AccountsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRenderStores();
    vi.stubGlobal('FileReader', FileReaderMock);
    vi.mocked(parseCSVFile).mockResolvedValue([
      { accountNumber: 100, mobilenumber: 9876543210 },
    ]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders customer deposits', () => {
    expect(renderRoute(<AccountsView />)).toContain('Customer Deposits');
  });

  it('handles user and phone number uploads', async () => {
    const storeState = getRenderStoreState();
    const { container, unmount } = renderRouteNode(<AccountsView />);
    const inputs = Array.from(container.querySelectorAll('input[type="file"]'));

    await act(async () => {
      inputs.forEach((input) => {
        Object.defineProperty(input, 'files', {
          value: [new File(['data'], 'accounts.xlsx')],
          configurable: true,
        });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    expect(parseCSVFile).toHaveBeenCalled();
    expect(storeState.accountStore.updateUserAccounts).toHaveBeenCalled();
    expect(storeState.accountStore.uploadUserAccount).toHaveBeenCalled();
    unmount();
  });
});
