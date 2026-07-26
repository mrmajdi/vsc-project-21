import * as React from 'react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number | null;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

type ToastProviderProps = {
  children: React.ReactNode;
  /**
   * Default duration (in ms) for toast to auto-dismiss.
   * Set to null to disable auto-dismiss.
   */
  defaultDuration?: number | null;
};

export const ToastProvider = ({
  children,
  defaultDuration = 5000,
}: ToastProviderProps) => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, ...toast, duration: toast.duration ?? defaultDuration }]);
    },
    [defaultDuration]
  );

  const removeToast = React.useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    []
  );

  // Auto remove toast after duration
  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timeoutIds: NodeJS.Timeout[] = [];
    toasts.forEach((toast) => {
      if (toast.duration === null) return;
      const timeout = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
      timeoutIds.push(timeout);
    });
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [toasts, removeToast]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed z-50 flex flex-col items-center sm:items-end p-4 space-y-4 sm:space-y-3 sm:top-4 sm:right-4">
        <div className="w-full max-w-xs space-y-2">
          {toasts.map((toast) => (
            <div key={toast.id} className="flex w-full items-start justify-between space-x-4">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-md bg-muted/50">
                {toast.variant === 'destructive' && (
                  <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.variant === 'success' && (
                  <svg className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 9.172a1 1 0 00-1.414 1.414l2.586 2.586a1 1 0 001.414 0l4.586-4.586a1 1 0 00-1.414-1.414L10.765 11.03l-1.22-1.22z" clipRule="evenodd" />
                  </svg>
                )}
                {(!toast.variant || toast.variant === 'default') && (
                  <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0v4H5a1 1 0 110-2h2V7a1 1 0 011-1h2a1 1 0 011 1v2h2a1 1 0 110 2h-2v2z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 space-y-1 text-sm">
                <div className="flex w-full items-center justify-between">
                  <h3 className="font-medium">{toast.title}</h3>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="rounded-md p-1 hover:bg-muted/50"
                    aria-label="Dismiss toast"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 4.293a1 1 0 010-1.414