import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ChevronLeft, 
  X, 
  ChevronRight, 
  Coins, 
  Info, 
  Search,
  Sparkles
} from 'lucide-react';

interface LevelItem {
  id: string;
  name: string;
  cashback: string;
  expenses: string;
  rate: string;
  badgeBg: string;
  coinGradient: string;
}

const CASHBACK_LEVELS: LevelItem[] = [
  {
    id: 'novice',
    name: 'Новичок',
    cashback: 'Кешбэк 1%',
    expenses: 'от 0 до 100 USD',
    rate: '82,74 ₽',
    badgeBg: 'from-emerald-600 via-teal-700 to-emerald-900',
    coinGradient: 'bg-emerald-400 text-slate-950',
  },
  {
    id: 'bronze',
    name: 'Бронзовый',
    cashback: 'Кешбэк 2%',
    expenses: 'от 100 до 300 USD',
    rate: '83,56 ₽',
    badgeBg: 'from-amber-700 via-orange-800 to-amber-950',
    coinGradient: 'bg-amber-500 text-slate-950',
  },
  {
    id: 'silver',
    name: 'Серебряный',
    cashback: 'Кешбэк 3%',
    expenses: 'от 300 до 600 USD',
    rate: '84,38 ₽',
    badgeBg: 'from-slate-400 via-slate-600 to-slate-800',
    coinGradient: 'bg-slate-300 text-slate-950',
  },
  {
    id: 'gold',
    name: 'Золотой',
    cashback: 'Кешбэк 4%',
    expenses: 'от 600 до 1 100 USD',
    rate: '85,20 ₽',
    badgeBg: 'from-amber-400 via-yellow-600 to-amber-800',
    coinGradient: 'bg-yellow-400 text-slate-950',
  },
  {
    id: 'platinum',
    name: 'Платиновый',
    cashback: 'Кешбэк 5%',
    expenses: 'от 1 100 USD',
    rate: '86,02 ₽',
    badgeBg: 'from-purple-600 via-indigo-700 to-slate-900',
    coinGradient: 'bg-purple-300 text-slate-950',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Что такое расчётный период?',
    answer: 'Расчётный период длится один календарный месяц. В течение этого времени подсчитывается сумма всех ваших трат по картам и QR-кодам.'
  },
  {
    question: 'На что можно потратить баллы AW?',
    answer: 'Баллы AW можно мгновенно обменять на USD по курсу 1 балл = 0,01 USD или использовать для оплаты сервисов и товаров.'
  },
  {
    question: 'Когда баллы AW становятся доступными для обмена?',
    answer: 'Баллы начисляются мгновенно после подтверждения оплаты и сразу доступны к использованию.'
  },
  {
    question: 'Что будет при возврате средств?',
    answer: 'При возврате средств за покупку начисленные за неё баллы AW автоматически списываются с вашего счёта.'
  },
];

