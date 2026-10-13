// ============================================================
// API Service — connects Frontend to Backend (port 4000)
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getTelegramId(): string {
  const tg = (window as any).Telegram?.WebApp;
  return String(tg?.initDataUnsafe?.user?.id || '999888777');
}

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-telegram-id': getTelegramId(),
  };
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...(options?.headers || {}) },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'API error');
  return data as T;
}

export async function fetchUserProfile() {
  return apiFetch<{ success: true; user: any }>('/api/user/profile');
}

export async function fetchWalletData() {
  return apiFetch<{ success: true; wallets: any[]; transactions: any[] }>('/api/wallet/data');
}

export async function fetchCashbackHistory() {
  return apiFetch<{ success: true; cashback: any[] }>('/api/cashback/history');
}

export async function fetchVirtualCards() {
  return apiFetch<{ success: true; cards: any[] }>('/api/virtual-card');
}

export async function createVirtualCard(payload: {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  token?: string;
}) {
  return apiFetch<{ success: true; card: any }>('/api/virtual-card', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function addPhoneApi(userId: number, phone: string) {
  return apiFetch<{ success: true }>('/api/user/phone', {
    method: 'POST',
    body: JSON.stringify({ userId, phone }),
  });
}

export async function fetchReferrals() {
  return apiFetch<{ success: true; referralLink: string; qrCodeUrl: string; referrals: any[] }>(
    '/api/referrals'
  );
}
