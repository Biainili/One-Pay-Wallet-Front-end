import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { History, Plus, Send, ArrowLeftRight, Gamepad2, Search, Copy } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { transactions, showToast, triggerHaptic } = useWallet();

  const [filter, setFilter] = useState<'all' | 'deposit' | 'transfer' | 'swap' | 'payment'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTx = transactions.filter((tx) => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch =
      tx.assetSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.recipientOrSender && tx.recipientOrSender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const copyTxHash = (hash?: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    triggerHaptic('success');
    showToast('Хэш транзакции скопирован!', 'success');
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100">История Транзакций</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">{filteredTx.length} записей</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск по символу, получателю или хэшу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'Все' },
          { id: 'deposit', label: 'Пополнения' },
          { id: 'transfer', label: 'Переводы' },
          { id: 'swap', label: 'Обмен' },
          { id: 'payment', label: 'Оплаты' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => {
              triggerHaptic('light');
              setFilter(btn.id as any);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === btn.id
                ? 'bg-cyan-500 text-slate-950 shadow-glow'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTx.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <History className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-xs font-medium">Транзакции не найдены</p>
          </div>
        ) : (
          filteredTx.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl glass-card border border-slate-800 space-y-2 hover:bg-slate-800/70 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      tx.type === 'deposit'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : tx.type === 'transfer'
                        ? 'bg-blue-500/15 text-blue-400'
                        : tx.type === 'swap'
                        ? 'bg-indigo-500/15 text-indigo-400'
                        : 'bg-purple-500/15 text-purple-400'
                    }`}
                  >
                    {tx.type === 'deposit' ? (
                      <Plus className="w-5 h-5" />
                    ) : tx.type === 'transfer' ? (
                      <Send className="w-5 h-5" />
                    ) : tx.type === 'swap' ? (
                      <ArrowLeftRight className="w-5 h-5" />
                    ) : (
                      <Gamepad2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs capitalize flex items-center gap-1.5">
                      <span>{tx.type}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {tx.assetSymbol}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.recipientOrSender || 'Сеть кошелька'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono font-bold text-xs ${
                      tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.assetSymbol.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ≈ ${tx.fiatAmount.toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* Status & TxHash Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <span className="text-slate-500">{tx.timestamp}</span>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-semibold">
                    {tx.status}
                  </span>
                  {tx.txHash && (
                    <button
                      onClick={() => copyTxHash(tx.txHash)}
                      className="text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{tx.txHash}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
