import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabType, ActiveModal, CryptoAsset, Transaction, ReferralUser, UserProfile } from '../types';
import { initialAssets, initialTransactions, initialReferrals, defaultUserProfile } from '../services/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface WalletContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
  assets: CryptoAsset[];
  transactions: Transaction[];
  referrals: ReferralUser[];
  user: UserProfile;
  selectedAsset: CryptoAsset;
  setSelectedAsset: (asset: CryptoAsset) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  totalBalanceUsdt: number;
  handleTransfer: (recipient: string, assetSymbol: string, amount: number) => boolean;
  handleSwap: (fromAssetSymbol: string, toAssetSymbol: string, fromAmount: number, toAmount: number) => boolean;
  handleDeposit: (assetSymbol: string, amount: number) => void;
  updateUserPasscode: (passcode: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [assets, setAssets] = useState<CryptoAsset[]>(initialAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [referrals] = useState<ReferralUser[]>(initialReferrals);
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(initialAssets[0]);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Synchronize Telegram WebApp user if available
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser((prev) => ({
          ...prev,
          id: tgUser.id,
          firstName: tgUser.first_name || prev.firstName,
          username: tgUser.username ? `@${tgUser.username}` : prev.username,
        }));
      }
    }
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      if (type === 'success' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type === 'success' ? 'success' : 'error');
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const setActiveTab = (tab: TabType) => {
    triggerHaptic('light');
    setActiveTabState(tab);
  };

  // Calculate Total USD Balance
  const totalBalanceUsdt = assets.reduce((sum, asset) => {
    return sum + asset.balance * asset.fiatPrice;
  }, 0);

  // Handle Transfer
  const handleTransfer = (recipient: string, assetSymbol: string, amount: number): boolean => {
    const targetAsset = assets.find((a) => a.symbol === assetSymbol);
    if (!targetAsset || targetAsset.balance < amount) {
      showToast('Недостаточно средств на балансе!', 'error');
      triggerHaptic('error');
      return false;
    }

    setAssets((prev) =>
      prev.map((a) => (a.symbol === assetSymbol ? { ...a, balance: a.balance - amount } : a))
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'transfer',
      assetSymbol,
      amount,
      fiatAmount: amount * targetAsset.fiatPrice,
      recipientOrSender: recipient,
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Успешно отправлено ${amount} ${assetSymbol} для ${recipient}!`, 'success');
    triggerHaptic('success');
    return true;
  };

  // Handle Swap
  const handleSwap = (
    fromSymbol: string,
    toSymbol: string,
    fromAmount: number,
    toAmount: number
  ): boolean => {
    const fromAsset = assets.find((a) => a.symbol === fromSymbol);
    if (!fromAsset || fromAsset.balance < fromAmount) {
      showToast('Недостаточно средств для обмена!', 'error');
      triggerHaptic('error');
      return false;
    }

    setAssets((prev) =>
      prev.map((a) => {
        if (a.symbol === fromSymbol) return { ...a, balance: a.balance - fromAmount };
        if (a.symbol === toSymbol) return { ...a, balance: a.balance + toAmount };
        return a;
      })
    );

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'swap',
      assetSymbol: `${fromSymbol} ➔ ${toSymbol}`,
      amount: fromAmount,
      fiatAmount: fromAmount * (fromAsset?.fiatPrice || 1),
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Успешно обменяли ${fromAmount} ${fromSymbol} на ${toAmount} ${toSymbol}!`, 'success');
    triggerHaptic('success');
    return true;
  };

  // Handle Deposit
  const handleDeposit = (assetSymbol: string, amount: number) => {
    setAssets((prev) =>
      prev.map((a) => (a.symbol === assetSymbol ? { ...a, balance: a.balance + amount } : a))
    );
    const targetAsset = assets.find((a) => a.symbol === assetSymbol);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      assetSymbol,
      amount,
      fiatAmount: amount * (targetAsset?.fiatPrice || 1),
      recipientOrSender: 'Пополнение счета',
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Баланс пополнен на ${amount} ${assetSymbol}!`, 'success');
    triggerHaptic('success');
  };

  const updateUserPasscode = (passcode: string | null) => {
    setUser((prev) => ({
      ...prev,
      passcodeEnabled: !!passcode,
      passcodeHash: passcode || undefined,
    }));
    showToast(passcode ? 'PIN-код успешно установлен!' : 'PIN-код отключен', 'info');
  };

  return (
    <WalletContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeModal,
        setActiveModal,
        assets,
        transactions,
        referrals,
        user,
        selectedAsset,
        setSelectedAsset,
        toasts,
        showToast,
        triggerHaptic,
        totalBalanceUsdt,
        handleTransfer,
        handleSwap,
        handleDeposit,
        updateUserPasscode,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
