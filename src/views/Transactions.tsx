import { Box, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const columns: GridColDef<(typeof rows)[number]>[] = [
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
    width: 150,
  },
  {
    field: "depositAmount",
    headerName: "Deposit Amount",
    type: "number",
    width: 150,
  },
];

const rows = [
  {
    trasactionId: 1,
    accountNumber: 3,
    customerName: "Rahul Mehta",
    depositAmount: 50.0,
  },
  {
    trasactionId: 30001,
    accountNumber: 3,
    customerName: "Rahul Mehta",
    depositAmount: 5000.0,
  },
];

function Transactions() {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Transactions List
        </Typography>
        <Typography sx={{ color: "#999999", fontSize: "14px" }}>
          Monitor and manage user transactions.
        </Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker label="Basic date picker" />
        </DemoContainer>
      </LocalizationProvider>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.trasactionId}
          showToolbar
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default Transactions;
