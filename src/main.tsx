import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App.tsx";
import AlertProvider from "./providers/AlertProvider.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { theme } from "./theme.ts";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" was not found in the document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ErrorBoundary>
          <BrowserRouter>
            <AlertProvider>
              <App />
            </AlertProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
