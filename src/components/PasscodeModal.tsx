import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Lock, Delete, X, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';

export const PasscodeModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    user, 
    updateUserPasscode, 
    showToast, 
    triggerHaptic, 
    isPasscodeLocked, 
    unlockPasscode 
  } = useWallet();

  const [pin, setPin] = useState<string>('');
  const [errorAnim, setErrorAnim] = useState<boolean>(false);
  
  // State for PIN change/reset verification flow:
  // 'verify_current' = ask for current PIN first before allowing reset/change
  // 'create_new' = ask for new 4-digit PIN
  // 'choose_action' = current PIN verified, choose to disable or enter new PIN
  const [changeStage, setChangeStage] = useState<'verify_current' | 'choose_action' | 'create_new'>('verify_current');

  const isLockedMode = isPasscodeLocked;
  const isOpen = isLockedMode || activeModal === 'passcode';

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      triggerHaptic('light');
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        setTimeout(() => {
          // 1. App Launch Lock Screen Mode
          if (isLockedMode) {
            const success = unlockPasscode(newPin);
            if (!success) {
              setErrorAnim(true);
              setTimeout(() => {
                setPin('');
                setErrorAnim(false);
              }, 400);
            } else {
              setPin('');
            }
            return;
          }

          // 2. Settings Mode: If user already has a PIN, verify current PIN first!
          if (user.passcodeEnabled && changeStage === 'verify_current') {
            const savedPin = localStorage.getItem('onepay_user_passcode');
            if (newPin === savedPin) {
              triggerHaptic('success');
              showToast('Текущий PIN-код подтвержден', 'success');
              setPin('');
              setChangeStage('choose_action');
            } else {
              triggerHaptic('error');
              showToast('Неверный текущий PIN-код!', 'error');
              setErrorAnim(true);
              setTimeout(() => {
                setPin('');
                setErrorAnim(false);
              }, 400);
            }
            return;
          }

          // 3. Creating/Setting new PIN or setting for first time
          if (!user.passcodeEnabled || changeStage === 'create_new') {
            triggerHaptic('success');
            updateUserPasscode(newPin);
            setPin('');
            setChangeStage('verify_current');
            setActiveModal('none');
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    triggerHaptic('medium');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirmDisable = () => {
    triggerHaptic('medium');
    updateUserPasscode(null);
    setPin('');
    setChangeStage('verify_current');
    setActiveModal('none');
  };

  const handleClose = () => {
    triggerHaptic('light');
    setPin('');
    setChangeStage('verify_current');
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in font-sans">
      <div className={`w-full max-w-xs glass-panel rounded-3xl border border-slate-700/80 p-6 space-y-5 text-center shadow-2xl transition-transform ${errorAnim ? 'animate-bounce' : ''}`}>
        
        {!isLockedMode && (
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header Icon & Description */}
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-glow">
            {isLockedMode ? (
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            ) : user.passcodeEnabled && changeStage === 'verify_current' ? (
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            ) : (
              <Lock className="w-8 h-8 text-cyan-400" />
            )}
          </div>

          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {isLockedMode 
              ? 'Вход в One Pay Wallet' 
              : !user.passcodeEnabled 
                ? 'Установите PIN-код'
                : changeStage === 'verify_current'
                  ? 'Введите текущий PIN'
                  : changeStage === 'choose_action'
                    ? 'Управление PIN-кодом'
                    : 'Новый PIN-код'}
          </h2>

          <p className="text-xs text-slate-400 font-medium">
            {isLockedMode 
              ? 'Введите 4-значный PIN для разблокировки'
              : !user.passcodeEnabled
                ? 'Придумайте 4 цифры для защиты кошелька'
                : changeStage === 'verify_current'
                  ? 'Введите действующий PIN для сброса'
                  : changeStage === 'choose_action'
                    ? 'Выберите действие с паролем'
                    : 'Введите новый 4-значный PIN'}
          </p>
        </div>

        {/* Stage 2 Options: Once Current PIN is verified */}
        {!isLockedMode && user.passcodeEnabled && changeStage === 'choose_action' ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                setChangeStage('create_new');
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-glow flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Изменить PIN-код</span>
            </button>

            <button
              onClick={handleConfirmDisable}
              className="w-full py-3.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Сбросить и отключить PIN</span>
            </button>
          </div>
        ) : (
          <>
            {/* PIN Indicators */}
            <div className="flex justify-center items-center gap-4 py-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                    pin.length > index
                      ? 'bg-cyan-400 border-cyan-400 scale-125 shadow-glowBlue'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 font-extrabold text-xl hover:bg-slate-800 active:scale-95 transition-all mx-auto flex items-center justify-center font-mono shadow-md"
                >
                  {num}
                </button>
              ))}

              <div />

              <button
                onClick={() => handleKeyPress('0')}
                className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 font-extrabold text-xl hover:bg-slate-800 active:scale-95 transition-all mx-auto flex items-center justify-center font-mono shadow-md"
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
          </>
        )}
      </div>
    </div>
  );
};
