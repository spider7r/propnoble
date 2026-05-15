import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type TradeMode = 'forex' | 'futures';

interface TradeModeContextType {
  mode: TradeMode;
  setMode: (mode: TradeMode) => void;
  toggleMode: () => void;
  getModePath: (path: string) => string;
}

const TradeModeContext = createContext<TradeModeContextType | undefined>(undefined);

export const TradeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setModeState] = useState<TradeMode>('forex');

  // Sync state with URL path
  useEffect(() => {
    const isFutures = location.pathname.startsWith('/futures');
    const newMode = isFutures ? 'futures' : 'forex';
    setModeState(newMode);
    document.documentElement.setAttribute('data-theme', newMode);
  }, [location.pathname]);

  const getModePath = (path: string) => {
    // If it's an admin path, don't prefix with futures (admin is global)
    if (path.includes('/admin')) return path;
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (mode === 'futures') {
        return `/futures${cleanPath === '/' ? '' : cleanPath}`;
    }
    return cleanPath;
  };

  const setMode = (newMode: TradeMode) => {
    const currentPath = location.pathname;
    // Remove /futures prefix if exists
    let cleanPath = currentPath.replace(/^\/futures/, '');
    if (cleanPath === '') cleanPath = '/';

    const newPath = newMode === 'futures' 
      ? `/futures${cleanPath === '/' ? '' : cleanPath}`
      : cleanPath;
    
    navigate(newPath + location.search);
  };

  const toggleMode = () => {
    setMode(mode === 'forex' ? 'futures' : 'forex');
  };

  return (
    <TradeModeContext.Provider value={{ mode, setMode, toggleMode, getModePath }}>
      {children}
    </TradeModeContext.Provider>
  );
};

export const useTradeMode = () => {
  const context = useContext(TradeModeContext);
  if (context === undefined) {
    throw new Error('useTradeMode must be used within a TradeModeProvider');
  }
  return context;
};
