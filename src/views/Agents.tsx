import { Box, Typography, Button, Card, Avatar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { fetchAgents } from "../services/agents";

function Agents() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const agentsData = [
    {
      name: "CHANNABASAVA H",
      agentNo: "02",
      address: "S/O Basavanna Gowda Ward no 1...",
      mobileStatus: "Registered",
      blockStatus: "No",
      agentLimit: "₹50,000",
      initials: "C",
      color: "#B3D9F2",
    },
    {
      name: "ANITHA",
      agentNo: "03",
      address: "D/O Venkatarama Ward no 4...",
      mobileStatus: "Registered",
      blockStatus: "Yes",
      agentLimit: "₹75,000",
      initials: "A",
      color: "#B3F2D9",
    },
    {
      name: "SURESH B",
      agentNo: "04",
      address: "S/O Basappa Gowda Ward no 8...",
      mobileStatus: "Unregistered",
      blockStatus: "No",
      agentLimit: "₹25,000",
      initials: "S",
      color: "#F2D9F2",
    },
  ];
  console.log("hi");
  const getStatusColor = (status: string) => {
    if (status === "Yes") return "#ff6b6b";
    if (status === "No") return "#ff6b6b";
    if (status === "Registered") return "#212121";
    if (status === "Unregistered") return "#999999";
    return "#666666";
  };
  const addAgent = () => {
    // Logic to navigate to Add Agent page
    console.log("Navigate to Add Agent page");
    navigate("/agents/addAgent");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Agent List
          </Typography>
          <Typography sx={{ color: "#999999", fontSize: "14px" }}>
            Monitor and manage your agents.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addAgent}
            sx={{
              backgroundColor: "#1976d2",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Add Agent
          </Button>
        </Box>
      </Box>

      {/* Agent Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {agentsData.map((agent, index) => (
          <Card
            key={index}
            elevation={1}
            sx={{
              borderRadius: "12px",
              padding: 2.5,
            }}
          >
            {/* Card Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: agent.color,
                    color: "#333333",
                    fontWeight: 700,
                    fontSize: "20px",
                  }}
                >
                  {agent.initials}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1a1a1a",
                      fontSize: "15px",
                    }}
                  >
                    {agent.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#1976d2",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    AGENT NO: {agent.agentNo}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#999999",
                      fontSize: "12px",
                      mt: 0.5,
                    }}
                  >
                    {agent.address}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Status Row */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 2,
                mb: 2.5,
                pb: 2.5,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#999999",
                    fontWeight: 500,
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Mobile Status
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {agent.mobileStatus}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#999999",
                    fontWeight: 500,
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Block Status
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: getStatusColor(agent.blockStatus),
                  }}
                >
                  {agent.blockStatus}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#999999",
                    fontWeight: 500,
                    mb: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Agent Limit
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {agent.agentLimit}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
              }}
            >
              <Button
                variant="text"
                startIcon={<SwapCallsIcon />}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1976d2",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.05)",
                  },
                }}
              >
                Transactions
              </Button>
              <Button
                variant="text"
                startIcon={<AttachMoneyIcon />}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#333333",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Deposits
              </Button>
              <Button
                variant="text"
                startIcon={<LockResetIcon />}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#333333",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Reset PIN
              </Button>
              <Button
                variant="text"
                startIcon={<DeleteIcon />}
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ff6b6b",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "rgba(255, 107, 107, 0.05)",
                  },
                }}
              >
                Deregister
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Agents;
