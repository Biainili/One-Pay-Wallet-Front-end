import React, { useState } from 'react';
import { ChevronLeft, Link2, QrCode, Users, Check } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface ReferralViewProps {
  onBack: () => void;
}

export const ReferralView: React.FC<ReferralViewProps> = ({ onBack }) => {
  const { user, triggerHaptic, showToast } = useWallet();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const referralLink = `https://t.me/onepay_wallet_bot?start=ref_${user.id || '101'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(referralLink)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    triggerHaptic('success');
    showToast('Реферальная ссылка скопирована!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 flex flex-col justify-between font-sans animate-fadeIn">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wide">Рефералы</h1>
          <div className="w-10" />
        </div>

        {/* Orbit Graphic Banner with Mascot in Center */}
        <div className="relative flex justify-center items-center py-8 my-2">
          {/* Orbit Rings */}
          <div className="absolute w-64 h-64 border border-blue-500/20 rounded-full animate-spin-slow" />
          <div className="absolute w-44 h-44 border border-cyan-400/30 rounded-full" />

          {/* Central Elephant Mascot Avatar */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-2xl shadow-cyan-500/40">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Mascot"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Small Orbiting Avatars */}
          <div className="absolute top-4 right-16 w-8 h-8 rounded-full border-2 border-cyan-400 bg-slate-800 overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop" alt="ref1" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-6 left-14 w-8 h-8 rounded-full border-2 border-blue-400 bg-slate-800 overflow-hidden shadow-md">
            <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop" alt="ref2" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Title & Commission Description */}
        <div className="text-center px-4 mb-6">
          <h2 className="text-xl font-extrabold text-white mb-2 leading-tight">
            Приглашайте друзей <br /> в One Pay Wallet
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            и получайте до <span className="text-cyan-400 font-semibold">30% от комиссии сервиса</span> за каждую их оплату по QR-коду
          </p>
        </div>

        {/* Link & QR Code Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 p-4 bg-[#121929] border border-slate-800/80 rounded-2xl text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">Ссылка</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              </div>
              <span className="block text-[11px] text-slate-400 truncate">
                Ваша персональная ссылка
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setShowQrModal(true);
            }}
            className="flex items-center gap-3 p-4 bg-[#121929] border border-slate-800/80 rounded-2xl text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">QR-код</span>
              <span className="block text-[11px] text-slate-400">
                Быстрое приглашение
              </span>
            </div>
          </button>
        </div>

        {/* Statistics Section */}
        <div>
          <span className="block text-xs font-bold text-slate-400 tracking-wider uppercase px-1 mb-2">
            Статистика
          </span>
          <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-2">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              У вас пока нет рефералов 👥
            </p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center max-w-xs w-full">
            <h3 className="text-lg font-bold text-white mb-4">Ваш Реферальный QR</h3>
            <div className="bg-white p-3 rounded-2xl inline-block mb-4">
              <img src={qrCodeUrl} alt="Referral QR" className="w-48 h-48" />
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
