import React from 'react';
import { Gift } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface GiftFloatingButtonProps {
  onClick: () => void;
}

export const GiftFloatingButton: React.FC<GiftFloatingButtonProps> = ({ onClick }) => {
  const { triggerHaptic } = useWallet();

  return (
    <button
      onClick={() => {
        triggerHaptic('medium');
        onClick();
      }}
      className="fixed bottom-20 right-4 z-40 p-3.5 bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center border border-purple-400/30"
      aria-label="Рефералы и подарки"
    >
      <Gift className="w-6 h-6 animate-pulse" />
    </button>
  );
};
