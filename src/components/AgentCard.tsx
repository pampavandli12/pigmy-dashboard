import { memo } from 'react';
import { Box, Typography, Button, Card, Avatar, IconButton } from '@mui/material';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import type { Agent } from '../types/sharedEnums';

const agentInitial = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() ?? '';
  const second = parts[1]?.charAt(0).toUpperCase() ?? '';
  return `${first}${second}`;
};

const getStatusColor = (status: string) => {
  if (status === 'active') return '#2e7d32';
  if (status === 'inactive') return '#d32f2f';
  return '#666666';
};

type AgentCardProps = {
  agent: Agent;
  isPasswordVisible: boolean;
  isResettingDevice: boolean;
  onTogglePassword: (agentCode: number) => void;
  onTransactions: (agentCode: number) => void;
  onDeposits: (agentCode: number) => void;
  onEdit: (agentCode: number) => void;
  onResetDevice: (phone: string) => void;
  onDeregister: (agent: Agent) => void;
};

function AgentCard({
  agent,
  isPasswordVisible,
  isResettingDevice,
  onTogglePassword,
  onTransactions,
  onDeposits,
  onEdit,
  onResetDevice,
  onDeregister,
}: AgentCardProps) {
  return (
    <Card elevation={1} sx={{ borderRadius: '12px', padding: 2.5 }}>
      {/* Card Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#B3D9F2',
              color: '#333333',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            {agentInitial(agent.name)}
          </Avatar>
          <Box sx={{ flex: 'auto' }}>
            <Typography
              sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '15px' }}
            >
              {agent.name}
            </Typography>
            <Typography
              sx={{ color: '#1976d2', fontSize: '12px', fontWeight: 600 }}
            >
              AGENT NO: {agent.agentCode}
            </Typography>
            <Typography sx={{ color: '#999999', fontSize: '12px', mt: 0.5 }}>
              {agent.address}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography
                variant='overline'
                sx={{
                  background: '#e6d6d6',
                  padding: '.25rem',
                  color: 'darkmagenta',
                  lineHeight: 1.5,
                }}
              >
                {agent.password
                  ? isPasswordVisible
                    ? agent.password
                    : '••••••'
                  : 'Unavailable'}
              </Typography>
              {agent.password && (
                <IconButton
                  size='small'
                  aria-label={`${
                    isPasswordVisible ? 'Hide' : 'Show'
                  } password for ${agent.name}`}
                  onClick={() => onTogglePassword(agent.agentCode)}
                >
                  {isPasswordVisible ? (
                    <VisibilityOffIcon fontSize='small' />
                  ) : (
                    <VisibilityIcon fontSize='small' />
                  )}
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Status Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 2,
          mb: 2.5,
          pb: 2.5,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              color: '#999999',
              fontWeight: 500,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Mobile Status
          </Typography>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
            Registered
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              color: '#999999',
              fontWeight: 500,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Block Status
          </Typography>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: getStatusColor(agent.status),
            }}
          >
            {agent.status?.toUpperCase() ?? 'UNKNOWN'}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              color: '#999999',
              fontWeight: 500,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Agent Limit
          </Typography>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
            {agent.limitAmount}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <Button
          variant='text'
          startIcon={<SwapCallsIcon />}
          onClick={() => onTransactions(agent.agentCode)}
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1976d2',
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.05)' },
          }}
        >
          Transactions
        </Button>
        <Button
          variant='text'
          onClick={() => onDeposits(agent.agentCode)}
          startIcon={<AttachMoneyIcon />}
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#333333',
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
          }}
        >
          Deposits
        </Button>
        <Button
          variant='text'
          startIcon={<LockResetIcon />}
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#333333',
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
          }}
        >
          Reset PIN
        </Button>
        <Button
          variant='text'
          startIcon={<DeleteIcon />}
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#ff6b6b',
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.05)' },
          }}
          onClick={() => onDeregister(agent)}
        >
          Deregister
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <Button
          variant='outlined'
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onEdit(agent.agentCode)}
        >
          Edit Agent
        </Button>
        <Button
          variant='outlined'
          color='error'
          loading={isResettingDevice}
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onResetDevice(agent.phone)}
        >
          Reset Device
        </Button>
      </Box>
    </Card>
  );
}

export default memo(AgentCard);
