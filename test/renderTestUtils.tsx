import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: ({
    rows = [],
    columns = [],
    slots = {},
    loading = false,
  }: {
    rows?: Array<Record<string, unknown>>;
    columns?: Array<{
      field: string;
      headerName?: string;
      valueFormatter?: (value: unknown) => unknown;
      renderCell?: (params: { row: Record<string, unknown> }) => React.ReactNode;
    }>;
    slots?: Record<string, React.ComponentType>;
    loading?: boolean;
  }) => {
    const firstRow = rows[0] || {
      depositId: 1,
      agentCode: 77,
      depositDate: '2026-04-27',
      totalDepositedAmount: 100,
      status: 'C',
    };
    return (
      <div data-loading={loading}>
        {columns.map((column) => (
          <span key={column.field}>
            {column.headerName}
            {String(column.valueFormatter?.(firstRow[column.field] ?? 'C') ?? '')}
            {column.renderCell?.({ row: firstRow })}
          </span>
        ))}
        {slots.noRowsOverlay && React.createElement(slots.noRowsOverlay)}
        {slots.noResultsOverlay && React.createElement(slots.noResultsOverlay)}
        {slots.toolbar && React.createElement(slots.toolbar)}
      </div>
    );
  },
  GridOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  GridToolbarFilterButton: () => <button>Filter</button>,
  GridToolbarQuickFilter: () => <input aria-label='quick filter' />,
  Toolbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }: { label: string }) => <input aria-label={label} />,
}));
vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: class AdapterDayjs {},
}));
vi.mock('@mui/material/Dialog', () => ({
  default: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div>{children}</div> : null,
}));
vi.mock('@mui/material/DialogTitle', () => ({
  default: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));
vi.mock('@mui/material/DialogContent', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@mui/material/DialogContentText', () => ({
  default: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));