export const CashbackModal: React.FC = () => {
  const { activeModal, setActiveModal, triggerHaptic, showToast, handleSwap } = useWallet();

  const [step, setStep] = useState<'main' | 'points' | 'levels'>('main');
  const [activeLevelIdx, setActiveLevelIdx] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [awPoints, setAwPoints] = useState<number>(0);

  if (activeModal !== 'cashback' && activeModal !== 'cashback_levels') return null;

  const handleClose = () => {
    triggerHaptic('light');
    setActiveModal('none');
    setStep('main');
  };

  const currentLevel = CASHBACK_LEVELS[activeLevelIdx];

  const handleExchangePoints = () => {
    triggerHaptic('medium');
    if (awPoints <= 0) {
      showToast('У вас пока 0 баллов AW. Совершайте покупки для получения кешбэка!', 'info');
      return;
    }
    const usdAmount = awPoints * 0.01;
    handleSwap('USD', 'USD', 0, usdAmount);
    setAwPoints(0);
    showToast(`Успешно обменены ${awPoints} баллов AW на $${usdAmount.toFixed(2)} USD!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-[#0B101D] border border-slate-800 sm:rounded-3xl rounded-t-3xl min-h-[90vh] max-h-[95vh] flex flex-col justify-between overflow-y-auto p-4 space-y-4 text-slate-100 shadow-2xl relative">
        
        {/* STEP 1: Main Cashback View */}
        {step === 'main' && (
          <div className="space-y-4 animate-fade-in pb-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <button 
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-base font-bold text-slate-100">Кешбэк</h2>
              <button 
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mascot Graphic & Header Text */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-cyan-500/10 border border-emerald-500/40 flex items-center justify-center shadow-glow">
                <Coins className="w-10 h-10 text-emerald-400 stroke-[1.8]" />
              </div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Кешбэк</h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Совершайте покупки по QR-коду и карте и получайте до 5% кешбэка баллами AW
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setStep('levels');
                }}
                className="text-xs text-cyan-400 font-bold hover:underline inline-flex items-center gap-1 pt-1"
              >
                <span>Узнать больше</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top 2 Cards Side-By-Side */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Card 1: Novice / Level status */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setStep('levels');
                }}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600/90 to-teal-800/90 border border-emerald-500/50 text-left space-y-3 shadow-lg hover:scale-[1.02] transition-transform relative overflow-hidden group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                  <span>Новичок</span>
                  <ChevronRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-3xl font-black text-white">1%</div>
                <div className="text-[10px] text-emerald-200/90 font-medium">
                  Действует до 6 октября
                </div>
              </button>

              {/* Card 2: My AW Points */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setStep('points');
                }}
                className="p-4 rounded-2xl bg-[#13192B] border border-slate-800 text-left space-y-3 shadow-md hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Мои баллы AW</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-100 flex items-center gap-1.5 font-mono">
                  <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-400 border border-blue-400 flex items-center justify-center text-[10px]">
                    ◆
                  </span>
                  <span>{awPoints}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  1 балл = 0,01 USD
                </div>
              </button>
            </div>

            {/* Spending Progress Card */}
            <div className="p-4 rounded-2xl bg-[#13192B] border border-slate-800/80 space-y-2 shadow-sm">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                <span>0 USD</span>
                <span>100 USD</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-0 transition-all duration-500" />
              </div>
              <p className="text-xs text-slate-300 leading-snug pt-1">
                Потратьте <strong className="text-slate-100 font-bold">100 USD</strong> до 6 октября, чтобы перейти на уровень <strong className="text-amber-400 font-bold">Бронзовый 2%</strong>
              </p>
            </div>

            {/* Section: Как потратить баллы */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-100 px-1">
                Как потратить баллы
              </h3>

              {/* Action 1: Exchange to USD */}
              <button
                type="button"
                onClick={handleExchangePoints}
                className="w-full p-4 rounded-2xl bg-[#13192B] hover:bg-[#1A233D] border border-slate-800 flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="text-left font-bold text-sm text-slate-100 leading-tight">
                  Обменять<br />на USD
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    $
                  </div>
                </div>
              </button>

              {/* Action 2 & 3: Wheel of fortune & Services */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#13192B]/80 border border-slate-800/80 flex flex-col justify-between h-28 relative opacity-70">
                  <div className="font-bold text-sm text-slate-200">
                    Колесо бонусов
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold w-fit border border-slate-700">
                    Скоро
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#13192B]/80 border border-slate-800/80 flex flex-col justify-between h-28 relative opacity-70">
                  <div className="font-bold text-sm text-slate-200">
                    Оплата сервисов
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold w-fit border border-slate-700">
                    Скоро
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: My AW Points View (Photo 1) */}
        {step === 'points' && (
          <div className="space-y-5 animate-fade-in pb-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <button 
                onClick={() => setStep('main')}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-slate-100">Мои баллы AW</h2>
              <button 
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Balance Display */}
            <div className="text-center space-y-2 py-4">
              <div className="text-4xl font-black text-slate-100 flex items-center justify-center gap-2 font-mono">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                  ◆
                </span>
                <span>{awPoints}</span>
              </div>
              <div className="text-xs text-slate-400">
                1 балл = 0,01 USD
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleExchangePoints}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-slate-100 transition-all shadow-lg text-sm"
                >
                  Обменять баллы
                </button>
              </div>
            </div>

            {/* Points History Card */}
            <div className="p-6 rounded-3xl bg-[#13192B] border border-slate-800 space-y-4 text-center">
              <div className="text-sm font-bold text-slate-100 text-left">
                История баллов
              </div>

              <div className="py-8 space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-800/50 border border-slate-700/60 flex items-center justify-center text-slate-400 relative">
                  <Search className="w-10 h-10 stroke-[1.5]" />
                  <Sparkles className="w-4 h-4 text-cyan-400 absolute top-2 right-2" />
                </div>
                <div className="font-bold text-base text-slate-200">
                  Транзакций пока нет
                </div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Начните тратить — и мы покажем все начисления и списания
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Levels Modal View (Photos 2-5) */}
        {step === 'levels' && (
          <div className="space-y-4 animate-fade-in pb-6">
            
            {/* Levels Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <button 
                onClick={() => setStep('main')}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold text-slate-100">Уровни кешбэка</h2>
              <button 
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Level Card Slider */}
            <div className="space-y-3 pt-2">
              <div className={`p-5 rounded-3xl bg-gradient-to-br ${currentLevel.badgeBg} border border-white/10 shadow-2xl space-y-4 transition-all duration-300 relative overflow-hidden min-h-[160px] flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-semibold text-white/80 uppercase tracking-wider">{currentLevel.name}</div>
                    <div className="text-2xl font-black text-white tracking-tight">{currentLevel.cashback}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${currentLevel.coinGradient} flex items-center justify-center text-xl font-black shadow-lg border border-white/30`}>
                    $
                  </div>
                </div>

                <div className="space-y-1 text-xs text-white/90 pt-2 font-mono">
                  <div>Расходы за расчётный период</div>
                  <div className="text-sm font-bold text-white font-sans">{currentLevel.expenses}</div>
                  <div className="text-[11px] text-white/70 flex items-center gap-1 pt-1">
                    <span>Курс обмена: <strong className="text-white">{currentLevel.rate}</strong></span>
                    <Info className="w-3 h-3 text-white/60" />
                  </div>
                </div>
              </div>

              {/* Slider Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {CASHBACK_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setActiveLevelIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeLevelIdx 
                        ? 'w-6 bg-emerald-400' 
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Section: Как работают уровни */}
            <div className="space-y-3 pt-3">
              <h3 className="text-sm font-bold text-slate-100 px-1">
                Как работают уровни
              </h3>

              <div className="p-4 rounded-2xl bg-[#13192B] border border-slate-800 space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-100 font-bold text-sm block mb-0.5">Начните с уровня «Бронзовый»</strong>
                    <span className="text-slate-400">После активации вы получаете уровень с кешбэком 2%.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-100 font-bold text-sm block mb-0.5">Тратьте и повышайте уровень</strong>
                    <span className="text-slate-400">Чем больше тратите за расчётный период, тем выше уровень — он применяется сразу. Учитываются покупки по QR, по ссылке и оплата картой «Антарктик».</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-100 font-bold text-sm block mb-0.5">Уровень нужно подтверждать каждый период</strong>
                    <span className="text-slate-400">Чтобы сохранить уровень, набирайте нужный оборот трат каждый месяц.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Узнать больше (FAQ Accordion) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-100 px-1">
                Узнать больше
              </h3>

              <div className="rounded-2xl bg-[#13192B] border border-slate-800 divide-y divide-slate-800/80 overflow-hidden text-xs">
                {FAQ_ITEMS.map((item, idx) => (
                  <div key={idx} className="p-3.5">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-semibold text-slate-200 hover:text-cyan-400 transition-colors"
                    >
                      <span>{item.question}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-90 text-cyan-400' : ''}`} />
                    </button>
                    {expandedFaq === idx && (
                      <p className="mt-2 text-slate-400 leading-relaxed pt-1">
                        {item.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
