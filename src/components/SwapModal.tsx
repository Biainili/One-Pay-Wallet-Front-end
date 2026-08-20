import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { ArrowLeftRight, ArrowDownUp, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export const SwapModal: React.FC = () => {
  const { assets, handleSwap, triggerHaptic } = useWallet();

  const [fromSymbol, setFromSymbol] = useState<string>('USDT');
  const [toSymbol, setToSymbol] = useState<string>('TON');
  const [fromAmount, setFromAmount] = useState<string>('');

  const fromAsset = assets.find((a) => a.symbol === fromSymbol) || assets[0];
  const toAsset = assets.find((a) => a.symbol === toSymbol) || assets[1];

  const parsedFrom = parseFloat(fromAmount) || 0;
  // Calculate exchange output: (fromAmount * fromPrice) / toPrice
  const exchangeRate = fromAsset.fiatPrice / toAsset.fiatPrice;
  const calculatedToAmount = (parsedFrom * exchangeRate).toFixed(4);

  const isEnoughBalance = parsedFrom > 0 && parsedFrom <= fromAsset.balance;

  const handleFlip = () => {
    triggerHaptic('medium');
    const temp = fromSymbol;
    setFromSymbol(toSymbol);
    setToSymbol(temp);
    setFromAmount('');
  };

  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnoughBalance) return;

    const toVal = parseFloat(calculatedToAmount) || 0;
    const success = handleSwap(fromSymbol, toSymbol, parsedFrom, toVal);
    if (success) {
      setFromAmount('');
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">Мгновенный Обмен</h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Лучший курс
        </span>
      </div>

      <form onSubmit={handleExecuteSwap} className="space-y-3">
        {/* FROM BOX */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Отдаете:</span>
            <span className="font-mono">
              Баланс: <strong className="text-slate-200">{fromAsset.balance} {fromAsset.symbol}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold font-mono text-slate-100 focus:outline-none placeholder:text-slate-600"
            />

            <select
              value={fromSymbol}
              onChange={(e) => {
                triggerHaptic('light');
                setFromSymbol(e.target.value);
                if (e.target.value === toSymbol) {
                  setToSymbol(fromSymbol);
                }
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm font-bold text-slate-100 focus:outline-none"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            ≈ ${(parsedFrom * fromAsset.fiatPrice).toFixed(2)} USD
          </div>
        </div>

        {/* FLIP BUTTON */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            type="button"
            onClick={handleFlip}
            className="p-3 rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-glow border-4 border-slate-950 transition-all hover:scale-110 active:scale-95"
            title="Поменять местами"
          >
            <ArrowDownUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* TO BOX */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Получаете (расчет):</span>
            <span className="font-mono">
              Баланс: <strong className="text-slate-200">{toAsset.balance} {toAsset.symbol}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={parsedFrom > 0 ? calculatedToAmount : '0.00'}
              className="w-full bg-transparent text-2xl font-bold font-mono text-cyan-400 focus:outline-none"
            />

            <select
              value={toSymbol}
              onChange={(e) => {
                triggerHaptic('light');
                setToSymbol(e.target.value);
                if (e.target.value === fromSymbol) {
                  setFromSymbol(toSymbol);
                }
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm font-bold text-slate-100 focus:outline-none"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.symbol}>
                  {a.symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            ≈ ${(parseFloat(calculatedToAmount) * toAsset.fiatPrice || 0).toFixed(2)} USD
          </div>
        </div>

        {/* EXCHANGE RATE DETAILS */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Курс обмена:
            </span>
            <span className="text-slate-200 font-semibold">
              1 {fromAsset.symbol} = {exchangeRate.toFixed(4)} {toAsset.symbol}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Проскальзывание (Slippage):</span>
            <span className="text-emerald-400 font-semibold">0.1% (Auto)</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Комиссия протокола:</span>
            <span className="text-emerald-400 font-semibold">0% (0.00 USDT)</span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={!isEnoughBalance}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-glow border border-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Выполнить Мгновенный Обмен</span>
        </button>
      </form>
    </div>
  );
};
