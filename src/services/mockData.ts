import { CryptoAsset, Transaction, ReferralUser, UserProfile } from '../types';

export const initialAssets: CryptoAsset[] = [
  {
    id: 'usdt-ton',
    name: 'Tether USDT',
    symbol: 'USDT',
    network: 'TON Network',
    balance: 1450.50,
    fiatPrice: 1.00,
    change24h: 0.01,
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    depositAddress: 'EQD8uX8_EXAMPLE_TON_USDT_ADDRESS_NEXUS_777',
  },
  {
    id: 'ton-native',
    name: 'Toncoin',
    symbol: 'TON',
    network: 'TON Blockchain',
    balance: 320.75,
    fiatPrice: 6.85,
    change24h: 4.25,
    iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    depositAddress: 'EQBvW8unEXAMPLE_TON_ADDRESS_NEXUS_999',
  },
  {
    id: 'btc-native',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin',
    balance: 0.042,
    fiatPrice: 64200.00,
    change24h: -1.20,
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  },
  {
    id: 'usdt-trc20',
    name: 'USDT TRC-20',
    symbol: 'USDT-TRC20',
    network: 'TRON Network',
    balance: 500.00,
    fiatPrice: 1.00,
    change24h: 0.00,
    iconBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    depositAddress: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MDEFg1',
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-101',
    type: 'deposit',
    assetSymbol: 'USDT',
    amount: 500.00,
    fiatAmount: 500.00,
    recipientOrSender: 'External Wallet (TON)',
    status: 'completed',
    timestamp: '2026-08-03 14:32',
    txHash: '0x8f3c...9a21'
  },
  {
    id: 'tx-102',
    type: 'transfer',
    assetSymbol: 'TON',
    amount: 15.0,
    fiatAmount: 102.75,
    recipientOrSender: '@crypto_merchant_bot',
    status: 'completed',
    timestamp: '2026-08-03 11:15',
    txHash: '0x12ab...77ff'
  },
  {
    id: 'tx-103',
    type: 'swap',
    assetSymbol: 'USDT -> TON',
    amount: 200.00,
    fiatAmount: 200.00,
    status: 'completed',
    timestamp: '2026-08-02 19:40',
  },
  {
    id: 'tx-104',
    type: 'payment',
    assetSymbol: 'USDT',
    amount: 24.99,
    fiatAmount: 24.99,
    recipientOrSender: 'Steam Voucher Top-up',
    status: 'completed',
    timestamp: '2026-08-01 09:20',
  }
];

export const initialReferrals: ReferralUser[] = [
  { id: 'ref-1', username: '@alex_crypto', joinedAt: '2026-07-28', earnedUSDT: 14.50, tier: 1 },
  { id: 'ref-2', username: '@dmitry_v', joinedAt: '2026-07-30', earnedUSDT: 8.20, tier: 1 },
  { id: 'ref-3', username: '@elena_trade', joinedAt: '2026-08-01', earnedUSDT: 22.10, tier: 1 },
  { id: 'ref-4', username: '@sergey_99', joinedAt: '2026-08-02', earnedUSDT: 3.40, tier: 2 },
];

export const defaultUserProfile: UserProfile = {
  id: 777123456,
  firstName: 'Crypto User',
  username: '@onepay_holder',
  avatarUrl: '',
  preferredCurrency: 'USD',
  passcodeEnabled: false,
  kycLevel: 'Verified',
  refLink: 'https://t.me/onepay_wallet_bot?startapp=ref_777123456',
  refCount: 14,
  totalRefEarningsUSDT: 48.20,
};
