import { Box, Button, Typography } from '@mui/material';
import CreateDepositModal from '../components/CreateDepositModal';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Deposits() {
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const params = useParams();
  return (
    <Box sx={{ width: '100%' }}>
      {isDepositModalOpen && (
        <CreateDepositModal
          agentCode={params.agentCode as string}
          isOpen={isDepositModalOpen}
          onClose={() => setDepositModalOpen(false)}
        />
      )}
      <Box sx={{ mb: 3 }}>
        <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
          Deposits
        </Typography>
        <Typography sx={{ color: '#999999', fontSize: '14px' }}>
          Create and manage deposits for your agents.
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant='contained' onClick={() => setDepositModalOpen(true)}>
            Create Deposit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Deposits;
