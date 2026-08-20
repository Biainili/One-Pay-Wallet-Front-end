export type TabType = 'home' | 'history' | 'swap' | 'referrals' | 'settings';

export type ActiveModal = 'none' | 'deposit' | 'transfer' | 'swap' | 'qr_pay' | 'passcode' | 'services';

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: number;
  fiatPrice: number;
  change24h: number;
  iconBg: string;
  depositAddress: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'swap' | 'payment';
  assetSymbol: string;
  amount: number;
  fiatAmount: number;
  recipientOrSender?: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  txHash?: string;
}

export interface ReferralUser {
  id: string;
  username: string;
  joinedAt: string;
  earnedUSDT: number;
  tier: number;
}

export interface UserProfile {
  id: number;
  firstName: string;
  username?: string;
  avatarUrl?: string;
  preferredCurrency: 'USD' | 'EUR' | 'RUB' | 'KGS';
  passcodeEnabled: boolean;
  passcodeHash?: string;
  kycLevel: 'Basic' | 'Verified' | 'Pro';
  refLink: string;
  refCount: number;
  totalRefEarningsUSDT: number;
}
