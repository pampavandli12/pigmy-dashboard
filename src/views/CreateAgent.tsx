import { Container } from "@mui/material";
import { useAgentStore } from "../store/AgentStore";
import AgentForm from "../components/AgentForm";
import { Status } from "../types/sharedEnums";
import { useEffect, useRef } from "react";
import type { AddAgentFormValues } from "../utils/formSchemas";
import { useNavigate } from "react-router-dom";

const REDIRECT_DELAY_MS = 2500;

export default function CreateAgent() {
  const createAgent = useAgentStore((state) => state.createAgent);

  const setCreateAgentLoadingStatus = useAgentStore(
    (state) => state.setCreateAgentLoadingStatus,
  );
  const navigate = useNavigate();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCreateAgentLoadingStatus(Status.Idle);
  }, [setCreateAgentLoadingStatus]);

  // Cancel a pending redirect if the component unmounts first.
  useEffect(
    () => () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    },
    [],
  );

  const handleSubmit = async (data: AddAgentFormValues) => {
    try {
      await createAgent(data);
      redirectTimer.current = setTimeout(() => {
        navigate(-1);
      }, REDIRECT_DELAY_MS);
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };
  return (
    <Container>
      <AgentForm callback={handleSubmit} />
    </Container>
  );
}
