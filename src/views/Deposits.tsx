import { Box, Button, Typography } from '@mui/material';
import CreateDepositModal from '../components/CreateDepositModal';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAgentStore } from '../store/AgentStore';
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  Toolbar,
  type GridColDef,
} from '@mui/x-data-grid';
import { Status } from '../types/sharedEnums';
import NoRowsOverlay from '../components/NoRowsOverlay';
import type { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Deposits() {
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const params = useParams();
  const fetchPastDeposits = useAgentStore((state) => state.fetchPastDeposits);
  const pastDeposits = useAgentStore((state) => state.pastDeposits);
  const fetchPastDepositsLoadingStatus = useAgentStore(
    (state) => state.fetchPastDepositsLoadingStatus,
  );
  const agents = useAgentStore((state) => state.agents);
  const fetchAgentsLoadingStatus = useAgentStore(
    (state) => state.fetchAgentLoadingStatus,
  );
  const fetchAgents = useAgentStore((state) => state.fetchAgents);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate && params.agentCode) {
      // Implement date-based deposit fetching logic here
      fetchPastDeposits(
        Number(params.agentCode),
        selectedDate.format('YYYY-MM-DD'),
        selectedDate.format('YYYY-MM-DD'),
      );
    }
  }, [selectedDate, params.agentCode, fetchPastDeposits]);
  const loadData = async () => {
    if (fetchAgentsLoadingStatus === Status.Idle) {
      await fetchAgents();
    }
  };
  useEffect(() => {
    loadData();
  }, [loadData]);
  const columns: GridColDef[] = [
    {
      field: 'depositId',
      headerName: 'Deposit ID',
      type: 'number',
      width: 150,
    },
    {
      field: 'agentName',
      headerName: 'Agent Name',
      type: 'string',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'totalDepositedAmount',
      headerName: 'Total Deposited Amount',
      type: 'number',
      width: 150,
    },
    {
      field: 'depositDate',
      headerName: 'Deposit Date',
      type: 'date',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'export',
      headerName: 'Export',
      width: 150,
      renderCell: (params) => (
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            // Implement export functionality here
            console.log('Exporting deposit:', params.row);
          }}
        >
          Export
        </Button>
      ),
    },
  ];

  const isPastDepositsLoading = useMemo(
    () => fetchPastDepositsLoadingStatus === Status.Loading,
    [fetchPastDepositsLoadingStatus],
  );
  const rowData = useMemo(() => {
    const agentName = agents.find(
      (agent) => agent.agentCode === Number(params.agentCode),
    )?.name;
    return pastDeposits.map((deposit) => ({
      ...deposit,
      agentName: agentName || 'Unknown Agent',
    }));
  }, [pastDeposits, agents, params.agentCode]);

  const DepositsToolbar = () => (
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
            onChange={setSelectedDate}
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        {isDepositModalOpen && (
          <CreateDepositModal
            agentCode={params.agentCode as string}
            isOpen={isDepositModalOpen}
            onClose={() => setDepositModalOpen(false)}
          />
        )}
        <Box sx={{ mb: 3 }}>
          <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
            Deposits
          </Typography>
          <Typography sx={{ color: '#999999', fontSize: '14px' }}>
            Create and manage deposits for your agents.
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
            <Button
              variant='contained'
              onClick={() => setDepositModalOpen(true)}
            >
              Create Deposit
            </Button>
          </Box>
          <Box sx={{ width: '100%' }}>
            <DataGrid
              autoHeight
              rows={rowData}
              columns={columns}
              loading={isPastDepositsLoading}
              getRowId={(row) => row.depositId}
              slots={{
                noRowsOverlay: () => (
                  <NoRowsOverlay message='No deposits found for selected date' />
                ),
                noResultsOverlay: () => (
                  <NoRowsOverlay message='No deposits found for selected date' />
                ),
                toolbar: DepositsToolbar,
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
      </Box>
    </LocalizationProvider>
  );
}

export default Deposits;
