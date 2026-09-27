import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAgentStore } from '../store/AgentStore';
import LoadingComponent from '../components/LoadingComponent';
import { Status, type Agent } from '../types/sharedEnums';
import AlertDialog from '../components/AlertDialog';
import AgentCard from '../components/AgentCard';

function Agents() {
  const navigate = useNavigate();
  const fetchAgents = useAgentStore((state) => state.fetchAgents);
  const agents = useAgentStore((state) => state.agents);
  const fetchAgentLoadingStatus = useAgentStore(
    (state) => state.fetchAgentLoadingStatus,
  );
  const resetDevice = useAgentStore((state) => state.resetDevice);
  const resetDeviceStatus = useAgentStore((state) => state.resetDeviceStatus);
  const [openDeregisterModal, setOpenDeregisterModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    () => new Set(),
  );
  const setSelectedAgent = useAgentStore((state) => state.setSelectedAgent);
  const updateAgent = useAgentStore((state) => state.updateAgent);
  const selectedAgent = useAgentStore((state) => state.selectedAgent);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const addAgent = () => {
    navigate('/agents/addAgent');
  };
  // Stable callbacks so the memoized AgentCard only re-renders when its own props change.
  const handleEditAgent = useCallback(
    (agentCode: number) => navigate(`/agents/editAgent/${agentCode}`),
    [navigate],
  );
  const handleDeviceReset = useCallback(
    (phoneNumber: string) => resetDevice(phoneNumber),
    [resetDevice],
  );
  const loadTransactions = useCallback(
    (agentCode: number) => navigate(`/agents/transactions/${agentCode}`),
    [navigate],
  );
  const loadDeposits = useCallback(
    (agentCode: number) => navigate(`/agents/deposits/${agentCode}`),
    [navigate],
  );
  const togglePasswordVisibility = useCallback((agentCode: number) => {
    setVisiblePasswords((current) => {
      const next = new Set(current);
      if (next.has(agentCode)) next.delete(agentCode);
      else next.add(agentCode);
      return next;
    });
  }, []);
  const deregisterAgent = useCallback(
    (agent: Agent) => {
      setOpenDeregisterModal(true);
      setSelectedAgent(agent);
    },
    [setSelectedAgent],
  );

  // Show loading state while fetching agents
  if (fetchAgentLoadingStatus === Status.Loading) {
    return <LoadingComponent />;
  }
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
          <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
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
        {agents.map((agent) => (
          <AgentCard
            key={agent.agentCode}
            agent={agent}
            isPasswordVisible={visiblePasswords.has(agent.agentCode)}
            isResettingDevice={resetDeviceStatus === Status.Loading}
            onTogglePassword={togglePasswordVisibility}
            onTransactions={loadTransactions}
            onDeposits={loadDeposits}
            onEdit={handleEditAgent}
            onResetDevice={handleDeviceReset}
            onDeregister={deregisterAgent}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Agents;
