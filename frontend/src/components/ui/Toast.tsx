import { createContext, useContext, useCallback, useState } from 'react';
import { clsx } from 'clsx';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={clsx(
              'flex items-start gap-3 p-4 rounded-md border shadow-xl animate-toast-in',
              t.type === 'success'
                ? 'bg-surface-container-high border-tertiary/30'
                : 'bg-surface-container-high border-error/30'
            )}
          >
            {t.type === 'success' ? (
              <CheckCircle size={18} className="text-tertiary shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-error shrink-0 mt-0.5" />
            )}
            <p className="flex-1 text-label-sm text-on-surface leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
