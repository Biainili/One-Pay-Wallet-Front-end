import React from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WalletHome } from './components/WalletHome';
import { HistoryView } from './components/HistoryView';
import { SwapModal } from './components/SwapModal';
import { ReferralView } from './components/ReferralView';
import { SettingsView } from './components/SettingsView';
import { DepositModal } from './components/DepositModal';
import { TransferModal } from './components/TransferModal';
import { QrPayModal } from './components/QrPayModal';
import { PasscodeModal } from './components/PasscodeModal';
import { ServicesModal } from './components/ServicesModal';
import { NotificationToast } from './components/NotificationToast';

const AppContent: React.FC = () => {
  const { activeTab } = useWallet();

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col max-w-md mx-auto relative shadow-2xl">
      <Header />
      <NotificationToast />

      <main className="flex-1 px-4">
        {activeTab === 'home' && <WalletHome />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'swap' && <SwapModal />}
        {activeTab === 'referrals' && <ReferralView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Modals */}
      <DepositModal />
      <TransferModal />
      <QrPayModal />
      <PasscodeModal />
      <ServicesModal />

      <Navigation />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}
