import { Container } from "@mui/material";
import { useAgentStore } from "../store/AgentStore";
import AgentForm from "../components/AgentForm";
import { Status } from "../types/sharedEnums";
import { useEffect } from "react";
import type { AddAgentFormValues } from "../utils/formSchemas";
import { useNavigate } from "react-router-dom";

export default function CreateAgent() {
  const createAgent = useAgentStore((state) => state.createAgent);

  const setCreateAgentLoadingStatus = useAgentStore(
    (state) => state.setCreateAgentLoadingStatus,
  );
  const navigate = useNavigate();

  useEffect(() => {
    setCreateAgentLoadingStatus(Status.Idle);
  }, [setCreateAgentLoadingStatus]);
  const handleSubmit = async (data: AddAgentFormValues) => {
    try {
      await createAgent(data);
      setTimeout(() => {
        navigate(-1);
      }, 2500);
      // Optionally, you can navigate back to the agent list or show a success message here --- IGNORE ---
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
