import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Top-level boundary so a render error in any view shows a recoverable fallback
 * instead of unmounting the whole app to a blank screen.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            Something went wrong.
          </Typography>
          <Typography color='text.secondary'>
            An unexpected error occurred. Please try reloading the page.
          </Typography>
          <Button variant='contained' onClick={this.handleReload}>
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
