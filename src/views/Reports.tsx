import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Paper, Popper, TextField } from '@mui/material';
import { useAuthStore } from '../store/AuthStore';
import { CollectionStatus, SchemeType, Status } from '../types/sharedEnums';
import Button from '@mui/material/Button';
import { useReportStore } from '../store/ReportStore';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import NoRowsOverlay from '../components/NoRowsOverlay';
import type { ReportPayload, ReportReponse } from '../types/Report';

function Reports() {
  const [selectedBankCode, setSelectedBankCode] = React.useState<string>();
  const [agentCode, setAgentCode] = React.useState('ALL');
  const [depositType, setDepositType] = React.useState('ALL');
  const [collectionStatus, setCollectionStatus] = React.useState('ALL');
  const [range, setRange] = React.useState<DateRange | undefined>(() => ({
    from: new Date(),
    to: new Date(),
  }));
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const lastFetchedAgentsBankRef = useRef<string | undefined>(undefined);
  const hasFetchedInitialReportRef = useRef(false);

  const subBranches = useAuthStore((state) => state.subBranches);
  const currentBankCode = useAuthStore((state) => state.bankCode);
  const currentBankName = useAuthStore((state) => state.bankName);
  const currentCity = useAuthStore((state) => state.city);
  const agents = useReportStore((state) => state.agents);
  const agentLoadingStatus = useReportStore(
    (state) => state.agentLoadingStatus,
  );
  const fetchAgents = useReportStore((state) => state.fetchAgents);
  const fetchReportData = useReportStore((state) => state.fetchReportData);
  const reportData = useReportStore((state) => state.reportData);
  const bankCode = selectedBankCode ?? currentBankCode ?? '';

  const branchOptions = useMemo(() => {
    const currentBranch = currentBankCode
      ? [
          {
            bankCode: currentBankCode,
            bankName: currentBankName ?? '',
            city: currentCity ?? '',
          },
        ]
      : [];

    return [...currentBranch, ...subBranches];
  }, [subBranches, currentBankCode, currentBankName, currentCity]);

  const buildReportPayload = useCallback(
    (): ReportPayload => ({
      bankCode,
      agent: agentCode,
      schemeType: depositType,
      collectionStatus,
      from: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
      to: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
    }),
    [agentCode, bankCode, collectionStatus, depositType, range],
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedBankCode(event.target.value);
    setAgentCode('ALL');
  };

  const handleAgentChange = (event: SelectChangeEvent<string>) => {
    setAgentCode(event.target.value);
  };

  const handleApplyFilter = useCallback(async () => {
    await fetchReportData(buildReportPayload());
  }, [buildReportPayload, fetchReportData]);

  useEffect(() => {
    if (bankCode && lastFetchedAgentsBankRef.current !== bankCode) {
      lastFetchedAgentsBankRef.current = bankCode;
      fetchAgents(bankCode);
    }
  }, [bankCode, fetchAgents]);

  const value =
    range?.from && range?.to
      ? `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`
      : '';
  const disabled =
    !bankCode ||
    !agentCode ||
    !depositType ||
    !collectionStatus ||
    !range?.from ||
    !range?.to;

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (!hasFetchedInitialReportRef.current) {
      hasFetchedInitialReportRef.current = true;
      fetchReportData(buildReportPayload());
    }
  }, [buildReportPayload, disabled, fetchReportData]);

  const columns = useMemo<GridColDef<ReportReponse>[]>(
    () => [
      { field: 'customerName', headerName: 'Customer Name', width: 200 },
      { field: 'collectedAmount', headerName: 'Collected Amount', width: 300 },
      { field: 'schemeName', headerName: 'Scheme Name', width: 200 },
      { field: 'status', headerName: 'Status', width: 200 },
      { field: 'agentName', headerName: 'Agent Name', width: 200 },
      { field: 'collectedDate', headerName: 'Collected Date', width: 200 },
    ],
    [],
  );

  const getRowId = useCallback(
    (row: ReportReponse) =>
      [
        row.accountNumber,
        row.collectedDate,
        row.agentName,
        row.collectedAmount,
      ].join('-'),
    [],
  );

  const gridSlots = useMemo(
    () => ({
      noRowsOverlay: () => (
        <NoRowsOverlay message='No transactions found for selected filters' />
      ),
      noResultsOverlay: () => (
        <NoRowsOverlay message='No transactions found for selected filters' />
      ),
    }),
    [],
  );

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <h1>Reports</h1>
      <FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
        <InputLabel id='demo-simple-select-label'>Select Branches</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={bankCode}
          label='Select Branches'
          onChange={handleChange}
        >
          {branchOptions.map((branch) => (
            <MenuItem key={branch.bankCode} value={branch.bankCode}>
              {branch.bankName} - {branch.city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Agent Selection */}
        <FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
          <InputLabel id='demo-simple-select-label'>Select Agent</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={agentCode}
            label='Select Agent'
            onChange={handleAgentChange}
            disabled={agentLoadingStatus === Status.Loading}
          >
            <MenuItem value='ALL'>All Agents</MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Scheme Type Selection */}
        <FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
          <InputLabel id='demo-simple-select-label'>
            Select Scheme Type
          </InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={depositType}
            label='Select Scheme Type'
            onChange={(event) => setDepositType(event.target.value as string)}
          >
            <MenuItem value='ALL'>All Scheme Types</MenuItem>
            {Object.values(SchemeType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Collection Status Selection */}
        <FormControl sx={{ m: 1, minWidth: 200 }} size='small'>
          <InputLabel id='demo-simple-select-label'>
            Select Collection Type
          </InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={collectionStatus}
            label='Select Collection Type'
            onChange={(event) =>
              setCollectionStatus(event.target.value as string)
            }
          >
            <MenuItem value='ALL'>All Collection Types</MenuItem>
            {Object.values(CollectionStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 250 }} size='small'>
          <TextField
            label='Date Range'
            value={value}
            onMouseDown={(e) => {
              e.preventDefault();
              setAnchorEl(e.currentTarget);
            }}
            fullWidth
            size='small'
            InputProps={{
              readOnly: true,
            }}
          />
          <Popper open={Boolean(anchorEl)} anchorEl={anchorEl}>
            <Paper sx={{ p: 2 }}>
              <DayPicker
                mode='range'
                min={1}
                selected={range}
                onSelect={(selected) => {
                  setRange(selected);

                  if (selected?.from && selected?.to) {
                    setAnchorEl(null);
                  }
                }}
                numberOfMonths={2}
              />
            </Paper>
          </Popper>
        </FormControl>
        <Button
          variant='contained'
          onClick={handleApplyFilter}
          disabled={disabled}
        >
          Apply Filter
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
        }}
      >
        <DataGrid
          rows={reportData}
          columns={columns}
          loading={agentLoadingStatus === Status.Loading}
          autoHeight
          autoPageSize
          getRowId={getRowId}
          paginationMode='client'
          slots={gridSlots}
        />
      </Box>
    </Box>
  );
}

export default Reports;
