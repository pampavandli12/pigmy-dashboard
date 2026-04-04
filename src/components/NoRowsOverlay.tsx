import { Typography } from "@mui/material";
import { GridOverlay } from "@mui/x-data-grid";

function NoRowsOverlay({ message }: { message: string }) {
  return (
    <GridOverlay>
      <Typography sx={{ color: "#6b7280", fontSize: 14, fontWeight: 500 }}>
        {message}
      </Typography>
    </GridOverlay>
  );
}

export default NoRowsOverlay;
