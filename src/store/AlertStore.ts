import { create } from "zustand";
import type { Severity } from "../types/sharedEnums";

type State = {
  alert: {
    open: boolean;
    message: string;
    severity: Severity;
  };
};
type Action = {
  showAlert: (open: boolean, message: string, severity: Severity) => void;
};
export const useAlertStore = create<State & Action>((set) => ({
  alert: {
    open: false,
    message: "",
    severity: "success",
  },
  showAlert: (open: boolean, message: string, severity: Severity) => {
    set({
      alert: {
        open,
        message,
        severity,
      },
    });
  },
}));
