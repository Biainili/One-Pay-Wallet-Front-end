import React from 'react';
import { useWallet } from '../context/WalletContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts } = useWallet();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 space-y-2 w-11/12 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 p-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md animate-bounce-short pointer-events-auto ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-400 shadow-emerald-950/50'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-red-500/50 text-red-400 shadow-red-950/50'
              : 'bg-slate-900/95 border-cyan-500/50 text-cyan-400 shadow-cyan-950/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          )}
          <span className="text-slate-100">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
