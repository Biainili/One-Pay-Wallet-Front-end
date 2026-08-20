import React from 'react';
import { useWallet } from '../context/WalletContext';
import { TabType } from '../types';
import { Wallet, History, ArrowLeftRight, Users, Settings } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useWallet();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Главная', icon: <Wallet className="w-5 h-5" /> },
    { id: 'history', label: 'История', icon: <History className="w-5 h-5" /> },
    { id: 'swap', label: 'Обмен', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'referrals', label: 'Друзья', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Опции', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-panel border-t border-slate-800/80 px-2 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-cyan-400 rounded-full shadow-glowBlue" />
              )}
              <div className={`p-1 rounded-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
