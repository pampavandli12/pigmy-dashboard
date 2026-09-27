import { useEffect, useMemo, useRef } from 'react';
import { useAgentStore } from '../store/AgentStore';
import { useNavigate, useParams } from 'react-router-dom';
import { Status } from '../types/sharedEnums';
import { Container } from '@mui/material';
import AgentForm from '../components/AgentForm';
import type { UpdateAgentFormValues } from '../utils/formSchemas';
import LoadingComponent from '../components/LoadingComponent';

const REDIRECT_DELAY_MS = 2500;

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
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setUpdateAgentLoadingStatus(Status.Idle);
  }, [setUpdateAgentLoadingStatus]);

  // Cancel a pending redirect if the component unmounts first.
  useEffect(
    () => () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    },
    [],
  );

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
  }, [fetchAgentByCode, params.agentCode]);

  // Stable object identity per loaded agent so AgentForm's reset effect fires
  // only when the fetched data actually changes, not on every re-render.
  const defaultValues = useMemo(
    () =>
      ({
        name: agentData?.name,
        address: agentData?.address,
        phone: agentData?.phone,
        email: agentData?.email,
        limitAmount: agentData?.limitAmount,
        type: agentData?.type,
        status: agentData?.status,
        agentCode: agentData?.agentCode,
        password: agentData?.password,
        graceDays: agentData?.graceDays,
      }) as UpdateAgentFormValues,
    [agentData],
  );

  if (fetchAgentByCodeLoadingStatus === Status.Loading) {
    return <LoadingComponent />;
  }
  const handleSubmit = async (data: UpdateAgentFormValues) => {
    try {
      await updateAgent(params.agentCode as string, {
        ...data,
        id: agentData?.id as number,
      });
      redirectTimer.current = setTimeout(() => {
        navigate('/agents');
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };
  return (
    <Container>
      <AgentForm
        defaultValues={defaultValues}
        callback={(data) => handleSubmit(data)}
        isUpdate={true}
      />
    </Container>
  );
}
