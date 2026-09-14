import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { QRCodeSVG } from 'qrcode.react';
import { X, ChevronLeft, Copy, Check, Share2, ChevronDown, Info, Wallet, Sparkles, PlusCircle } from 'lucide-react';

type Step = 'menu' | 'address' | 'select_network';

interface NetworkOption {
  id: string;
  name: string;
  chain: string;
  minAmount: string;
  fee: string;
  bgGradient: string;
  color: string;
  iconBg: string;
  type: 'trc20' | 'ton' | 'bep20' | 'btc';
}

const TonIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7.5L12 21.5L21 7.5L12 2Z" fill="#38BDF8" fillOpacity="0.25" stroke="#38BDF8" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 2V21.5M3 7.5L12 12.5L21 7.5" stroke="#38BDF8" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const TronIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 3.5L21.5 5.5L14.5 20.5L2.5 3.5Z" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M21.5 5.5L9.5 12.5M9.5 12.5L14.5 20.5M9.5 12.5L2.5 3.5" stroke="#EF4444" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const BnbIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="8" height="8" transform="rotate(45 12 12)" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2"/>
    <rect x="10.5" y="2.5" width="3" height="3" transform="rotate(45 12 4)" fill="#F59E0B"/>
    <rect x="10.5" y="18.5" width="3" height="3" transform="rotate(45 12 20)" fill="#F59E0B"/>
    <rect x="2.5" y="10.5" width="3" height="3" transform="rotate(45 4 12)" fill="#F59E0B"/>
    <rect x="18.5" y="10.5" width="3" height="3" transform="rotate(45 20 12)" fill="#F59E0B"/>
  </svg>
);

const BtcIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2"/>
    <path d="M10 7H14C15.1 7 16 7.9 16 9C16 9.8 15.4 10.5 14.6 10.8C15.7 11.1 16.5 12 16.5 13.2C16.5 14.6 15.4 15.7 14 15.7H10V7Z" stroke="#F59E0B" strokeWidth="1.8"/>
  </svg>
);

const renderNetworkIcon = (type: string, className?: string) => {
  switch (type) {
    case 'trc20':
      return <TronIcon className={className} />;
    case 'ton':
    case 'ton-native':
    case 'gram-ton':
      return <TonIcon className={className} />;
    case 'bep20':
      return <BnbIcon className={className} />;
    default:
      return <BtcIcon className={className} />;
  }
};

const NETWORKS: Record<string, NetworkOption[]> = {
  USDT: [
    { id: 'trc20', name: 'TRC20', chain: 'TRON Network', minAmount: '5 USDT', fee: '2,75 USDT', bgGradient: 'from-emerald-600 to-teal-800', color: '#10b981', iconBg: 'bg-emerald-500/20 border-emerald-500/40', type: 'trc20' },
    { id: 'ton', name: 'TON', chain: 'TON Blockchain', minAmount: '0,1 USDT', fee: '0 USDT', bgGradient: 'from-sky-500 to-blue-700', color: '#38bdf8', iconBg: 'bg-sky-500/20 border-sky-500/40', type: 'ton' },
    { id: 'bep20', name: 'BEP20', chain: 'BNB Smart Chain', minAmount: '1 USDT', fee: '0,40 USDT', bgGradient: 'from-amber-500 to-yellow-700', color: '#f59e0b', iconBg: 'bg-amber-500/20 border-amber-500/40', type: 'bep20' },
  ],
  TON: [
    { id: 'ton-native', name: 'TON', chain: 'TON Blockchain', minAmount: '0,1 TON', fee: '0,05 TON', bgGradient: 'from-sky-500 to-blue-700', color: '#38bdf8', iconBg: 'bg-sky-500/20 border-sky-500/40', type: 'ton' }
  ],
  GRAM: [
    { id: 'gram-ton', name: 'TON', chain: 'TON Blockchain', minAmount: '0,25 GRAM', fee: '0,2 GRAM', bgGradient: 'from-cyan-500 to-blue-600', color: '#06b6d4', iconBg: 'bg-cyan-500/20 border-cyan-500/40', type: 'ton' }
  ],
  BTC: [
    { id: 'btc-native', name: 'Bitcoin', chain: 'Bitcoin Mainnet', minAmount: '0.0001 BTC', fee: '0.00005 BTC', bgGradient: 'from-amber-600 to-orange-800', color: '#f59e0b', iconBg: 'bg-amber-500/20 border-amber-500/40', type: 'btc' }
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
              <h2 className="text-xl font-extrabold text-white tracking-tight">Пополнение</h2>
              <button onClick={handleClose} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Test TopUp Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Тестовый счет (+100 USDT)</span>
                </div>
                <div className="text-xs text-slate-400">Симуляция пополнения баланса</div>
              </div>
              <button
                onClick={() => handleTestTopUp(100)}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-glow flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+100 USDT</span>
              </button>
            </div>

            {/* Section: CRYPTO ASSETS */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">ВЫБЕРИТЕ КАТЕГОРИЮ ПОПОЛНЕНИЯ</span>
              
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
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Стейблкоинами</div>
                    <div className="text-xs text-slate-400">USDT (TRC20, TON, BEP20) • От 0 USD</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center p-1"><TronIcon className="w-3.5 h-3.5" /></div>
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/50 flex items-center justify-center p-1"><TonIcon className="w-3.5 h-3.5" /></div>
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center p-1"><BnbIcon className="w-3.5 h-3.5" /></div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
                </div>
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
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                    <TonIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">Другими активами</div>
                    <div className="text-xs text-slate-400">TON, BTC, GRAM • Зачисление напрямую</div>
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

            {/* Network Dropdown & Info Card with Branded Network Icon */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Сеть</span>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setStep('select_network');
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
                >
                  <div className={`p-1 rounded-lg ${activeNetwork.iconBg}`}>
                    {renderNetworkIcon(activeNetwork.type, "w-4 h-4")}
                  </div>
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

        {/* STEP 3: NETWORK SELECTION SHEET WITH BRANDED ICONS (Ref Screenshot 166) */}
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
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl ${net.iconBg} border flex items-center justify-center shadow-sm`}>
                      {renderNetworkIcon(net.type, "w-5 h-5")}
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
      </div>
    </div>
  );
};
