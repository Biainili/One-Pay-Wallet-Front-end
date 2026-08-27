import React from 'react';
import { useWallet } from '../context/WalletContext';
import { ShieldCheck, Lock, User, Wallet } from 'lucide-react';

interface HeaderProps {
  onOpenAccount?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAccount }) => {
  const { user, setActiveModal, triggerHaptic } = useWallet();

  return (
    <header className="sticky top-0 z-30 px-4 py-3 glass-panel border-b border-slate-800/80 flex items-center justify-between">
      <button
        onClick={() => {
          triggerHaptic('light');
          if (onOpenAccount) onOpenAccount();
        }}
        className="flex items-center gap-3 text-left group hover:opacity-90 transition-opacity"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] shadow-glow overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-cyan-400 font-bold text-base">
                {user.username ? user.username.charAt(1).toUpperCase() : <User className="w-5 h-5 text-cyan-400" />}
              </div>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
            <ShieldCheck className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-slate-100 text-sm tracking-tight group-hover:text-cyan-400 transition-colors">
              {user.firstName}
            </h1>
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              {user.kycLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium font-mono">{user.username || `@id${user.id}`}</p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {user.passcodeEnabled && (
          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('passcode');
            }}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            title="Заблокировать кошелек"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/60 px-2.5 py-1.5 rounded-xl">
          <Wallet className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">One Pay</span>
        </div>
      </div>
    </header>
  );
};
