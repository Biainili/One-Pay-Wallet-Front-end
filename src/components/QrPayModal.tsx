import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, QrCode, Camera, CheckCircle, Store, Coffee, ShoppingBag } from 'lucide-react';

export const QrPayModal: React.FC = () => {
  const { activeModal, setActiveModal, handleTransfer, showToast, triggerHaptic } = useWallet();
  const [scannedMerchant, setScannedMerchant] = useState<{ name: string; amount: number } | null>(null);

  if (activeModal !== 'qr_pay') return null;

  const handleSimulateScan = (name: string, amount: number) => {
    triggerHaptic('medium');
    setScannedMerchant({ name, amount });
  };

  const handlePay = () => {
    if (!scannedMerchant) return;
    const success = handleTransfer(scannedMerchant.name, 'USDT', scannedMerchant.amount);
    if (success) {
      showToast(`Оплачено ${scannedMerchant.amount} USDT в ${scannedMerchant.name}`, 'success');
      setScannedMerchant(null);
      setActiveModal('none');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-3xl border border-slate-700/80 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">QR Оплата Магазинам</h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              setScannedMerchant(null);
              setActiveModal('none');
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!scannedMerchant ? (
          <div className="space-y-4">
            {/* Camera View simulation box */}
            <div className="relative w-full h-56 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-emerald-500/10 animate-pulse" />
              <div className="w-36 h-36 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center relative">
                <Camera className="w-8 h-8 text-emerald-400 opacity-60 animate-bounce" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
              </div>
              <span className="text-xs text-emerald-400 mt-3 font-mono font-semibold">
                Наведите камеру на QR-код продавца
              </span>
            </div>

            {/* Quick Demo Scan Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Или выберите тестовый QR продавца:
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => handleSimulateScan('Coffee Shop #12', 4.50)}
                  className="w-full flex items-center justify-between p-3 rounded-xl glass-card border border-slate-800 hover:bg-slate-800/80 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Coffee Shop #12</div>
                      <div className="text-[10px] text-slate-400">Прямая оплата по QR</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">4.50 USDT</span>
                </button>

                <button
                  onClick={() => handleSimulateScan('One Pay Store', 29.90)}
                  className="w-full flex items-center justify-between p-3 rounded-xl glass-card border border-slate-800 hover:bg-slate-800/80 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">One Pay Store</div>
                      <div className="text-[10px] text-slate-400">Покупка мерча</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">29.90 USDT</span>
                </button>

                <button
                  onClick={() => handleSimulateScan('AliPay Merchant CNY', 50.00)}
                  className="w-full flex items-center justify-between p-3 rounded-xl glass-card border border-slate-800 hover:bg-slate-800/80 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">AliPay Merchant (China)</div>
                      <div className="text-[10px] text-slate-400">Конвертация в CNY</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">50.00 USDT</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Confirmation View */
          <div className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Подтверждение Оплаты</h3>
              <p className="text-xs text-slate-400">{scannedMerchant.name}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-xs text-slate-400 mb-1">Сумма к списанию:</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {scannedMerchant.amount.toFixed(2)} USDT
              </div>
              <div className="text-xs text-slate-400 mt-1">Комиссия: 0.00 USDT</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setScannedMerchant(null)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
              >
                Отмена
              </button>
              <button
                onClick={handlePay}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-glow text-xs"
              >
                Оплатить Сейчаc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
