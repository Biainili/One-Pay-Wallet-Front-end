import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Lock, Delete, X } from 'lucide-react';

export const PasscodeModal: React.FC = () => {
  const { activeModal, setActiveModal, user, updateUserPasscode, triggerHaptic } = useWallet();
  const [pin, setPin] = useState<string>('');

  if (activeModal !== 'passcode') return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      triggerHaptic('light');
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        triggerHaptic('success');
        setTimeout(() => {
          updateUserPasscode(newPin);
          setPin('');
          setActiveModal('none');
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic('medium');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleDisablePasscode = () => {
    triggerHaptic('medium');
    updateUserPasscode(null);
    setPin('');
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-xs glass-panel rounded-3xl border border-slate-700/80 p-6 space-y-6 text-center">
        <div className="flex justify-end">
          <button
            onClick={() => {
              triggerHaptic('light');
              setPin('');
              setActiveModal('none');
            }}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-glow">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            {user.passcodeEnabled ? 'Введение PIN-кода' : 'Установите PIN-код'}
          </h2>
          <p className="text-xs text-slate-400">Введите 4 цифры для защиты вашего кошелька</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                pin.length > index
                  ? 'bg-cyan-400 border-cyan-400 scale-110 shadow-glowBlue'
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-bold text-xl hover:bg-slate-800 active:scale-95 transition-all mx-auto flex items-center justify-center font-mono"
            >
              {num}
            </button>
          ))}

          {user.passcodeEnabled ? (
            <button
              onClick={handleDisablePasscode}
              className="col-span-1 text-[10px] text-red-400 font-bold hover:underline self-center"
            >
              Сброс
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 font-bold text-xl hover:bg-slate-800 active:scale-95 transition-all mx-auto flex items-center justify-center font-mono"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 active:scale-95 transition-all mx-auto flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
