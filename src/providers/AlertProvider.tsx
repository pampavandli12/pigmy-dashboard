import React from "react";
import SnackbarComponent from "../components/SnackbarComponent";
import { useAlertStore } from "../store/AlertStore";

function AlertProvider({ children }: { children: React.ReactNode }) {
  const open = useAlertStore((state) => state.alert.open);
  const message = useAlertStore((state) => state.alert.message);
  const severity = useAlertStore((state) => state.alert.severity);
  const showAlert = useAlertStore((state) => state.showAlert);
  return (
    <>
      {open && (
        <SnackbarComponent
          handleClose={() => showAlert(false, "", severity)}
          message={message as string}
          severity={severity}
        />
      )}
      {children}
    </>
  );
}

export default AlertProvider;
