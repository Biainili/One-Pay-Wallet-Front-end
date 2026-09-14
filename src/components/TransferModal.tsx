import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  X, ChevronLeft, Search, ChevronDown, Info, 
  CreditCard, Smartphone, Building2, QrCode, Bookmark, 
  Wallet
} from 'lucide-react';

type TransferStep = 
  | 'menu' 
  | 'currency_select' 
  | 'select_asset_and_network' 
  | 'crypto_form' 
  | 'fiat_form' 
  | 'kyc_prompt';

interface CurrencyItem {
  code: string;
  name: string;
  flag: string;
  popular?: boolean;
}

const CURRENCIES: CurrencyItem[] = [
  { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺', popular: true },
  { code: 'USD', name: 'Доллар США', flag: '🇺🇸', popular: true },
  { code: 'KZT', name: 'Казахстанский тенге', flag: '🇰🇿', popular: true },
  { code: 'ARS', name: 'Аргентинское песо', flag: '🇦🇷' },
  { code: 'BRL', name: 'Бразильский реал', flag: '🇧🇷' },
  { code: 'EGP', name: 'Египетский фунт', flag: '🇪🇬' },
  { code: 'KHR', name: 'Камбоджийский риель', flag: '🇰🇭' },
  { code: 'LAK', name: 'Лаосский кип', flag: '🇱🇦' },
  { code: 'MNT', name: 'Монгольский тугрик', flag: '🇲🇳' },
];

interface CryptoOption {
  symbol: string;
  name: string;
  subName: string;
  iconBg: string;
  supported: boolean;
  networks: { id: string; name: string; fee: string }[];
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    symbol: 'USDT',
    name: 'USDT',
    subName: '0 USDT',
    iconBg: 'bg-emerald-500 text-slate-950',
    supported: true,
    networks: [
      { id: 'TON', name: 'TON', fee: '0,50 USDT' },
      { id: 'BEP20', name: 'BEP20', fee: '0,40 USDT' },
      { id: 'TRC20', name: 'TRC20', fee: '2,75 USDT' },
    ]
  },
  {
    symbol: 'GRAM',
    name: 'GRAM',
    subName: '0 GRAM',
    iconBg: 'bg-sky-500 text-white',
    supported: true,
    networks: [
      { id: 'TON', name: 'TON', fee: '0,20 GRAM' }
    ]
  },
  {
    symbol: 'BTC',
    name: 'BTC',
    subName: 'Bitcoin',
    iconBg: 'bg-amber-500 text-slate-950',
    supported: true,
    networks: [
      { id: 'BTC', name: 'Bitcoin', fee: '0,00005 BTC' }
    ]
  },
  {
    symbol: 'ETH',
    name: 'ETH',
    subName: 'Ethereum',
    iconBg: 'bg-slate-700 text-slate-200',
    supported: false,
    networks: []
  }
];

