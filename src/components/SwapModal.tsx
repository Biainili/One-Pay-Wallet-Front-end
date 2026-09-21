import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ChevronLeft, 
  X, 
  ArrowDownUp, 
  Info, 
  Wallet, 
  RefreshCw,
  ChevronDown,
  Delete
} from 'lucide-react';

export const AssetLogo: React.FC<{ symbol: string; className?: string }> = ({ symbol, className = "w-6 h-6" }) => {
  const sym = symbol.toUpperCase().replace('-TRC20', '');
  switch (sym) {
    case 'USD':
      return (
        <div className={`${className} rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs shadow-sm shrink-0`}>
          $
        </div>
      );
    case 'GRAM':
      return (
        <div className={`${className} rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0`}>
          <svg className="w-3.5 h-3.5 fill-cyan-400 stroke-cyan-300" viewBox="0 0 24 24">
            <path d="M12 2L2 9L12 22L22 9L12 2Z" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'USDT':
      return (
        <div className={`${className} rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-black text-emerald-400 text-xs shadow-sm shrink-0`}>
          ₮
        </div>
      );
    case 'TON':
      return (
        <div className={`${className} rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-sm shrink-0`}>
          <svg className="w-3.5 h-3.5 stroke-sky-400 fill-sky-400/20" viewBox="0 0 24 24">
            <path d="M12 2L3 7.5L12 21.5L21 7.5L12 2Z" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 2V21.5M3 7.5L12 12.5L21 7.5" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'BTC':
      return (
        <div className={`${className} rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-400 text-xs shadow-sm shrink-0`}>
          ₿
        </div>
      );
    case 'ETH':
      return (
        <div className={`${className} rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-bold text-indigo-300 text-xs shadow-sm shrink-0`}>
          Ξ
        </div>
      );
    case 'RUB':
      return (
        <div className={`${className} rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center font-bold text-rose-400 text-xs shadow-sm shrink-0`}>
          ₽
        </div>
      );
    default:
      return (
        <div className={`${className} rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0`}>
          {sym.substring(0, 3)}
        </div>
      );
  }
};

export const SwapModal: React.FC = () => {
  const { assets, handleSwap, setActiveTab, setActiveModal, triggerHaptic, showToast } = useWallet();

  const [fromSymbol, setFromSymbol] = useState<string>('USD');
  const [toSymbol, setToSymbol] = useState<string>('GRAM');
  const [fromAmount, setFromAmount] = useState<string>('0');
  const [activeSheet, setActiveSheet] = useState<'none' | 'from' | 'to'>('none');
  const [sliderVal, setSliderVal] = useState<number>(0);

  const fromAsset = assets.find((a) => a.symbol === fromSymbol) || assets[0];
  const toAsset = assets.find((a) => a.symbol === toSymbol) || assets[1] || assets[0];

  const parsedFrom = parseFloat(fromAmount.replace(',', '.')) || 0;
  const exchangeRate = fromAsset && toAsset ? fromAsset.fiatPrice / toAsset.fiatPrice : 1;
  const calculatedTo = parsedFrom * exchangeRate;

  // Format to string with comma for Russian locale display
  const formattedToAmount = calculatedTo === 0 
    ? '0,00' 
    : calculatedTo.toFixed(4).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');

  const isEnoughBalance = parsedFrom > 0 && parsedFrom <= fromAsset.balance;

  const handleBack = () => {
    triggerHaptic('light');
    setActiveTab('home');
    setActiveModal('none');
  };

  const handleFlip = () => {
    triggerHaptic('medium');
    const prevFrom = fromSymbol;
    setFromSymbol(toSymbol);
    setToSymbol(prevFrom);
    setFromAmount('0');
    setSliderVal(0);
  };

  const handleKeyPadPress = (key: string) => {
    triggerHaptic('light');
    if (key === 'del') {
      if (fromAmount.length <= 1 || fromAmount === '0') {
        setFromAmount('0');
        setSliderVal(0);
      } else {
        const next = fromAmount.slice(0, -1);
        setFromAmount(next);
        const nextParsed = parseFloat(next.replace(',', '.')) || 0;
        if (fromAsset.balance > 0) {
          setSliderVal(Math.min(100, Math.round((nextParsed / fromAsset.balance) * 100)));
        }
      }
      return;
    }

    if (key === ',') {
      if (fromAmount.includes(',') || fromAmount.includes('.')) return;
      setFromAmount(fromAmount + ',');
      return;
    }

    // Digit key '0'-'9'
    let next: string;
    if (fromAmount === '0') {
      next = key;
    } else {
      next = fromAmount + key;
    }
    setFromAmount(next);

    const nextParsed = parseFloat(next.replace(',', '.')) || 0;
    if (fromAsset.balance > 0) {
      setSliderVal(Math.min(100, Math.round((nextParsed / fromAsset.balance) * 100)));
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderVal(val);
    if (fromAsset.balance > 0) {
      const calculated = (fromAsset.balance * (val / 100));
      const strVal = calculated === 0 ? '0' : calculated.toFixed(2).replace('.', ',');
      setFromAmount(strVal);
    }
  };

  const handleSelectAsset = (symbol: string) => {
    triggerHaptic('light');
    if (activeSheet === 'from') {
      setFromSymbol(symbol);
      if (symbol === toSymbol) {
        setToSymbol(fromSymbol);
      }
    } else if (activeSheet === 'to') {
      setToSymbol(symbol);
      if (symbol === fromSymbol) {
        setFromSymbol(toSymbol);
      }
    }
    setActiveSheet('none');
  };

  const handleExecuteSwap = () => {
    if (!isEnoughBalance) return;
    triggerHaptic('success');
    const success = handleSwap(fromSymbol, toSymbol, parsedFrom, calculatedTo);
    if (success) {
      showToast(`Успешный обмен ${parsedFrom} ${fromSymbol} на ${formattedToAmount} ${toSymbol}`, 'success');
      setFromAmount('0');
      setSliderVal(0);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between pb-20 pt-2 animate-fade-in relative text-slate-100 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-4">
        <button 
          onClick={handleBack} 
          className="p-2 rounded-full hover:bg-slate-800/80 text-slate-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-100 tracking-wide">
          Обменять активы
        </h1>
        <div className="w-10" />
      </div>

      {/* Main Swap Card Form */}
      <div className="space-y-2 relative px-2">
        
        {/* TOP BOX: Отдаёте */}
        <div className="p-4 rounded-2xl bg-[#121829] border border-slate-800/80 shadow-inner space-y-2 relative">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-400">Отдаёте</span>
            <div className="flex items-center gap-1 font-mono text-slate-400 text-xs">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>{fromAsset.balance}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight truncate">
              {fromAmount}
            </span>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveSheet('from');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C253E] hover:bg-[#253254] border border-slate-700/70 text-slate-100 font-bold text-sm transition-all shadow-sm shrink-0"
            >
              <AssetLogo symbol={fromSymbol} className="w-6 h-6" />
              <span>{fromSymbol}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* MIDDLE SWAP BUTTON */}
        <div className="flex justify-center -my-3.5 relative z-10">
          <button
            type="button"
            onClick={handleFlip}
            className="w-10 h-10 rounded-full bg-[#1A233D] border border-[#2D395E] text-cyan-400 hover:text-cyan-300 hover:scale-110 active:scale-95 transition-all shadow-lg flex items-center justify-center"
            title="Поменять местами"
          >
            <ArrowDownUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* BOTTOM BOX: Получаете */}
        <div className="p-4 rounded-2xl bg-[#121829] border border-slate-800/80 shadow-inner space-y-2 relative">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-400">Получаете</span>
            <div className="flex items-center gap-1 font-mono text-slate-400 text-xs">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>{toAsset.balance}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight truncate">
              {formattedToAmount}
            </span>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveSheet('to');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C253E] hover:bg-[#253254] border border-slate-700/70 text-slate-100 font-bold text-sm transition-all shadow-sm shrink-0"
            >
              <AssetLogo symbol={toSymbol} className="w-6 h-6" />
              <span>{toSymbol}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Exchange Rate Information */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2 font-medium">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
          <span>
            1 {toSymbol} ≈ {exchangeRate > 0 ? (1 / exchangeRate).toFixed(4).replace('.', ',') : '1'} {fromSymbol}
          </span>
          <Info className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-300" />
        </div>

        {/* Min / Max Percentage Slider */}
        <div className="pt-4 px-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <button 
              type="button" 
              onClick={() => {
                setSliderVal(0);
                setFromAmount('0');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              Min
            </button>
            <button 
              type="button" 
              onClick={() => {
                setSliderVal(100);
                setFromAmount(fromAsset.balance.toString().replace('.', ','));
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              Max
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      {/* On-Screen Numeric Keypad */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-center max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'del'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPadPress(key)}
              className="h-12 flex items-center justify-center text-xl font-bold text-slate-100 hover:bg-slate-800/50 rounded-2xl transition-all active:scale-90"
            >
              {key === 'del' ? (
                <Delete className="w-6 h-6 text-slate-300" />
              ) : (
                key
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Action Button */}
      <div className="px-3 pt-4">
        <button
          type="button"
          onClick={handleExecuteSwap}
          disabled={!isEnoughBalance}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-lg flex items-center justify-center ${
            isEnoughBalance
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-[0.98]'
              : 'bg-[#1C253E] text-slate-500 cursor-not-allowed border border-slate-800'
          }`}
        >
          Продолжить
        </button>
      </div>

      {/* Bottom Sheet Asset Selector Overlay Modal */}
      {activeSheet !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center animate-fade-in">
          <div className="w-full max-w-md bg-[#0F172A] border-t border-slate-800 rounded-t-3xl p-5 space-y-4 animate-slide-up max-h-[75vh] flex flex-col">
            
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100">
                {activeSheet === 'from' ? 'Отдаёте' : 'Получаете'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveSheet('none')}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Assets List */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {assets.map((asset) => {
                const isSelected = (activeSheet === 'from' ? fromSymbol : toSymbol) === asset.symbol;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => handleSelectAsset(asset.symbol)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-[#162038] border-blue-500/60 text-slate-100 shadow-md'
                        : 'bg-[#121829]/70 border-slate-800/80 hover:bg-[#1A233D] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AssetLogo symbol={asset.symbol} className="w-9 h-9" />
                      <div className="text-left">
                        <div className="font-bold text-sm text-slate-100">{asset.symbol}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {asset.balance} {asset.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center border border-blue-400">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
