import { CircularProgress, Container } from "@mui/material";

function LoadingComponent() {
  return (
    <Container
      sx={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        mt: 4,
      }}
    >
      <CircularProgress />
    </Container>
  );
}

export default LoadingComponent;
