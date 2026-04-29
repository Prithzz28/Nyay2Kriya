import { useAppStore } from "../store/useAppStore";

export const useToast = () => {
  const addToast = useAppStore((state) => state.addToast);

  return {
    success: (message) => addToast({ type: "success", message }),
    error: (message) => addToast({ type: "error", message }),
    warning: (message) => addToast({ type: "warning", message }),
    info: (message) => addToast({ type: "info", message }),
  };
};
