import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { ChevronLeft, X, Sparkles, CreditCard } from 'lucide-react';

export const VirtualCardsModal: React.FC = () => {
  const { activeModal, setActiveModal, triggerHaptic, showToast } = useWallet();

  const [view, setView] = useState<'menu' | 'cards_list' | 'kyc_info'>('menu');

  if (activeModal !== 'virtual_cards') return null;

  const handleClose = () => {
    triggerHaptic('light');
    setActiveModal('none');
    setView('menu');
  };

  const handleUpgradeKyc = () => {
    triggerHaptic('medium');
    showToast('Для получения карты «Антарктик» пройдите расширенную верификацию в настройках профиля.', 'info');
  };

  const handleShowWorldCards = () => {
    triggerHaptic('medium');
    setView('cards_list');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-[#0B101D] border border-slate-800 sm:rounded-3xl rounded-t-3xl min-h-[85vh] max-h-[92vh] flex flex-col justify-between overflow-y-auto p-5 space-y-5 text-slate-100 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <button 
            onClick={view === 'menu' ? handleClose : () => setView('menu')}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-slate-100">Платёжные карты</h2>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {view === 'menu' ? (
          <div className="space-y-6 animate-fade-in pb-4">
            
            {/* Section 1: ОПЛАЧИВАТЬ В РОССИИ */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Оплачивать в России
              </div>

              <div className="p-5 rounded-3xl bg-[#13192B] border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xs">
                    ❄️ BEAR
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-base text-slate-100">
                    Карта "Антарктик"
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Доступна на уровне верификации «Расширенный» – выпускается автоматически
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUpgradeKyc}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-slate-100 text-xs transition-all shadow-lg"
                >
                  Повысить уровень верификации
                </button>
              </div>
            </div>

            {/* Section 2: ОПЛАЧИВАТЬ ПО МИРУ */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Оплачивать по миру
              </div>

              <div className="p-5 rounded-3xl bg-[#13192B] border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                    MC
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                    VISA
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-base text-slate-100">
                    Виртуальные World-карты
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Доступны на уровне верификации «Базовый» – выпускаете самостоятельно
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleShowWorldCards}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-slate-100 text-xs transition-all shadow-lg"
                >
                  Посмотреть карты
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Cards List subview */
          <div className="space-y-4 animate-fade-in pb-4">
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Ваши World-карты</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Выпустите вашу виртуальную карту за 1 минуту для мгновенной оплаты покупок за рубежом.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 border border-indigo-500/40 text-white space-y-4 shadow-xl">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold">NEXUS VIRTUAL WORLD</span>
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-lg font-mono tracking-widest font-bold">
                •••• •••• •••• 9012
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span>CVV: ***</span>
                <span>EXP: 12/28</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('success');
                showToast('Виртуальная карта успешно выписана и готова к использованию!', 'success');
                setView('menu');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 text-xs transition-all shadow-glow"
            >
              Выпустить новую карту
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
