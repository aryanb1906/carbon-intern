import { useState, useCallback } from "react";
import type { ToastItem, ToastType } from "../components/ui/Toast";

let counter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = String(++counter);
    setToasts(prev => [...prev, { id, type, title, message }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (title: string, message?: string) => addToast("success", title, message),
    error:   (title: string, message?: string) => addToast("error",   title, message),
    warning: (title: string, message?: string) => addToast("warning", title, message),
    info:    (title: string, message?: string) => addToast("info",    title, message),
  };

  return { toasts, removeToast, toast };
}
