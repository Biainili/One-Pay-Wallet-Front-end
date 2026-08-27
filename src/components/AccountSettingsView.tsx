import React, { useState } from 'react';
import { ChevronLeft, Phone, Plus, LogOut, ChevronRight, Trash2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface AccountSettingsViewProps {
  onBack: () => void;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({ onBack }) => {
  const { user, triggerHaptic, showToast } = useWallet();
  const [phoneList, setPhoneList] = useState<string[]>(
    user.phone ? [user.phone] : ['+7 (999) 000-00-00']
  );
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');

  const handleAddPhone = () => {
    if (!newPhone.trim()) return;
    setPhoneList((prev) => [...prev, newPhone.trim()]);
    setNewPhone('');
    setShowAddPhone(false);
    triggerHaptic('success');
    showToast('Номер телефона добавлен!', 'success');
  };

  const handleDeleteAccount = () => {
    triggerHaptic('heavy');
    if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
      showToast('Запрос на удаление аккаунта отправлен', 'info');
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 flex flex-col justify-between font-sans animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-6 pt-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wide">Мой аккаунт</h1>
          <div className="w-10" />
        </div>

        {/* User Card */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl p-4 mb-5">
          <span className="block text-xs font-medium text-slate-400 mb-1">Имя пользователя</span>
          <span className="text-base font-semibold text-white tracking-wide">
            {user.username || '@username'}
          </span>
        </div>

        {/* Phone Numbers Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Номера телефонов
            </span>
          </div>

          <div className="bg-[#121929] border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
            {phoneList.map((phone, idx) => (
              <div key={idx} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white">{phone}</span>
                    <span className="block text-[11px] text-slate-400">
                      {idx === 0 ? 'Основной' : 'Дополнительный'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setShowAddPhone(!showAddPhone)}
              className="w-full flex items-center justify-end gap-1.5 p-3.5 text-blue-400 text-sm font-semibold hover:bg-slate-800/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить</span>
            </button>
          </div>

          {showAddPhone && (
            <div className="mt-3 p-3 bg-[#121929] border border-slate-800 rounded-xl flex gap-2">
              <input
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
              <button
                onClick={handleAddPhone}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
              >
                ОК
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="bg-[#121929] border border-slate-800/80 rounded-2xl overflow-hidden mb-6">
          <button
            onClick={() => {
              triggerHaptic('medium');
              showToast('Вы вышли из аккаунта', 'info');
              onBack();
            }}
            className="w-full flex items-center justify-between p-4 text-slate-200 hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800/80 rounded-xl text-slate-400">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Выйти из аккаунта</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Delete Account Button at Bottom */}
      <div className="pb-6 text-center">
        <button
          onClick={handleDeleteAccount}
          className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 mx-auto py-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Удалить аккаунт</span>
        </button>
      </div>
    </div>
  );
};
