import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Copy, Share2, Check, Award, Gift } from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { user, referrals, showToast, triggerHaptic } = useWallet();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.refLink);
    setCopied(true);
    triggerHaptic('success');
    showToast('Реферальная ссылка скопирована!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    triggerHaptic('medium');
    const shareText = `Присоединяйся к One Pay Wallet! Получай кэшбэк и удобные крипто-переводы прямо в Telegram:`;
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(user.refLink)}&text=${encodeURIComponent(shareText)}`;
    
    const tg = window.Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(tgUrl);
    } else {
      window.open(tgUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-fade-in">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 p-5 border border-indigo-500/30 shadow-glow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Gift className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Партнерская Программа</h2>
            <p className="text-xs text-indigo-300">Зарабатывайте до 25% от комиссий рефералов</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-indigo-900/60 font-mono">
          <div className="bg-slate-900/80 p-2.5 rounded-xl text-center border border-indigo-900/40">
            <div className="text-[10px] text-slate-400 font-sans">Приглашено</div>
            <div className="text-base font-bold text-cyan-400">{user.refCount} чел.</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl text-center border border-indigo-900/40">
            <div className="text-[10px] text-slate-400 font-sans">Доход USDT</div>
            <div className="text-base font-bold text-emerald-400">${user.totalRefEarningsUSDT.toFixed(2)}</div>
          </div>
          <div className="bg-slate-900/80 p-2.5 rounded-xl text-center border border-indigo-900/40">
            <div className="text-[10px] text-slate-400 font-sans">Ваш Уровень</div>
            <div className="text-base font-bold text-amber-400">VIP Tier 1</div>
          </div>
        </div>
      </div>

      {/* Ref Link Box */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">Ваша реферальная ссылка:</label>
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
          <span className="truncate flex-1">{user.refLink}</span>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-1 font-sans text-xs font-semibold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Скопировано' : 'Копия'}</span>
          </button>
        </div>

        <button
          onClick={handleShareTelegram}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-glow text-xs flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Поделиться в Telegram</span>
        </button>
      </div>

      {/* Tier Rates Info */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> Ставки Вознаграждений:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">1-й Уровень (Прямые)</span>
            <span className="text-emerald-400 font-bold text-sm">20% комиссии</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">2-й Уровень (Суб-рефералы)</span>
            <span className="text-cyan-400 font-bold text-sm">5% комиссии</span>
          </div>
        </div>
      </div>

      {/* Invited Friends List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-200">Приглашенные Друзья</h3>
          <span className="text-xs text-slate-400 font-mono">{referrals.length} пользователей</span>
        </div>

        <div className="space-y-2">
          {referrals.map((ref) => (
            <div
              key={ref.id}
              className="flex items-center justify-between p-3 rounded-2xl glass-card border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
                  {ref.username.charAt(1).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{ref.username}</div>
                  <div className="text-[10px] text-slate-400">Регистрация: {ref.joinedAt}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-emerald-400">+${ref.earnedUSDT.toFixed(2)} USDT</div>
                <div className="text-[10px] text-slate-400">Tier {ref.tier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
