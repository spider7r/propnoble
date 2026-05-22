import React from 'react';
import { useTradeMode, TradeMode } from '../context/TradeModeContext';
import { Activity, Zap, Bitcoin } from 'lucide-react';

const MODES: { key: TradeMode; label: string; icon: typeof Zap; color: string; glow: string }[] = [
  { key: 'futures',  label: 'FUTURES', icon: Activity, color: 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]', glow: 'rgba(6,182,212,0.5)' },
  { key: 'forex',    label: 'FOREX',   icon: Zap,      color: 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]', glow: 'rgba(220,38,38,0.5)' },
  { key: 'crypto',   label: 'CRYPTO',  icon: Bitcoin,  color: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]', glow: 'rgba(168,85,247,0.5)' },
];

const ModeToggle: React.FC = () => {
  const { mode, setMode } = useTradeMode();
  const activeIndex = MODES.findIndex(m => m.key === mode);

  return (
    <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 w-[270px] h-10 overflow-hidden shadow-inner">
      {/* Sliding Background */}
      <div 
        className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out z-0 ${MODES[activeIndex].color}`}
        style={{
          width: 'calc(33.333% - 4px)',
          left: `calc(${activeIndex * 33.333}% + 2px)`,
        }}
      />

      {/* Mode Buttons */}
      {MODES.map((m) => (
        <button
          key={m.key}
          onClick={() => setMode(m.key)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-colors duration-200 ${
            mode === m.key ? 'text-white' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <m.icon className={`w-3 h-3 ${mode === m.key ? 'animate-pulse' : ''}`} />
          {m.label}
        </button>
      ))}
    </div>
  );
};

export default ModeToggle;
