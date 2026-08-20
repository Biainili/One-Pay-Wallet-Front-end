import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Settings, Shield, Lock, Globe, MessageSquare, ExternalLink, CheckCircle, HelpCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, setActiveModal, showToast, triggerHaptic } = useWallet();

  const handleCurrencyChange = (curr: 'USD' | 'EUR' | 'RUB' | 'KGS') => {
    triggerHaptic('light');
    showToast(`Основная валюта изменена на ${curr}`, 'info');
  };

  const openSupportBot = () => {
    triggerHaptic('medium');
    const tg = window.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink('https://t.me/onepay_support_bot');
    } else {
      window.open('https://t.me/onepay_support_bot', '_blank');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">Настройки Кошелька</h2>
        </div>
      </div>

      {/* Security Block */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Безопасность
        </h3>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">PIN-код доступа</div>
              <div className="text-[10px] text-slate-400">
                {user.passcodeEnabled ? 'Защита PIN-кодом включена' : 'Защита не установлена'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('passcode');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              user.passcodeEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-cyan-500 text-slate-950 shadow-glow'
            }`}
          >
            {user.passcodeEnabled ? 'Изменить PIN' : 'Включить PIN'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Верификация (KYC)</div>
              <div className="text-[10px] text-slate-400">Уровень: {user.kycLevel} (Лимит $50,000/день)</div>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Подтвержден
          </span>
        </div>
      </div>

      {/* Preferences Block */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Globe className="w-4 h-4" /> Предпочтения
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Основная фиатная валюта:</label>
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
            {(['USD', 'EUR', 'RUB', 'KGS'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`py-2 rounded-xl font-bold border transition-all ${
                  user.preferredCurrency === curr
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support & Community Block */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Поддержка и Инфо
        </h3>

        <button
          onClick={openSupportBot}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:bg-slate-800 text-left transition-all text-xs"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="font-bold text-slate-100">Служба Поддержки 24/7</div>
              <div className="text-[10px] text-slate-400">@onepay_support_bot</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
