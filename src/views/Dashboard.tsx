import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

function Dashboard() {
  // Sample data for stats
  const stats = [
    { label: "Total Deposits Today", value: "₹12,500" },
    { label: "Total Deposits This Month", value: "₹75,000" },
    { label: "Active Agents", value: "25" },
    { label: "License Purchased", value: "48" },
  ];

  // Sample data for top performing agents
  const agentsData = [
    { name: "Agent 1", collections: "₹15,000" },
    { name: "Agent 2", collections: "₹14,500" },
    { name: "Agent 3", collections: "₹13,000" },
    { name: "Agent 4", collections: "₹12,000" },
    { name: "Agent 5", collections: "₹11,500" },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Title and Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Purchase License
        </Button>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((stat, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              padding: 3,
              borderRadius: 2,
              backgroundColor: "#ffffff",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#666666",
                fontWeight: 500,
                mb: 1,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1a1a1a",
                fontSize: "28px",
              }}
            >
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Top Performing Agents Table */}
      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Top Performing Agents
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#333333",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Agent
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#333333",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  Collections
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agentsData.map((agent, index) => (
                <TableRow
                  key={index}
                  sx={{
                    borderBottom: "1px solid #f0f0f0",
                    "&:hover": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  <TableCell sx={{ color: "#333333", fontWeight: 500 }}>
                    {agent.name}
                  </TableCell>
                  <TableCell sx={{ color: "#1976d2", fontWeight: 600 }}>
                    {agent.collections}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Dashboard;
