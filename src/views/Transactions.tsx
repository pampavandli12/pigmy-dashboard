import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  Toolbar,
  type GridColDef,
} from "@mui/x-data-grid";
import type { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAgentStore } from "../store/AgentStore";
import { Status, TransactionStatus } from "../types/sharedEnums";
import { useParams } from "react-router-dom";
import NoRowsOverlay from "../components/NoRowsOverlay";

type TransactionRow = {
  trasactionId: number;
  accountNumber: number;
  customerName: string;
  status: keyof typeof TransactionStatus;
  collectedAmount: number;
};

const columns: GridColDef<TransactionRow>[] = [
  {
    field: "trasactionId",
    headerName: "Transaction ID",
    type: "number",
    width: 150,
  },
  {
    field: "accountNumber",
    headerName: "Account Number",
    type: "number",
    width: 150,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    type: "string",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    type: "string",
    width: 120,
    valueFormatter: (params) => {
      return TransactionStatus[params] || params;
    },
  },
  {
    field: "collectedAmount",
    headerName: "Collected Amount",
    type: "number",
    width: 150,
  },
];

function Transactions() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const transactions = useAgentStore((state) => state.transactions);
  const transactionsLoadingStatus = useAgentStore(
    (state) => state.fetchTransactionsLoadingStatus,
  );
  const fetchTransactions = useAgentStore((state) => state.fetchTransactions);
  const params = useParams();

  useEffect(() => {
    if (selectedDate && params.agentCode) {
      console.log(
        "Fetch transactions for date:",
        selectedDate.format("YYYY-MM-DD"),
      );
      fetchTransactions(
        params.agentCode as unknown as number,
        selectedDate.format("YYYY-MM-DD"),
      );
    }
  }, [selectedDate, fetchTransactions, params.agentCode]);

  const isTransactionLoading = useMemo(
    () => transactionsLoadingStatus === Status.Loading,
    [transactionsLoadingStatus],
  );

  const TransactionsToolbar = () => (
    <Toolbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          flexWrap: "wrap",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <GridToolbarFilterButton />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <GridToolbarQuickFilter />
          <DatePicker
            label="Filter by date"
            value={selectedDate}
            onChange={setSelectedDate}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
        </Box>
      </Box>
    </Toolbar>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Transactions List
          </Typography>
          <Typography sx={{ color: "#999999", fontSize: "14px" }}>
            Monitor and manage user transactions.
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <DataGrid
            autoHeight
            rows={transactions}
            columns={columns}
            loading={isTransactionLoading}
            getRowId={(row) => row.trasactionId}
            slots={{
              noRowsOverlay: () => (
                <NoRowsOverlay message="No tracsactions found for selected date" />
              ),
              noResultsOverlay: () => (
                <NoRowsOverlay message="No tracsactions found for selected date" />
              ),
              toolbar: TransactionsToolbar,
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
    </LocalizationProvider>
  );
}

export default Transactions;
