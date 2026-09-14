import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, ChevronLeft, Copy, Check, Share2, ChevronDown, Info, CreditCard, Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

type Step = 'menu' | 'address' | 'select_network' | 'sbp_test';

interface NetworkOption {
  id: string;
  name: string;
  chain: string;
  minAmount: string;
  fee: string;
  bgGradient: string;
  color: string;
  iconBg: string;
}

const NETWORKS: Record<string, NetworkOption[]> = {
  USDT: [
    { id: 'trc20', name: 'TRC20', chain: 'TRON Network', minAmount: '5 USDT', fee: '2,75 USDT', bgGradient: 'from-emerald-600 to-teal-800', color: '#10b981', iconBg: 'bg-emerald-500' },
    { id: 'ton', name: 'TON', chain: 'TON Blockchain', minAmount: '0,1 USDT', fee: '0 USDT', bgGradient: 'from-sky-500 to-blue-700', color: '#38bdf8', iconBg: 'bg-sky-500' },
    { id: 'bep20', name: 'BEP20', chain: 'BNB Smart Chain', minAmount: '1 USDT', fee: '0,40 USDT', bgGradient: 'from-amber-500 to-yellow-700', color: '#f59e0b', iconBg: 'bg-amber-500' },
  ],
  TON: [
    { id: 'ton-native', name: 'TON', chain: 'TON Blockchain', minAmount: '0,1 TON', fee: '0,05 TON', bgGradient: 'from-sky-500 to-blue-700', color: '#38bdf8', iconBg: 'bg-sky-500' }
  ],
  GRAM: [
    { id: 'gram-ton', name: 'TON', chain: 'TON Blockchain', minAmount: '0,25 GRAM', fee: '0,2 GRAM', bgGradient: 'from-cyan-500 to-blue-600', color: '#06b6d4', iconBg: 'bg-cyan-500' }
  ],
  BTC: [
    { id: 'btc-native', name: 'Bitcoin', chain: 'Bitcoin Mainnet', minAmount: '0.0001 BTC', fee: '0.00005 BTC', bgGradient: 'from-amber-600 to-orange-800', color: '#f59e0b', iconBg: 'bg-amber-500' }
  ]
};

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

  const [step, setStep] = useState<Step>('menu');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('trc20');
  const [copied, setCopied] = useState<boolean>(false);
  const [currency] = useState<string>('RUB');

  if (activeModal !== 'deposit') return null;

  const currentNetworks = NETWORKS[selectedAsset.symbol] || NETWORKS['USDT'];
  const activeNetwork = currentNetworks.find((n) => n.id === selectedNetworkId) || currentNetworks[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAsset.depositAddress);
    setCopied(true);
    triggerHaptic('success');
    showToast('Адрес скопирован в буфер обмена!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: `Адрес ${selectedAsset.symbol} (${activeNetwork.name})`,
        text: `Мой адрес пополнения ${selectedAsset.symbol}: ${selectedAsset.depositAddress}`,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleTestTopUp = (amount: number = 100) => {
    handleDeposit(selectedAsset.symbol, amount);
    triggerHaptic('success');
    setActiveModal('none');
    setStep('menu');
  };

  const handleClose = () => {
    triggerHaptic('light');
    setActiveModal('none');
    setStep('menu');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#0b101d] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-slate-800/80 p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* STEP 1: MAIN DEPOSIT MENU (Ref Screenshot 167) */}
        {step === 'menu' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-xl font-extrabold text-white tracking-tight">Пополнить</h2>
              <button onClick={handleClose} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currency Selector Bar */}
            <div className="flex items-center justify-between bg-[#131b2e] border border-slate-800 rounded-2xl p-3.5">
              <span className="text-xs font-semibold text-slate-400">Методы пополнения для</span>
              <button className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm">
                <span>🇷🇺 {currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Section 1: FIAT */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">ФИАТОМ</span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('sbp_test');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">По СБП</div>
                    <div className="text-xs text-blue-400 font-medium">Без комиссии</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>
            </div>

            {/* Section 2: CRYPTO ASSETS */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">АКТИВАМИ</span>
              
              <button
                onClick={() => {
                  triggerHaptic('light');
                  const usdtAsset = assets.find(a => a.symbol === 'USDT') || assets[0];
                  setSelectedAsset(usdtAsset);
                  setSelectedNetworkId('trc20');
                  setStep('address');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Стейблкоинами</div>
                    <div className="text-xs text-slate-400">Комиссия от 0 USD</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  const tonAsset = assets.find(a => a.symbol === 'TON') || assets[1] || assets[0];
                  setSelectedAsset(tonAsset);
                  setSelectedNetworkId('ton-native');
                  setStep('address');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">Другими активами</div>
                    <div className="text-xs text-slate-400">Будут зачислены напрямую</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ADDRESS & QR CODE DISPLAY (Ref Screenshots 165, 168) */}
        {step === 'address' && (
          <div className="space-y-4 animate-fade-in">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('menu');
                }}
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleClose} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Ваш адрес {selectedAsset.symbol} в сети {activeNetwork.name}
            </h2>

            {/* Colored QR Code Banner */}
            <div className={`p-6 rounded-3xl bg-gradient-to-br ${activeNetwork.bgGradient} flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border border-white/10`}>
              <div className="bg-white p-3.5 rounded-2xl shadow-inner border border-white">
                <QRCodeSVG value={selectedAsset.depositAddress} size={180} level="H" includeMargin={false} />
              </div>
            </div>

            {/* Wallet Address Box with Copy Button */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-200 break-all select-all pr-2 font-semibold">
                  {selectedAsset.depositAddress}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors flex-shrink-0"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/60">
                Отправляйте только <strong>{selectedAsset.symbol}</strong> в сети <strong>{activeNetwork.name}</strong> на этот адрес. Отправка активов в других сетях приведёт к их утере!
              </p>
            </div>

            {/* Network Dropdown & Info Card */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Сеть</span>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setStep('select_network');
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-bold text-white hover:bg-slate-800 transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNetwork.color }} />
                  <span>{activeNetwork.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Для зачисления сумма пополнения должна быть больше <strong>{activeNetwork.minAmount}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Фиксированная комиссия <strong>{activeNetwork.fee}</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClose}
                className="py-3.5 rounded-xl bg-[#182238] hover:bg-[#202d4a] text-slate-200 text-xs font-bold transition-all border border-slate-800"
              >
                На главную
              </button>

              <button
                onClick={handleShare}
                className="py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Поделиться</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: NETWORK SELECTION SHEET (Ref Screenshot 166) */}
        {step === 'select_network' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Выберите сеть</h2>
              <button onClick={() => setStep('address')} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {currentNetworks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => {
                    triggerHaptic('light');
                    setSelectedNetworkId(net.id);
                    setStep('address');
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    selectedNetworkId === net.id
                      ? 'bg-slate-900 border-cyan-500 text-white shadow-glow'
                      : 'bg-[#131b2e] border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${net.iconBg} flex items-center justify-center font-bold text-white text-xs shadow-sm`}>
                      {net.name.substring(0, 3)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{net.name}</div>
                      <div className="text-xs text-slate-400">Комиссия до {net.fee}</div>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedNetworkId === net.id ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                    {selectedNetworkId === net.id && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: INSTANT SBP TEST TOP-UP (+100 USDT simulation) */}
        {step === 'sbp_test' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button onClick={() => setStep('menu')} className="p-1 rounded-full text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-white">Пополнение по СБП</h2>
              <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-sm text-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Быстрое пополнение СБП (Без комиссии)</span>
              </div>
              <p>Мгновенное зачисление фиата с конвертацией на счет USDT кошелька.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Выберите тестовую сумму:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTestTopUp(100)}
                  className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/60 text-white font-bold text-sm hover:bg-cyan-500/20 transition-all text-center shadow-glow"
                >
                  +100 USDT (Тест)
                </button>

                <button
                  onClick={() => handleTestTopUp(500)}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 transition-all text-center"
                >
                  +500 USDT
                </button>
              </div>
            </div>

            <button
              onClick={() => handleTestTopUp(100)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white hover:from-blue-500 hover:to-cyan-400 transition-all shadow-glow text-sm flex items-center justify-center gap-2"
            >
              <span>Пополнить баланс (+100 USDT)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
