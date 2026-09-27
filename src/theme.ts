import { createTheme } from '@mui/material/styles';

// Central theme so views/components can use theme tokens instead of hardcoded hex.
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  },
});
