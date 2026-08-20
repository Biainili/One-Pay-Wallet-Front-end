import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, Gamepad2, CreditCard, Smartphone, Globe, CheckCircle } from 'lucide-react';

export const ServicesModal: React.FC = () => {
  const { activeModal, setActiveModal, handleTransfer, showToast, triggerHaptic } = useWallet();
  const [selectedService, setSelectedService] = useState<'steam' | 'card' | 'mobile' | 'alipay'>('steam');
  const [targetAccount, setTargetAccount] = useState<string>('');
  const [amountUsdt, setAmountUsdt] = useState<string>('');

  if (activeModal !== 'services') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountUsdt) || 0;
    if (!targetAccount || numAmount <= 0) return;

    const success = handleTransfer(`Сервис: ${selectedService.toUpperCase()} (${targetAccount})`, 'USDT', numAmount);
    if (success) {
      showToast(`Заказ пополнения ${selectedService.toUpperCase()} успешно создан!`, 'success');
      setTargetAccount('');
      setAmountUsdt('');
      setActiveModal('none');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-t-3xl sm:rounded-3xl border border-slate-700/80 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-100">Финансовые Сервисы</h2>
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

        {/* Service Type Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedService('steam');
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              selectedService === 'steam'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold">Steam</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedService('card');
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              selectedService === 'card'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold">Вирт. Карта</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedService('mobile');
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              selectedService === 'mobile'
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold">Мобильный</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setSelectedService('alipay');
            }}
            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
              selectedService === 'alipay'
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Globe className="w-5 h-5 text-red-400" />
            <span className="text-xs font-bold">AliPay CNY</span>
          </button>
        </div>

        {/* Service Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {selectedService === 'steam' && 'Логин аккаунта Steam:'}
              {selectedService === 'card' && 'Имя держателя для вывода:'}
              {selectedService === 'mobile' && 'Номер телефона (+7...):'}
              {selectedService === 'alipay' && 'AliPay Account ID / Email:'}
            </label>
            <input
              type="text"
              placeholder="Введите данные..."
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Сумма пополнения (USDT):</label>
            <input
              type="number"
              step="any"
              placeholder="10.00"
              value={amountUsdt}
              onChange={(e) => setAmountUsdt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono font-bold"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-glow text-xs flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Оплатить Сервис</span>
          </button>
        </form>
      </div>
    </div>
  );
};
