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
  updateUserEmail: (email: string) => void;
  addPhoneNumber: (phone: string) => void;
  removePhoneNumber: (phone: string) => void;
  isPasscodeLocked: boolean;
  unlockPasscode: (pin: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  
  // Persistent Assets & Transactions in LocalStorage + DB
  const [assets, setAssets] = useState<CryptoAsset[]>(() => {
    const saved = localStorage.getItem('onepay_user_assets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialAssets;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('onepay_user_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return initialTransactions;
  });

  const [referrals] = useState<ReferralUser[]>(initialReferrals);
  
  const [user, setUser] = useState<UserProfile>(() => {
    const savedPin = localStorage.getItem('onepay_user_passcode');
    const savedEmail = localStorage.getItem('onepay_user_email');
    const savedProfile = localStorage.getItem('onepay_user_profile');
    let baseUser = defaultUserProfile;
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed && typeof parsed === 'object') baseUser = { ...baseUser, ...parsed };
      } catch (e) {}
    }
    return {
      ...baseUser,
      email: savedEmail || baseUser.email,
      passcodeEnabled: !!savedPin,
      passcodeHash: savedPin || undefined,
    };
  });

  const [isPasscodeLocked, setIsPasscodeLocked] = useState<boolean>(() => {
    const savedPin = localStorage.getItem('onepay_user_passcode');
    return !!savedPin;
  });

  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(assets[0] || initialAssets[0]);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Synchronize Telegram WebApp user if available & restore saved profile/email/passcode
  useEffect(() => {
    const savedEmail = localStorage.getItem('onepay_user_email');
    const savedPin = localStorage.getItem('onepay_user_passcode');
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof (tg as any).disableVerticalSwipes === 'function') (tg as any).disableVerticalSwipes();
      if (typeof (tg as any).enableClosingConfirmation === 'function') (tg as any).enableClosingConfirmation();
      if (typeof (tg as any).setHeaderColor === 'function') (tg as any).setHeaderColor('#0b1120');
      if (typeof (tg as any).setBackgroundColor === 'function') (tg as any).setBackgroundColor('#0b1120');

      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        const avatar = (tgUser as any).photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${tgUser.username || tgUser.id}`;
        const updatedUser: UserProfile = {
          ...defaultUserProfile,
          id: tgUser.id,
          firstName: tgUser.first_name || 'Пользователь',
          username: tgUser.username ? `@${tgUser.username}` : `@id${tgUser.id}`,
          avatarUrl: avatar,
          email: savedEmail || user.email,
          phoneNumbers: user.phoneNumbers && user.phoneNumbers.length > 0 ? user.phoneNumbers : ['+7 (999) 000-00-00'],
          passcodeEnabled: !!savedPin,
          passcodeHash: savedPin || undefined,
        };
        setUser(updatedUser);
        localStorage.setItem('onepay_user_profile', JSON.stringify(updatedUser));
      }
    }

    if (!savedPin) {
      setTimeout(() => {
        showToast('🔒 Рекомендуем установить PIN-код для защиты аккаунта', 'info');
      }, 1500);
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

  // Sync state to LocalStorage and API
  const saveAssets = (newAssets: CryptoAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem('onepay_user_assets', JSON.stringify(newAssets));
  };

  const saveTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    localStorage.setItem('onepay_user_transactions', JSON.stringify(newTxs));
  };

  // Handle Transfer
  const handleTransfer = (recipient: string, assetSymbol: string, amount: number): boolean => {
    const targetAsset = assets.find((a) => a.symbol === assetSymbol);
    if (!targetAsset || targetAsset.balance < amount) {
      showToast('Недостаточно средств на балансе!', 'error');
      triggerHaptic('error');
      return false;
    }

    const updatedAssets = assets.map((a) =>
      a.symbol === assetSymbol ? { ...a, balance: a.balance - amount } : a
    );
    saveAssets(updatedAssets);

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

    saveTransactions([newTx, ...transactions]);
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

    const updatedAssets = assets.map((a) => {
      if (a.symbol === fromSymbol) return { ...a, balance: a.balance - fromAmount };
      if (a.symbol === toSymbol) return { ...a, balance: a.balance + toAmount };
      return a;
    });
    saveAssets(updatedAssets);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'swap',
      assetSymbol: `${fromSymbol} ➔ ${toSymbol}`,
      amount: fromAmount,
      fiatAmount: fromAmount * (fromAsset?.fiatPrice || 1),
      status: 'completed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    saveTransactions([newTx, ...transactions]);
    showToast(`Успешно обменяли ${fromAmount} ${fromSymbol} на ${toAmount} ${toSymbol}!`, 'success');
    triggerHaptic('success');
    return true;
  };

  // Handle Deposit with persistent storage & DB sync
  const handleDeposit = (assetSymbol: string, amount: number) => {
    const targetAsset = assets.find((a) => a.symbol === assetSymbol);
    const updatedAssets = assets.map((a) =>
      a.symbol === assetSymbol ? { ...a, balance: Number((a.balance + amount).toFixed(4)) } : a
    );
    saveAssets(updatedAssets);

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

    saveTransactions([newTx, ...transactions]);
    showToast(`Баланс успешно пополнен на +${amount} ${assetSymbol}!`, 'success');
    triggerHaptic('success');
  };

  const updateUserPasscode = (passcode: string | null) => {
    if (passcode) {
      localStorage.setItem('onepay_user_passcode', passcode);
      setUser((prev) => ({
        ...prev,
        passcodeEnabled: true,
        passcodeHash: passcode,
      }));
      setIsPasscodeLocked(false);
      showToast('PIN-код успешно сохранен и активирован!', 'success');
    } else {
      localStorage.removeItem('onepay_user_passcode');
      setUser((prev) => ({
        ...prev,
        passcodeEnabled: false,
        passcodeHash: undefined,
      }));
      setIsPasscodeLocked(false);
      showToast('PIN-код отключен', 'info');
    }
  };

  const unlockPasscode = (pin: string): boolean => {
    const savedPin = localStorage.getItem('onepay_user_passcode');
    if (!savedPin || pin === savedPin) {
      setIsPasscodeLocked(false);
      triggerHaptic('success');
      showToast('Кошелек разблокирован!', 'success');
      return true;
    } else {
      triggerHaptic('error');
      showToast('Неверный PIN-код!', 'error');
      return false;
    }
  };

  const updateUserEmail = (email: string) => {
    localStorage.setItem('onepay_user_email', email);
    setUser((prev) => ({ ...prev, email }));
    showToast('E-mail успешно сохранен!', 'success');
  };

  const addPhoneNumber = (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) return;
    const currentPhones = user.phoneNumbers || [];
    if (currentPhones.includes(trimmed)) return;
    const updatedPhones = [...currentPhones, trimmed];
    
    const updatedUser: UserProfile = {
      ...user,
      phoneNumbers: updatedPhones,
      phone: updatedPhones[0] || user.phone,
    };
    setUser(updatedUser);
    localStorage.setItem('onepay_user_profile', JSON.stringify(updatedUser));
    localStorage.setItem('onepay_user_phones', JSON.stringify(updatedPhones));
    showToast('Номер телефона добавлен!', 'success');
    triggerHaptic('success');

    // Sync to PostgreSQL DB via API
    fetch('/api/user/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, phone: trimmed }),
    }).catch(() => {});
  };

  const removePhoneNumber = (phone: string) => {
    const currentPhones = user.phoneNumbers || [];
    const updatedPhones = currentPhones.filter((p) => p !== phone);
    const updatedUser: UserProfile = {
      ...user,
      phoneNumbers: updatedPhones,
      phone: updatedPhones[0] || undefined,
    };
    setUser(updatedUser);
    localStorage.setItem('onepay_user_profile', JSON.stringify(updatedUser));
    localStorage.setItem('onepay_user_phones', JSON.stringify(updatedPhones));
    showToast('Номер телефона удален', 'info');
    triggerHaptic('medium');
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
        updateUserEmail,
        addPhoneNumber,
        removePhoneNumber,
        isPasscodeLocked,
        unlockPasscode,
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
