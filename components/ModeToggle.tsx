import React from 'react';
import { useTradeMode } from '../context/TradeModeContext';
import { Zap, Activity } from 'lucide-react';

const ModeToggle: React.FC = () => {
  const { mode, setMode } = useTradeMode();

  return (
    <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 w-48 h-10 overflow-hidden shadow-inner">
      {/* Sliding Background */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out z-0 ${
          mode === 'forex' 
            ? 'left-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
            : 'left-[calc(50%+1px)] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
        }`}
      />

      {/* Forex Option */}
      <button
        onClick={() => setMode('forex')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors duration-200 ${
          mode === 'forex' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Zap className={`w-3.5 h-3.5 ${mode === 'forex' ? 'animate-pulse' : ''}`} />
        FOREX
      </button>

      {/* Futures Option */}
      <button
        onClick={() => setMode('futures')}
        className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors duration-200 ${
          mode === 'futures' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Activity className={`w-3.5 h-3.5 ${mode === 'futures' ? 'animate-pulse' : ''}`} />
        FUTURES
      </button>
    </div>
  );
};

export default ModeToggle;
