import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  MenuItem,
  Typography,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import type { UploadUserAccountPayload } from "../types/Accounts";
import { useAuthStore } from "../store/AuthStore";
import { Status } from "../types/sharedEnums";
import { useAccountStore } from "../store/AccountStore";
import { useAgentStore } from "../store/AgentStore";
import NoRowsOverlay from "../components/NoRowsOverlay";

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

const columns: GridColDef[] = [
  {
    field: "customerName",
    headerName: "Customer Name",
    flex: 1,
    minWidth: 180,
  },
  { field: "accountNumber", headerName: "Account Number", width: 160 },
  {
    field: "currentBalance",
    headerName: "Current Balance",
    width: 150,
  },
  { field: "lastDepositDate", headerName: "Deposit Date", width: 140 },
  { field: "agentName", headerName: "Agent Name", flex: 1, minWidth: 140 },
];

function AccountsView() {
  const [agentFilter, setAgentFilter] = useState<string[]>([]);
  const bankCode = useAuthStore((state) => state.bankCode);
  const uploadUserAccountLoading = useAccountStore(
    (state) => state.uploadUserAccountStatus,
  );
  const uploadUserAccount = useAccountStore((state) => state.uploadUserAccount);
  const fetchUserAccounts = useAccountStore((state) => state.fetchUserAccounts);
  const userAccountsLoadingStatus = useAccountStore(
    (state) => state.userAccountsLoadingStatus,
  );
  const userAccounts = useAccountStore((state) => state.userAccounts);

  const agents = useAgentStore((state) => state.agents);
  useEffect(() => {
    (async () => {
      await fetchUserAccounts();
    })();
  }, [fetchUserAccounts]);

  const handleAgentChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setAgentFilter(
      typeof value === "string" ? value.split(",") : (value as string[]),
    );
  };

  const isUserAccountsLoading = useMemo(
    () => userAccountsLoadingStatus === Status.Loading,
    [userAccountsLoadingStatus],
  );
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !(file instanceof Blob)) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target) return;
      const content = event.target.result;
      if (!content || typeof content !== "string") return;
      const lines = content.split("\n");
      const [agent, ...users] = lines;
      const userList: UploadUserAccountPayload["users"] = [];
      users.forEach((element) => {
        const [
          schemeId,
          accountNumber,
          ,
          customerName,
          currentBalance,
          lastDepositDate,
        ] = element.split(",");
        if (!accountNumber || !customerName) return; // skip invalid lines
        userList.push({
          schemeId,
          accountNumber: Number(accountNumber),
          customerName,
          currentBalance: Number(currentBalance),
          lastDepositDate,
        });
      });
      const [, agentCode] = agent.split(",");
      await uploadUserAccount({
        agentCode: Number(agentCode),
        bankCode: bankCode || "",
        users: userList,
      });
    };
    reader.readAsText(file); // 👈 key
  };
  const isUploading = useMemo(
    () => uploadUserAccountLoading === Status.Loading,
    [uploadUserAccountLoading],
  );

  const filteredAccounts = useMemo(() => {
    return userAccounts.filter((account) =>
      agentFilter.length > 0 ? agentFilter.includes(account.agentName) : true,
    );
  }, [agentFilter, userAccounts]);
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
          loading={isUploading}
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
                  <MenuItem key={a.id} value={a.name}>
                    <Checkbox checked={agentFilter.indexOf(a.name) > -1} />
                    <ListItemText primary={a.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            mt: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <DataGrid
              rows={filteredAccounts}
              columns={columns}
              disableRowSelectionOnClick
              loading={isUserAccountsLoading}
              showToolbar
              paginationMode="client"
              slots={{
                noRowsOverlay: () => (
                  <NoRowsOverlay message="No accounts found. Please upload accounts to view them here." />
                ),
                noResultsOverlay: () => (
                  <NoRowsOverlay message="No accounts match the selected filters." />
                ),
              }}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              getRowId={(row) => row.accountNumber}
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
        </Box>
      </Paper>
    </Box>
  );
}

export default AccountsView;
