import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

type AlertDialogProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  handleConfirm: () => void;
};

function AlertDialog({
  open,
  handleClose,
  title,
  description,
  handleConfirm,
}: AlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const confirmAndClose = async () => {
    setIsLoading(true);
    await handleConfirm();
    setIsLoading(false);
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            No
          </Button>
          <Button onClick={confirmAndClose} autoFocus loading={isLoading}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AlertDialog;
