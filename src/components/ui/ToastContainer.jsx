import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

export const ToastContainer = () => {
  const toasts = useAppStore((state) => state.toasts);
  const removeToast = useAppStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), toast.duration || 3500)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;

        return (
          <div className={`toast ${toast.type || "info"}`} key={toast.id}>
            <Icon size={16} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
