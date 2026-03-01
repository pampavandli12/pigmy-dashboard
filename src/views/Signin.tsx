import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  CssBaseline,
  Alert,
} from "@mui/material";
import { login } from "../services/login";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../utils/formSchemas";

function Signin() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // better UX
  });
  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    // Handle login logic here
    console.log("Login attempted with:", data);
    try {
      const respose = await login(data);
      console.log("Login successful:", respose);
    } catch (error) {
      console.error("Login failed:", JSON.stringify(error));
      setError("root", {
        type: "manual",
        message: "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 60,
            height: 60,
            backgroundColor: "#1976d2",
            transform: "rotate(45deg)",
            borderRadius: "8px",
            marginBottom: 3,
          }}
        />

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: 1,
            fontSize: { xs: "28px", md: "36px" },
          }}
        >
          Bank Admin Portal
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "#666666",
            marginBottom: 4,
            fontSize: "16px",
          }}
        >
          Securely access your dashboard.
        </Typography>

        {/* Login Form */}
        <Paper
          elevation={1}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 450,
            borderRadius: "12px",
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Bank Code Field */}
            <Box sx={{ marginBottom: 2.5 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  marginBottom: 1,
                }}
              >
                Bank Code
              </Typography>

              <Controller
                name="bankCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Enter bank code"
                    error={!!errors.bankCode}
                    helperText={errors.bankCode?.message}
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Username Field */}
            <Box sx={{ marginBottom: 2.5 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  marginBottom: 1,
                }}
              >
                Username
              </Typography>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    placeholder="Enter your username"
                    {...field}
                    variant="outlined"
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333333",
                  marginBottom: 1,
                }}
              >
                Password
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Enter your password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: "#1976d2",
                color: "#ffffff",
                padding: "12px 0",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                marginBottom: 2,
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Login
            </Button>
            {errors.root && (
              <Alert sx={{ marginBottom: 2 }} severity="warning">
                {errors.root.message}
              </Alert>
            )}

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: "center" }}>
              <Link
                href="#"
                underline="none"
                sx={{
                  color: "#1976d2",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          sx={{
            color: "#999999",
            fontSize: "12px",
            marginTop: 6,
          }}
        >
          © 2024 Bank Corp. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}

export default Signin;
