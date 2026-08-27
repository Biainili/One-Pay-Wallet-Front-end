import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { WalletHome } from './components/WalletHome';
import { HistoryView } from './components/HistoryView';
import { SwapModal } from './components/SwapModal';
import { ReferralView } from './components/ReferralView';
import { SettingsView } from './components/SettingsView';
import { AccountSettingsView } from './components/AccountSettingsView';
import { DepositModal } from './components/DepositModal';
import { TransferModal } from './components/TransferModal';
import { QrPayModal } from './components/QrPayModal';
import { PasscodeModal } from './components/PasscodeModal';
import { ServicesModal } from './components/ServicesModal';
import { NotificationToast } from './components/NotificationToast';
import { EmailOnboardingModal } from './components/EmailOnboardingModal';
import { GiftFloatingButton } from './components/GiftFloatingButton';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useWallet();
  const [currentView, setCurrentView] = useState<'main' | 'account'>('main');
  const [showEmailModal, setShowEmailModal] = useState(true);

  const handleEmailSubmit = (_email: string) => {
    setShowEmailModal(false);
  };

  if (currentView === 'account') {
    return (
      <div className="min-h-screen bg-brand-dark text-slate-100 max-w-md mx-auto relative shadow-2xl">
        <NotificationToast />
        <AccountSettingsView onBack={() => setCurrentView('main')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col max-w-md mx-auto relative shadow-2xl">
      <Header onOpenAccount={() => setCurrentView('account')} />
      <NotificationToast />

      <main className="flex-1 px-4">
        {activeTab === 'home' && <WalletHome />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'swap' && <SwapModal />}
        {activeTab === 'referrals' && <ReferralView onBack={() => setActiveTab('home')} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Floating Gift Button */}
      {activeTab === 'home' && (
        <GiftFloatingButton onClick={() => setActiveTab('referrals')} />
      )}

      {/* Modals */}
      <EmailOnboardingModal
        isOpen={showEmailModal}
        onSubmitEmail={handleEmailSubmit}
      />
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
