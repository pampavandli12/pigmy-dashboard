import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";

function AddAgent() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    password: "aBcD1eFgH2iJkL3",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneratePassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 15; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setFormData((prev) => ({
      ...prev,
      password,
    }));
  };

  const handleCancel = () => {
    // Handle cancel action
    console.log("Cancel clicked");
  };

  const handleCreateAgent = () => {
    // Handle create agent action
    console.log("Create agent with:", formData);
  };

  const navigate = useNavigate();

  return (
    <Container
      maxWidth={false}
      sx={{ width: { xs: "100%", md: "70%" }, mx: "auto", py: 6 }}
    >
      <Box sx={{ width: "100%" }}>
        {/* Back Link */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
            cursor: "pointer",
            color: "#666666",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              color: "#333333",
            },
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            sx={{
              p: 0,
              mr: 1,
              color: "#666666",
              "&:hover": { backgroundColor: "transparent", color: "#333333" },
            }}
            aria-label="back"
          >
            <ArrowBackIcon sx={{ fontSize: "20px" }} /> &nbsp;{" "}
            <Typography sx={{ fontSize: "14px" }}>
              Back to Agent Management
            </Typography>
          </IconButton>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Add New Agent
          </Typography>
          <Typography sx={{ color: "#666666", fontSize: "15px" }}>
            Fill in the details below to create a new agent account.
          </Typography>
        </Box>

        {/* Form Card */}
        <Paper
          elevation={1}
          sx={{
            padding: 4,
            borderRadius: "12px",
          }}
        >
          <Box
            component="form"
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Name Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  mb: 1,
                }}
              >
                Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                }}
              />
            </Box>

            {/* Phone Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  mb: 1,
                }}
              >
                Phone
              </Typography>
              <TextField
                fullWidth
                name="phone"
                placeholder="e.g., 555-123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                }}
              />
            </Box>

            {/* City Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  mb: 1,
                }}
              >
                City
              </Typography>
              <TextField
                fullWidth
                name="city"
                placeholder="e.g., New York"
                value={formData.city}
                onChange={handleInputChange}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  mb: 1,
                }}
              >
                Password
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="medium"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                    },
                  }}
                />
                <Button
                  onClick={handleGeneratePassword}
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: "#333333",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "6px",
                    boxShadow: "none",
                    "&:hover": { backgroundColor: "#e6e6e6" },
                    height: "40px",
                  }}
                >
                  Generate
                </Button>
              </Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#999999",
                  mt: 1,
                }}
              >
                A secure password will be automatically generated.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  color: "#333333",
                  borderColor: "#e0e0e0",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#d0d0d0",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateAgent}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#ffffff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                Create Agent
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddAgent;
