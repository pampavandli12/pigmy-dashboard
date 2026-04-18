import { Box, Typography, Button, Card, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAgentStore } from '../store/AgentStore';
import LoadingComponent from '../components/LoadingComponent';
import { Status, type Agent } from '../types/sharedEnums';
import AlertDialog from '../components/AlertDialog';

function Agents() {
  const navigate = useNavigate();
  const fetchAgents = useAgentStore((state) => state.fetchAgents);
  const agents = useAgentStore((state) => state.agents);
  const fetchAgentLoadingStatus = useAgentStore(
    (state) => state.fetchAgentLoadingStatus,
  );
  const [openDeregisterModal, setOpenDeregisterModal] = useState(false);
  const setSelectedAgent = useAgentStore((state) => state.setSelectedAgent);
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const selectedAgent = useAgentStore((state) => state.selectedAgent);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);
  const agentInitial = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  };
  const addAgent = () => {
    // Logic to navigate to Add Agent page
    console.log('Navigate to Add Agent page');
    navigate('/agents/addAgent');
  };
  const getStatusColor = (status: string) => {
    if (status === 'active') return '#ff6b6b';
    if (status === 'inactive') return '#ff6b6b';
    return '#666666';
  };
  const handleEditAgent = async (agentCode: number) => {
    console.log('Navigate to Edit Agent page for agent code:', agentCode);
    navigate(`/agents/editAgent/${agentCode}`);
  };

  const loadTransactions = (agentCode: number) => {
    console.log('redirect to transactions page');
    navigate(`/agents/transactions/${agentCode}`);
  };

  // Show loading state while fetching agents
  if (fetchAgentLoadingStatus === Status.Loading) {
    return <LoadingComponent />;
  }
  const deregisterAgent = (agent: Agent) => {
    setOpenDeregisterModal(true);
    setSelectedAgent(agent);
  };
  const handleAgentDeregister = async (isDeregister: boolean) => {
    if (!isDeregister || !selectedAgent) return;
    // call update agent api with block status as yes

    const updatedAgent: Agent = {
      ...selectedAgent,
      status: 'inactive',
    };

    await updateAgent(String(selectedAgent.agentCode), updatedAgent);
    setOpenDeregisterModal(false);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <AlertDialog
        open={openDeregisterModal}
        handleClose={() => setOpenDeregisterModal(false)}
        handleConfirm={() => handleAgentDeregister(true)}
        title={'Do you want to deregister this agent?'}
        description={
          'Deregistering an agent will block them from performing any transactions and from using agent mobile application.'
        }
      />
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 700, mb: 0.5 }}>
            Agent List
          </Typography>
          <Typography sx={{ color: '#999999', fontSize: '14px' }}>
            Monitor and manage your agents.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={addAgent}
            sx={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
              '&:hover': {
                backgroundColor: '#1565c0',
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
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {agents.map((agent, index) => (
          <Card
            key={index}
            elevation={1}
            sx={{
              borderRadius: '12px',
              padding: 2.5,
            }}
          >
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
                    sx={{
                      fontWeight: 700,
                      color: '#1a1a1a',
                      fontSize: '15px',
                    }}
                  >
                    {agent.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#1976d2',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    AGENT NO: {agent.agentCode}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#999999',
                      fontSize: '12px',
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
                  {agent.status.toUpperCase()}
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
              }}
            >
              <Button
                variant='text'
                startIcon={<SwapCallsIcon />}
                onClick={() => loadTransactions(agent.agentCode)}
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1976d2',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                  },
                }}
              >
                Transactions
              </Button>
              <Button
                variant='text'
                onClick={() => navigate(`/agents/deposits/${agent.agentCode}`)}
                startIcon={<AttachMoneyIcon />}
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#333333',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
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
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
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
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.05)',
                  },
                }}
                onClick={() => deregisterAgent(agent)}
              >
                Deregister
              </Button>
            </Box>
            <Button
              variant='outlined'
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => handleEditAgent(agent.agentCode)}
            >
              Edit Agent
            </Button>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Agents;
