import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  Toolbar,
  type GridColDef,
} from '@mui/x-data-grid';
import type { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AlertDialog from '../components/AlertDialog';
import { useAgentStore } from '../store/AgentStore';
import { Status, TransactionStatus } from '../types/sharedEnums';
import { useParams } from 'react-router-dom';
import NoRowsOverlay from '../components/NoRowsOverlay';

type TransactionRow = {
  trasactionId: number;
  accountNumber: number;
  customerName: string;
  status: keyof typeof TransactionStatus;
  collectedAmount: number;
};

type TransactionsToolbarProps = {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
};

// Typed so the props passed via `slotProps.toolbar` are checked.
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    selectedDate: Dayjs | null;
    onDateChange: (date: Dayjs | null) => void;
  }
}

// Defined at module scope so the toolbar keeps a stable component identity and
// is not remounted (losing quick-filter focus) on every parent re-render.
function TransactionsToolbar({
  selectedDate,
  onDateChange,
}: TransactionsToolbarProps) {
  return (
    <Toolbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          p: 2,
          flexWrap: 'wrap',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <GridToolbarFilterButton />
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          <GridToolbarQuickFilter />
          <DatePicker
            label='Filter by date'
            value={selectedDate}
            onChange={onDateChange}
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
          />
        </Box>
      </Box>
    </Toolbar>
  );
}

const NoTransactionsOverlay = () => (
  <NoRowsOverlay message='No transactions found for selected date' />
);

const gridSlots = {
  toolbar: TransactionsToolbar,
  noRowsOverlay: NoTransactionsOverlay,
  noResultsOverlay: NoTransactionsOverlay,
};

function Transactions() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [openVoidModal, setOpenVoidModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    number | null
  >(null);
  const transactions = useAgentStore((state) => state.transactions);
  const transactionsLoadingStatus = useAgentStore(
    (state) => state.fetchTransactionsLoadingStatus,
  );
  const voidTransactionLoadingStatus = useAgentStore(
    (state) => state.voidTransactionLoadingStatus,
  );
  const fetchTransactions = useAgentStore((state) => state.fetchTransactions);
  const voidTransaction = useAgentStore((state) => state.voidTransaction);
  const params = useParams();

  useEffect(() => {
    if (selectedDate && params.agentCode) {
      fetchTransactions(
        params.agentCode as unknown as number,
        selectedDate.format('YYYY-MM-DD'),
      );
    }
  }, [selectedDate, fetchTransactions, params.agentCode]);

  const isTransactionLoading = useMemo(
    () => transactionsLoadingStatus === Status.Loading,
    [transactionsLoadingStatus],
  );

  const isVoidingTransaction = useMemo(
    () => voidTransactionLoadingStatus === Status.Loading,
    [voidTransactionLoadingStatus],
  );

  const handleVoidClick = useCallback((transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setOpenVoidModal(true);
  }, []);

  const handleCloseVoidModal = useCallback(() => {
    if (isVoidingTransaction) return;
    setOpenVoidModal(false);
    setSelectedTransactionId(null);
  }, [isVoidingTransaction]);

  const handleConfirmVoid = useCallback(async () => {
    if (!selectedTransactionId || !selectedDate || !params.agentCode) return;

    await voidTransaction(
      selectedTransactionId,
      Number(params.agentCode),
      selectedDate.format('YYYY-MM-DD'),
    );
    setOpenVoidModal(false);
    setSelectedTransactionId(null);
  }, [
    params.agentCode,
    selectedDate,
    selectedTransactionId,
    voidTransaction,
  ]);

  const columns = useMemo<GridColDef<TransactionRow>[]>(
    () => [
      {
        field: 'trasactionId',
        headerName: 'Transaction ID',
        type: 'number',
        width: 150,
      },
      {
        field: 'accountNumber',
        headerName: 'Account Number',
        type: 'number',
        width: 150,
      },
      {
        field: 'customerName',
        headerName: 'Customer Name',
        type: 'string',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        width: 120,
        valueFormatter: (params) => {
          return TransactionStatus[params] || params;
        },
      },
      {
        field: 'collectedAmount',
        headerName: 'Collected Amount',
        type: 'number',
        width: 150,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button
            size='small'
            color='warning'
            variant='outlined'
            onClick={() => handleVoidClick(params.row.trasactionId)}
          >
            Void
          </Button>
        ),
      },
    ],
    [handleVoidClick],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <AlertDialog
        open={openVoidModal}
        handleClose={handleCloseVoidModal}
        handleConfirm={handleConfirmVoid}
        title='Void transaction?'
        description='This action will permanently void the selected transaction. Do you want to continue?'
      />
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
          Transactions List
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
          Monitor and manage user transactions.
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          autoHeight
          rows={transactions as unknown as TransactionRow[]}
          columns={columns}
          loading={isTransactionLoading || isVoidingTransaction}
          getRowId={(row) => row.trasactionId}
          slots={gridSlots}
          slotProps={{
            toolbar: {
              selectedDate,
              onDateChange: setSelectedDate,
            },
          }}
          showToolbar
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection={false}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default Transactions;
