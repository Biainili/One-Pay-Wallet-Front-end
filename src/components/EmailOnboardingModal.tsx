import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailOnboardingModalProps {
  isOpen: boolean;
  onSubmitEmail: (email: string) => void;
}

export const EmailOnboardingModal: React.FC<EmailOnboardingModalProps> = ({
  isOpen,
  onSubmitEmail,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
      setError('Пожалуйста, введите корректный E-mail адрес');
      return;
    }
    setError('');
    onSubmitEmail(emailInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Mail className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center mb-1">Добро пожаловать!</h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          Введите ваш E-mail для безопасности аккаунта и получения уведомления о транзакциях.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">E-mail адрес</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ваш E-mail защищен и не передается третьим лицам</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
          >
            <span>Продолжить</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