export const TransferModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    assets, 
    handleTransfer, 
    showToast, 
    triggerHaptic 
  } = useWallet();

  const [step, setStep] = useState<TransferStep>('menu');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(CURRENCIES[0]);
  const [searchCurrency, setSearchCurrency] = useState<string>('');
  
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(CRYPTO_OPTIONS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('TRC20');
  
  // Form states
  const [cryptoMode, setCryptoMode] = useState<'address' | 'phone'>('address');
  const [fiatMode, setFiatMode] = useState<'phone' | 'card' | 'bank'>('phone');
  
  const [recipient, setRecipient] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  if (activeModal !== 'transfer') return null;

  const currentAsset = assets.find((a) => a.symbol === selectedCrypto.symbol) || assets[0];

  const handleClose = () => {
    triggerHaptic('light');
    setActiveModal('none');
    setStep('menu');
  };

  const handleCryptoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    if (!recipient.trim() || numAmount <= 0) {
      showToast('Введите корректные реквизиты и сумму!', 'error');
      triggerHaptic('error');
      return;
    }

    const success = handleTransfer(recipient.trim(), selectedCrypto.symbol, numAmount);
    if (success) {
      setRecipient('');
      setAmount('');
      setMemo('');
      setActiveModal('none');
      setStep('menu');
    }
  };

  const handleFiatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    if (!recipient.trim() || numAmount <= 0) {
      showToast('Введите реквизиты и сумму!', 'error');
      triggerHaptic('error');
      return;
    }
    // Trigger KYC requirements check as shown in Photo 206
    setStep('kyc_prompt');
  };

  const handleSetMax = () => {
    triggerHaptic('light');
    setAmount(currentAsset.balance.toString());
  };

  const filteredCurrencies = CURRENCIES.filter(
    (c) => c.name.toLowerCase().includes(searchCurrency.toLowerCase()) || c.code.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-[#0b101d] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-slate-800/80 p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl relative">
        
        {/* STEP 1: MAIN WITHDRAWAL MENU (Ref Photo 209) */}
        {step === 'menu' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-xl font-extrabold text-white tracking-tight">Вывести</h2>
              <button onClick={handleClose} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currency Selector Bar */}
            <div className="flex items-center justify-between bg-[#131b2e] border border-slate-800 rounded-2xl p-3.5">
              <span className="text-xs font-semibold text-slate-400">Методы вывода для</span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('currency_select');
                }}
                className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                <span>{selectedCurrency.flag} {selectedCurrency.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Section 1: FIAT */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">В ФИАТ</span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setFiatMode('phone');
                  setStep('fiat_form');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">По телефону</div>
                    <div className="text-xs text-blue-400 font-medium">Без комиссии</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setFiatMode('card');
                  setStep('fiat_form');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">На карту</div>
                    <div className="text-xs text-sky-400 font-medium">Без комиссии</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>
            </div>

            {/* Section 2: CRYPTO ASSETS */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">В АКТИВЫ</span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setStep('select_asset_and_network');
                }}
                className="w-full flex items-center justify-between p-4 bg-[#131b2e] border border-slate-800/90 rounded-2xl hover:bg-[#18233c] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">На внешний кошелёк</div>
                    <div className="text-xs text-slate-400">Комиссия от 0 USD</div>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CURRENCY SELECTOR (Ref Photo 208) */}
        {step === 'currency_select' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button onClick={() => setStep('menu')} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-white">Выберите валюту</h2>
              <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Код или название валюты"
                value={searchCurrency}
                onChange={(e) => setSearchCurrency(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Popular Currencies */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">ПОПУЛЯРНЫЕ</span>
              <div className="bg-[#131b2e] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
                {filteredCurrencies.filter((c) => c.popular).map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCurrency(curr);
                      setStep('menu');
                    }}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{curr.flag}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{curr.code}</div>
                        <div className="text-xs text-slate-400">{curr.name}</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedCurrency.code === curr.code ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                      {selectedCurrency.code === curr.code && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Other Currencies */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase px-1">ДРУГИЕ</span>
              <div className="bg-[#131b2e] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                {filteredCurrencies.filter((c) => !c.popular).map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedCurrency(curr);
                      setStep('menu');
                    }}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{curr.flag}</span>
                      <div>
                        <div className="text-sm font-bold text-white">{curr.code}</div>
                        <div className="text-xs text-slate-400">{curr.name}</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedCurrency.code === curr.code ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                      {selectedCurrency.code === curr.code && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELECT ASSET AND NETWORK (Ref Photos 199, 200, 203, 204) */}
        {step === 'select_asset_and_network' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button onClick={() => setStep('menu')} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-white">Перевод</h2>
              <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Selection Horizontal Carousel */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">Выберите цифровой актив</span>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {CRYPTO_OPTIONS.map((crypto) => {
                  const isSelected = selectedCrypto.symbol === crypto.symbol;
                  return (
                    <button
                      key={crypto.symbol}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedCrypto(crypto);
                        if (crypto.networks.length > 0) {
                          setSelectedNetwork(crypto.networks[0].id);
                        }
                      }}
                      className={`flex-shrink-0 w-28 p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-slate-900 border-white text-white shadow-glow'
                          : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${crypto.iconBg} flex items-center justify-center font-bold text-xs mb-3 shadow-sm`}>
                        {crypto.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{crypto.name}</div>
                        <div className="text-[10px] text-slate-400">{crypto.subName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If Selected Asset is NOT supported (Ref Photo 199 ETH warning) */}
            {!selectedCrypto.supported ? (
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-2">
                <p>На данный момент выбранная монета не поддерживается. Следите за обновлениями в нашем <a href="https://t.me" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">Telegram канале</a>.</p>
              </div>
            ) : (
              /* Network Selection List (Ref Photo 203, 204) */
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">Выберите сеть</span>
                <div className="bg-[#131b2e] border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
                  {selectedCrypto.networks.map((net) => (
                    <button
                      key={net.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedNetwork(net.id);
                      }}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {net.id.substring(0, 3)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{net.name}</div>
                          <div className="text-xs text-slate-400">Комиссия до {net.fee}</div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedNetwork === net.id ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                        {selectedNetwork === net.id && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!selectedCrypto.supported}
              onClick={() => {
                triggerHaptic('light');
                setStep('crypto_form');
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-glow disabled:opacity-50"
            >
              Продолжить
            </button>
          </div>
        )}

        {/* STEP 4: CRYPTO FORM (Ref Photos 201, 202, 205) */}
        {step === 'crypto_form' && (
          <form onSubmit={handleCryptoSubmit} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button type="button" onClick={() => setStep('select_asset_and_network')} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-white">Перевод {selectedCrypto.symbol} ({selectedNetwork})</h2>
              <button type="button" onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121c33] to-[#1a2847] border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">c Antarctic Wallet</span>
                <span className="text-lg font-extrabold text-white tracking-tight">{currentAsset.balance} {selectedCrypto.symbol}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                🐧
              </div>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 bg-[#131b2e] p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCryptoMode('address')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cryptoMode === 'address' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>По адресу</span>
              </button>
              <button
                type="button"
                onClick={() => setCryptoMode('phone')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  cryptoMode === 'phone' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>По телефону</span>
              </button>
            </div>

            {/* Inputs Container */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-3">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={cryptoMode === 'address' ? `На: Адрес ${selectedCrypto.symbol} в сети ${selectedNetwork}` : 'Номер телефона получателя'}
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-3.5 pr-20 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2 text-slate-400">
                    <QrCode className="w-4 h-4 hover:text-white cursor-pointer" />
                    <Bookmark className="w-4 h-4 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Memo input for TON network (Ref Photo 202) */}
              {selectedNetwork === 'TON' && (
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Комментарий, тэг или мемо"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 flex items-start gap-1 pt-1">
                    <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Ваш комментарий виден всем. Он может требоваться при переводе средств на биржу.</span>
                  </p>
                </div>
              )}

              {/* Network Fee Info Row */}
              <div className="pt-2 border-t border-slate-800/60 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Сеть</span>
                  <span className="text-white font-bold">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span>Комиссия</span>
                  <span className="text-white font-bold">
                    {selectedNetwork === 'TRC20' ? '2,75 USDT' : selectedNetwork === 'TON' ? '0,50 USDT' : '0,40 USDT'}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount Input Row */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 flex items-center justify-between">
              <input
                type="number"
                step="any"
                placeholder="Любая сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-none text-sm text-white focus:outline-none font-bold font-mono w-full"
                required
              />
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs font-bold text-cyan-400 hover:underline flex-shrink-0"
              >
                {selectedCrypto.symbol} Макс
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-glow"
            >
              Продолжить
            </button>
          </form>
        )}

        {/* STEP 5: FIAT FORM (Ref Photo 207) */}
        {step === 'fiat_form' && (
          <form onSubmit={handleFiatSubmit} className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button type="button" onClick={() => setStep('menu')} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-white">Вывести в фиат</h2>
              <button type="button" onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Balance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121c33] to-[#1a2847] border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">С баланса Digital Dollar</span>
                <span className="text-lg font-extrabold text-white tracking-tight">{currentAsset.balance} USD</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                $
              </div>
            </div>

            {/* Fiat Mode Toggle */}
            <div className="grid grid-cols-3 gap-2 bg-[#131b2e] p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFiatMode('phone')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  fiatMode === 'phone' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Телефон</span>
              </button>
              <button
                type="button"
                onClick={() => setFiatMode('card')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  fiatMode === 'card' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Карта</span>
              </button>
              <button
                type="button"
                onClick={() => setFiatMode('bank')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  fiatMode === 'bank' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Счёт</span>
              </button>
            </div>

            {/* Recipient Input */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800">
              <input
                type="text"
                placeholder={fiatMode === 'phone' ? 'Номер телефона получателя' : fiatMode === 'card' ? 'Номер карты получателя' : 'Номер счёта получателя'}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                required
              />
            </div>

            {/* Amount Input & Info */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  placeholder="0 USD"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none text-sm text-white focus:outline-none font-bold font-mono w-full"
                  required
                />
                <button type="button" onClick={handleSetMax} className="text-xs font-bold text-cyan-400 hover:underline">
                  Макс
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                Курс и сумма к получению будут рассчитаны после ввода реквизитов получателя
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-glow"
            >
              Продолжить
            </button>
          </form>
        )}

        {/* STEP 6: KYC PROMPT SCREEN (Ref Photo 206) */}
        {step === 'kyc_prompt' && (
          <div className="space-y-4 animate-fade-in text-center">
            <div className="flex justify-end">
              <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mascot Graphic Illustration */}
            <div className="w-full h-40 rounded-3xl bg-gradient-to-b from-sky-400 to-blue-600 flex flex-col items-center justify-center p-4 relative overflow-hidden shadow-lg border border-sky-300/30">
              <div className="text-5xl mb-1">🐧</div>
              <span className="text-xs font-extrabold text-white uppercase tracking-wider bg-slate-950/40 px-3 py-1 rounded-full border border-white/20">
                PASSPORT KYC
              </span>
            </div>

            <div className="space-y-2 text-left">
              <h2 className="text-lg font-extrabold text-white leading-snug">
                Чтобы продолжить, вам необходимо соответствовать следующим требованиям
              </h2>
            </div>

            {/* Requirements Box */}
            <div className="p-4 rounded-2xl bg-[#131b2e] border border-slate-800 text-left space-y-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Требования</span>
              
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">1</span>
                  <span>KYC пройден по паспорту РФ или стран СНГ</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">2</span>
                  <span>Подтверждён адрес</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">3</span>
                  <span>Номер телефона российского оператора</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-left px-1">
              В будущем доступность функционала будет расширена для большего количества пользователей
            </p>

            <button
              onClick={() => {
                triggerHaptic('success');
                showToast('Запрос верификации KYC отправлен в систему!', 'info');
                handleClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-glow"
            >
              Пройти KYC
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
