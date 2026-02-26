import { useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type Row = {
  id: number;
  customerName: string;
  accountNumber: string;
  depositAmount: number;
  depositDate: string; // ISO
  agent: string;
};

const sampleRows: Row[] = [
  {
    id: 1,
    customerName: "Sophia Clark",
    accountNumber: "1234567890",
    depositAmount: 5000,
    depositDate: "2024-01-15",
    agent: "Ethan Miller",
  },
  {
    id: 2,
    customerName: "Liam Harris",
    accountNumber: "9876543210",
    depositAmount: 2500,
    depositDate: "2024-01-16",
    agent: "Olivia Davis",
  },
  {
    id: 3,
    customerName: "Emma Wilson",
    accountNumber: "1122334455",
    depositAmount: 7500,
    depositDate: "2024-01-17",
    agent: "Noah Brown",
  },
  {
    id: 4,
    customerName: "Oliver Taylor",
    accountNumber: "5566778899",
    depositAmount: 1000,
    depositDate: "2024-01-18",
    agent: "Isabella Green",
  },
  {
    id: 5,
    customerName: "Ava Martinez",
    accountNumber: "9988776655",
    depositAmount: 3000,
    depositDate: "2024-01-19",
    agent: "Mason White",
  },
  {
    id: 6,
    customerName: "William Anderson",
    accountNumber: "4433221100",
    depositAmount: 6000,
    depositDate: "2024-01-20",
    agent: "Charlotte Black",
  },
  {
    id: 7,
    customerName: "Mia Thompson",
    accountNumber: "1029384756",
    depositAmount: 4500,
    depositDate: "2024-01-21",
    agent: "Amelia Blue",
  },
  {
    id: 8,
    customerName: "James Garcia",
    accountNumber: "6547382910",
    depositAmount: 8000,
    depositDate: "2024-01-22",
    agent: "Harper Red",
  },
];

const columns: GridColDef[] = [
  {
    field: "customerName",
    headerName: "Customer Name",
    flex: 1,
    minWidth: 180,
  },
  { field: "accountNumber", headerName: "Account Number", width: 160 },
  {
    field: "depositAmount",
    headerName: "Deposit Amount",
    width: 150,
    valueFormatter: (params) => {
      const value = (params as { value?: number }).value as number | undefined;
      if (value == null) return "";
      // format with rupee symbol
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(value);
    },
  },
  { field: "depositDate", headerName: "Deposit Date", width: 140 },
  { field: "agent", headerName: "Agent", flex: 1, minWidth: 140 },
];

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    const lines = content.split("\n");
    const [agent, ...users] = lines;
    const userList = [];
    users.forEach((element) => {
      const [
        accountNumber,
        _,
        customerName,
        currentBalance,
        lastDepositDate,
        ...rest
      ] = element.split(",");
      userList.push({
        accountNumber,
        customerName,
        currentBalance,
        lastDepositDate,
      });
    });
    const [agentCode, ..._] = agent.split(",");
    console.log({ agentCode, users: userList });
  };
  reader.readAsText(file); // 👈 key
};
function AccountsView() {
  const [rows] = useState<Row[]>(sampleRows);
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState<string[]>([]);

  const agents = useMemo(() => {
    const set = new Set(rows.map((r) => r.agent));
    return ["All", ...Array.from(set)];
  }, [rows]);

  const handleAgentChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setAgentFilter(
      typeof value === "string" ? value.split(",") : (value as string[])
    );
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (agentFilter.length > 0 && !agentFilter.includes(r.agent))
        return false;
      if (s) {
        return (
          r.customerName.toLowerCase().includes(s) ||
          r.accountNumber.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [rows, search, agentFilter]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, mt: 1 }}>
            Customer Deposits
          </Typography>
          <Typography sx={{ color: "#6b7280", mb: 2 }}>
            View, search, and manage all customer deposits.
          </Typography>
        </Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload users
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileUpload}
            multiple
          />
        </Button>
      </Box>

      <Paper
        elevation={1}
        sx={{ p: 3, borderRadius: 2, mb: 3, backgroundColor: "#ffffff" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search by customer name or account number..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 220,
              "& .MuiOutlinedInput-root": { height: 44, borderRadius: 2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{ display: "flex", gap: 1, ml: "auto", alignItems: "center" }}
          >
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel id="agent-filter-label">Agent</InputLabel>
              <Select
                labelId="agent-filter-label"
                multiple
                value={agentFilter}
                onChange={handleAgentChange}
                renderValue={(selected) => (selected as string[]).join(", ")}
                label="Agent"
                sx={{ textTransform: "none" }}
              >
                {agents.map((a) => (
                  <MenuItem key={a} value={a}>
                    <Checkbox checked={agentFilter.indexOf(a) > -1} />
                    <ListItemText primary={a} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            height: 520,
            width: "100%",
            mt: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={filtered}
              columns={columns}
              disableRowSelectionOnClick
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f6f7f8",
                  color: "#6b7280",
                  fontWeight: 700,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                },
                "& .MuiDataGrid-columnSeparator": { display: "none" },
                "& .MuiDataGrid-row": { borderBottom: "1px solid #f1f3f5" },
                "& .MuiDataGrid-cell": { py: 1.5 },
              }}
            />
          </Box>

          {/* Pagination removed per design — table shows all filtered rows */}
        </Box>
      </Paper>
    </Box>
  );
}

export default AccountsView;