vi.mock('@mui/material/DialogActions', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const storeState = vi.hoisted(() => {
  const auth = {
    token: 'token' as string | null,
    bankName: 'Test Bank' as string | null,
    bankCode: 'BANK1' as string | null,
    isHydrated: true,
    setToken: (token: string) => {
      auth.token = token;
    },
    setBankName: (bankName: string) => {
      auth.bankName = bankName;
    },
    setBankCode: (bankCode: string) => {
      auth.bankCode = bankCode;
    },
    setHydrated: () => {
      auth.isHydrated = true;
    },
    logout: () => {
      auth.token = null;
      auth.bankName = null;
      auth.bankCode = null;
    },
  };
  const alert = {
    alert: { open: false, message: '', severity: 'success' },
    showAlert: (open: boolean, message: string, severity: string) => {
      alert.alert = { open, message, severity };
    },
  };
  const agentStore = {
    fetchAgentLoadingStatus: 'Success',
    createAgentLoadingStatus: 'Idle',
    updateAgentLoadingStatus: 'Idle',
    fetchAgentByCodeLoadingStatus: 'Success',
    agents: [] as unknown[],
    selectedAgent: null as unknown,
    transactions: [] as unknown[],
    fetchTransactionsLoadingStatus: 'Success',
    createDepositLoadingStatus: 'Idle',
    fetchPastDepositsLoadingStatus: 'Success',
    exportDepositLoadingStatus: 'Idle',
    pastDeposits: [] as unknown[],
    fetchAgents: vi.fn(),
    fetchTransactions: vi.fn(),
    createAgent: vi.fn(),
    fetchAgentByCode: vi.fn(),
    setSelectedAgent: vi.fn((selectedAgent) => {
      agentStore.selectedAgent = selectedAgent;
    }),
    updateAgent: vi.fn(),
    setCreateAgentLoadingStatus: vi.fn((status) => {
      agentStore.createAgentLoadingStatus = status;
    }),
    setUpdateAgentLoadingStatus: vi.fn((status) => {
      agentStore.updateAgentLoadingStatus = status;
    }),
    exportDepositeById: vi.fn(),
    createDeposit: vi.fn(),
    fetchPastDeposits: vi.fn(),
  };
  const accountStore = {
    uploadUserAccountStatus: 'Idle',
    userAccounts: [] as unknown[],
    userAccountsLoadingStatus: 'Success',
    uploadUserAccount: vi.fn(),
    fetchUserAccounts: vi.fn(),
  };
  return { auth, alert, agentStore, accountStore };
});

export const getRenderStoreState = () => storeState;

vi.mock('../src/store/AuthStore', () => ({
  useAuthStore: Object.assign(
    (selector?: (state: typeof storeState.auth) => unknown) =>
      selector ? selector(storeState.auth) : storeState.auth,
    {
      getState: () => storeState.auth,
      setState: (patch: Partial<typeof storeState.auth>) =>
        Object.assign(storeState.auth, patch),
    },
  ),
}));
vi.mock('../src/store/AlertStore', () => ({
  useAlertStore: Object.assign(
    (selector?: (state: typeof storeState.alert) => unknown) =>
      selector ? selector(storeState.alert) : storeState.alert,
    {
      getState: () => storeState.alert,
      setState: (patch: Partial<typeof storeState.alert>) =>
        Object.assign(storeState.alert, patch),
    },
  ),
}));
vi.mock('../src/store/AgentStore', () => ({
  useAgentStore: Object.assign(
    (selector?: (state: typeof storeState.agentStore) => unknown) =>
      selector ? selector(storeState.agentStore) : storeState.agentStore,
    {
      getState: () => storeState.agentStore,
      setState: (patch: Partial<typeof storeState.agentStore>) =>
        Object.assign(storeState.agentStore, patch),
    },
  ),
}));
vi.mock('../src/store/AccountStore', () => ({
  useAccountStore: Object.assign(
    (selector?: (state: typeof storeState.accountStore) => unknown) =>
      selector ? selector(storeState.accountStore) : storeState.accountStore,
    {
      getState: () => storeState.accountStore,
      setState: (patch: Partial<typeof storeState.accountStore>) =>
        Object.assign(storeState.accountStore, patch),
    },
  ),
}));

export const agent = {
  id: 1,
  name: 'Agent One',
  address: 'Town',
  phone: '9876543210',
  email: 'agent@example.com',
  agentCode: 77,
  bankCode: 'BANK1',
  type: 'agent',
  status: 'active',
  limitAmount: 1000,
  password: 'secret1',
} as const;

export const resetRenderStores = () => {
  storeState.auth.token = 'token';
  storeState.auth.bankName = 'Test Bank';
  storeState.auth.bankCode = 'BANK1';
  storeState.auth.isHydrated = true;
  storeState.alert.alert = { open: false, message: '', severity: 'success' };
  Object.assign(storeState.agentStore, {
    fetchAgentLoadingStatus: 'Success',
    createAgentLoadingStatus: 'Idle',
    updateAgentLoadingStatus: 'Idle',
    fetchAgentByCodeLoadingStatus: 'Success',
    agents: [agent],
    selectedAgent: agent,
    transactions: [
      {
        trasactionId: 1,
        accountNumber: 100,
        customerName: 'Asha',
        collectedAmount: 50,
        status: 'C',
        schemeName: 'Daily',
      },
    ],
    fetchTransactionsLoadingStatus: 'Success',
    createDepositLoadingStatus: 'Idle',
    fetchPastDepositsLoadingStatus: 'Success',
    exportDepositLoadingStatus: 'Idle',
    pastDeposits: [
      {
        depositId: 1,
        agentCode: 77,
        bankCode: 'BANK1',
        depositDate: '2026-04-27',
        totalDepositedAmount: 100,
      },
    ],
  });
  Object.assign(storeState.accountStore, {
    uploadUserAccountStatus: 'Idle',
    userAccountsLoadingStatus: 'Success',
    userAccounts: [
      {
        schemeId: '001',
        userId: 1,
        accountNumber: 100,
        customerName: 'Asha',
        currentBalance: 500,
        lastDepositDate: '2026-04-27',
        agentCode: 77,
        bankCode: 'BANK1',
        agentName: 'Agent One',
      },
    ],
  });
};

export const renderRoute = (
  element: React.ReactElement,
  route = '/',
  path = '/',
) =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={element}>
          <Route index element={<div>Nested child</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
