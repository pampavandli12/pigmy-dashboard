import { useEffect } from 'react';
import { useAgentStore } from '../store/AgentStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Status } from '../types/sharedEnums';
import { Container } from '@mui/material';
import AgentForm from '../components/AgentForm';
import type { AddAgentFormValues } from '../utils/formSchemas';
import LoadingComponent from '../components/LoadingComponent';

export default function UpdateAgents() {
  const updateAgent = useAgentStore((state) => state.updateAgent);

  const fetchAgentByCode = useAgentStore((state) => state.fetchAgentByCode);
  const fetchAgentByCodeLoadingStatus = useAgentStore(
    (state) => state.fetchAgentByCodeLoadingStatus,
  );
  const agentData = useAgentStore((state) => state.selectedAgent);

  const setUpdateAgentLoadingStatus = useAgentStore(
    (state) => state.setUpdateAgentLoadingStatus,
  );
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setUpdateAgentLoadingStatus(Status.Idle);
  }, []);

  useEffect(() => {
    console.log('Selected Agent Data:', agentData);
  }, [agentData]);
  useEffect(() => {
    if (params.agentCode) {
      const fetchData = async () => {
        try {
          await fetchAgentByCode(params.agentCode as string);
        } catch (error) {
          console.error('Failed to fetch agent data:', error);
        }
      };
      fetchData();
    }
  }, [fetchAgentByCode, params.agentCode, updateAgent]);

  if (fetchAgentByCodeLoadingStatus === Status.Loading) {
    return <LoadingComponent />;
  }
  const handleSubmit = async (data: AddAgentFormValues) => {
    console.log('Form Data to be submitted for update:', data);
    try {
      await updateAgent(params.agentCode as string, {
        ...data,
        id: agentData?.id as number,
      });
      setTimeout(() => {
        navigate('/agents');
      }, 2500);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };
  return (
    <Container>
      <AgentForm
        defaultValues={
          {
            name: agentData?.name,
            address: agentData?.address,
            phone: agentData?.phone,
            email: agentData?.email,
            limitAmount: agentData?.limitAmount,
            type: agentData?.type,
            status: agentData?.status,
            agentCode: agentData?.agentCode,
            password: agentData?.password,
          } as AddAgentFormValues
        }
        callback={(data) => handleSubmit(data)}
        isUpdate={true}
      />
    </Container>
  );
}
