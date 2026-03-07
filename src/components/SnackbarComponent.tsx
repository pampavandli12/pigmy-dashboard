import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import type { Severity } from "../types/sharedEnums";

type SnackbarProps = {
  handleClose: () => void;
  message: string;
  severity: Severity;
};
function SnackbarComponent({ handleClose, message, severity }: SnackbarProps) {
  return (
    <Snackbar open autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarComponent;
