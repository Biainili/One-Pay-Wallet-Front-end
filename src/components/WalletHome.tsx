import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  Plus, 
  Send, 
  ArrowLeftRight, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Smartphone, 
  Gamepad2, 
  Globe,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const WalletHome: React.FC = () => {
  const { 
    totalBalanceUsdt, 
    assets, 
    transactions, 
    setActiveModal, 
    setSelectedAsset, 
    setActiveTab, 
    user,
    triggerHaptic 
  } = useWallet();

  const [hideBalance, setHideBalance] = useState<boolean>(false);

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 p-6 border border-cyan-500/20 shadow-glow">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Общий Баланс</span>
            <button 
              onClick={() => {
                triggerHaptic('light');
                setHideBalance(!hideBalance);
              }} 
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> VASP Certified
          </span>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-black text-slate-100 tracking-tight flex items-baseline gap-2">
            {hideBalance ? (
              <span>••••••••</span>
            ) : (
              <>
                <span>${totalBalanceUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-xs text-slate-400 font-medium">USDT</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            ≈ {hideBalance ? '••••' : `₹ ${(totalBalanceUsdt * 89.2).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} RUB`} ({user.preferredCurrency})
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('deposit');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold mt-1.5">Пополнить</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('transfer');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1.5">Отправить</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveTab('swap');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1.5">Обменять</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('qr_pay');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all active:scale-95 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1.5">QR Оплата</span>
          </button>
        </div>
      </div>

      {/* Services Grid (Nexus Specific Feature: Merchant Payments, Steam, Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-200">Быстрая Оплата и Сервисы</h2>
          <button 
            onClick={() => {
              triggerHaptic('light');
              setActiveModal('services');
            }}
            className="text-xs text-cyan-400 font-semibold flex items-center hover:underline"
          >
            Все (4) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('services');
            }}
            className="flex items-center gap-3 p-3 rounded-2xl glass-card hover:bg-slate-800/80 transition-all text-left border border-slate-800"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Steam Пополнение</div>
              <div className="text-[10px] text-slate-400">Мгновенно по логину</div>
            </div>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('services');
            }}
            className="flex items-center gap-3 p-3 rounded-2xl glass-card hover:bg-slate-800/80 transition-all text-left border border-slate-800"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Виртуальная Карта</div>
              <div className="text-[10px] text-slate-400">Visa / Mastercard</div>
            </div>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('services');
            }}
            className="flex items-center gap-3 p-3 rounded-2xl glass-card hover:bg-slate-800/80 transition-all text-left border border-slate-800"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">One Pay Store</div>
              <div className="text-[10px] text-slate-400">Покупка мерча</div>
            </div>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveModal('services');
            }}
            className="flex items-center gap-3 p-3 rounded-2xl glass-card hover:bg-slate-800/80 transition-all text-left border border-slate-800"
          >
            <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">AliPay / Фиат</div>
              <div className="text-[10px] text-slate-400">Крипта ➔ CNY/Fiat</div>
            </div>
          </button>
        </div>
      </div>

      {/* Crypto Assets List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-200">Мои Активы</h2>
          <span className="text-xs text-slate-400 font-mono">{assets.length} Монеты</span>
        </div>

        <div className="space-y-2.5">
          {assets.map((asset) => {
            const assetTotalFiat = asset.balance * asset.fiatPrice;
            const isPositive = asset.change24h >= 0;

            return (
              <div
                key={asset.id}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedAsset(asset);
                  setActiveModal('deposit');
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl glass-card hover:bg-slate-800/90 transition-all cursor-pointer border border-slate-800/80 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm border ${asset.iconBg}`}>
                    {asset.symbol.substring(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{asset.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {asset.network}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>${asset.fiatPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span className={`flex items-center text-[11px] font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {isPositive ? `+${asset.change24h}%` : `${asset.change24h}%`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-100 text-sm font-mono">
                    {hideBalance ? '••••' : asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} {asset.symbol}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {hideBalance ? '••••' : `≈ $${assetTotalFiat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Widget */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-200">Последняя Активность</h2>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('history');
            }}
            className="text-xs text-cyan-400 font-semibold flex items-center hover:underline"
          >
            Вся история ({transactions.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-2xl glass-card border border-slate-800/60 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' :
                  tx.type === 'transfer' ? 'bg-blue-500/10 text-blue-400' :
                  tx.type === 'swap' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  {tx.type === 'deposit' ? <Plus className="w-4 h-4" /> :
                   tx.type === 'transfer' ? <Send className="w-4 h-4" /> :
                   tx.type === 'swap' ? <ArrowLeftRight className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-semibold text-slate-200 capitalize">{tx.type} • {tx.assetSymbol}</div>
                  <div className="text-[10px] text-slate-400">{tx.timestamp}</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-slate-200">
                {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.assetSymbol.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
