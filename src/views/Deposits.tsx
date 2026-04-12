import { Box, Button, Typography } from '@mui/material';
import CreateDepositModal from '../components/CreateDepositModal';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAgentStore } from '../store/AgentStore';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Status } from '../types/sharedEnums';
import NoRowsOverlay from '../components/NoRowsOverlay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  depositFilterSchema,
  type DepositFilterFormValues,
} from '../utils/formSchemas';
import dayjs from 'dayjs';

interface FilterBarProps {
  control: any;
  handleSubmit: any;
  onFilterSubmit: any;
  errors: any;
}

const FilterBar = ({
  control,
  handleSubmit,
  onFilterSubmit,
  errors,
}: FilterBarProps) => (
  <Box
    component='form'
    onSubmit={handleSubmit(onFilterSubmit)}
    sx={{
      display: 'grid',
      gridTemplateColumns: 'auto auto auto',
      gap: 2,
      p: 2,
      mb: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: 1,
      alignItems: 'start',
    }}
  >
    <Controller
      name='fromDate'
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          label='From Date'
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(date?.toISOString() || null)}
          slotProps={{
            textField: {
              size: 'small',
              error: !!errors.fromDate,
              helperText: errors.fromDate?.message,
            },
          }}
        />
      )}
    />

    <Controller
      name='toDate'
      control={control}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          label='To Date'
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(date?.toISOString() || null)}
          slotProps={{
            textField: {
              size: 'small',
              error: !!errors.toDate,
              helperText: errors.toDate?.message,
            },
          }}
        />
      )}
    />

    <Button
      type='submit'
      variant='contained'
      size='small'
      sx={{
        alignSelf: 'start',
        height: '40px',
        textTransform: 'uppercase',
        fontSize: '0.875rem',
      }}
    >
      Search
    </Button>
  </Box>
);

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositFilterFormValues>({
    resolver: zodResolver(depositFilterSchema),
    mode: 'onBlur',
  });

  const onFilterSubmit: SubmitHandler<DepositFilterFormValues> = (data) => {
    if (params.agentCode) {
      const fromDate = dayjs(data.fromDate).format('YYYY-MM-DD');
      const toDate = dayjs(data.toDate).format('YYYY-MM-DD');
      fetchPastDeposits(Number(params.agentCode), fromDate, toDate);
    }
  };

  useEffect(() => {
    if (fetchAgentsLoadingStatus === Status.Idle) {
      fetchAgents();
    }
  }, [fetchAgentsLoadingStatus, fetchAgents]);
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
          <FilterBar
            control={control}
            handleSubmit={handleSubmit}
            onFilterSubmit={onFilterSubmit}
            errors={errors}
          />
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
