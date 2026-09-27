import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

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
      <Typography variant='h3' sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography color='text.secondary'>
        The page you are looking for could not be found.
      </Typography>
      <Button variant='contained' onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Box>
  );
}

export default NotFound;
