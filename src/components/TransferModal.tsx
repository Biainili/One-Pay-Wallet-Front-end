import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, Send, User, Wallet, AlertCircle } from 'lucide-react';

export const TransferModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    assets, 
    handleTransfer, 
    triggerHaptic 
  } = useWallet();

  const [recipient, setRecipient] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>(assets[0].symbol);
  const [amount, setAmount] = useState<string>('');

  if (activeModal !== 'transfer') return null;

  const currentAsset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const numAmount = parseFloat(amount) || 0;
  const isEnoughBalance = numAmount > 0 && numAmount <= currentAsset.balance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;
    if (!isEnoughBalance) return;

    const success = handleTransfer(recipient.trim(), selectedSymbol, numAmount);
    if (success) {
      setRecipient('');
      setAmount('');
      setActiveModal('none');
    }
  };

  const handleSetMax = () => {
    triggerHaptic('light');
    setAmount(currentAsset.balance.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-3xl border border-slate-700/80 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-slate-100">Отправить Активы</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Получатель:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="@username или адрес кошелька"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono pr-10"
                required
              />
              <div className="absolute right-3 top-3 text-slate-400">
                {recipient.startsWith('@') ? <User className="w-4 h-4 text-cyan-400" /> : <Wallet className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              💡 Перевод по @username в Telegram без комиссии!
            </p>
          </div>

          {/* Select Asset */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Монета:</label>
            <select
              value={selectedSymbol}
              onChange={(e) => {
                triggerHaptic('light');
                setSelectedSymbol(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-bold"
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.symbol}>
                  {asset.name} ({asset.symbol}) — Баланс: {asset.balance} {asset.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-400">Сумма перевода:</label>
              <span className="text-xs text-slate-400 font-mono">
                Доступно: <strong className="text-slate-200">{currentAsset.balance} {currentAsset.symbol}</strong>
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono font-bold pr-16"
                required
              />
              <button
                type="button"
                onClick={handleSetMax}
                className="absolute right-2 top-2 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30"
              >
                МАКС
              </button>
            </div>
            {numAmount > currentAsset.balance && (
              <div className="flex items-center gap-1 text-xs text-red-400 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Сумма превышает ваш доступный баланс!</span>
              </div>
            )}
          </div>

          {/* Transaction Summary Box */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Комиссия сети:</span>
              <span className="text-emerald-400 font-semibold">0.00 USDT (Бесплатно)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Эквивалент:</span>
              <span className="text-slate-200 font-semibold">
                ≈ ${(numAmount * currentAsset.fiatPrice).toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!recipient || !isEnoughBalance}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white hover:from-blue-500 hover:to-cyan-400 transition-all shadow-glow border border-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Подтвердить Перевод</span>
          </button>
        </form>
      </div>
    </div>
  );
};
