import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Info, Sparkles } from 'lucide-react';

export const DepositModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    assets, 
    selectedAsset, 
    setSelectedAsset, 
    showToast, 
    triggerHaptic,
    handleDeposit 
  } = useWallet();

  const [copied, setCopied] = useState<boolean>(false);

  if (activeModal !== 'deposit') return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAsset.depositAddress);
    setCopied(true);
    triggerHaptic('success');
    showToast('Адрес кошелька скопирован!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestTopUp = () => {
    handleDeposit(selectedAsset.symbol, 100);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-3xl border border-slate-700/80 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Пополнить Баланс</h2>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('none');
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Выберите монету:</label>
          <div className="grid grid-cols-2 gap-2">
            {assets.map((asset) => {
              const isSelected = selectedAsset.id === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedAsset(asset);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-glow'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${asset.iconBg}`}>
                    {asset.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{asset.symbol}</div>
                    <div className="text-[10px] text-slate-400">{asset.network}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/95 text-slate-950 my-3 shadow-glow border border-white">
          <QRCodeSVG value={selectedAsset.depositAddress} size={170} level="H" includeMargin={true} />
          <span className="text-[11px] font-bold text-slate-700 mt-2 font-mono uppercase tracking-wider">
            {selectedAsset.symbol} ({selectedAsset.network})
          </span>
        </div>

        {/* Deposit Address Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Ваш адрес пополнения:</label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
            <span className="truncate flex-1">{selectedAsset.depositAddress}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors flex items-center gap-1 font-sans text-xs font-semibold"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Скопировано' : 'Копировать'}</span>
            </button>
          </div>
        </div>

        {/* Info Alert */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex gap-2.5">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            Отправляйте только <strong>{selectedAsset.symbol}</strong> в сети <strong>{selectedAsset.network}</strong> на этот адрес. Депозиты из других сетей могут быть утеряны!
          </div>
        </div>

        {/* Demo Fast Topup Button */}
        <button
          onClick={handleTestTopUp}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow text-sm"
        >
          Симулировать пополнение (+100 {selectedAsset.symbol})
        </button>
      </div>
    </div>
  );
};
