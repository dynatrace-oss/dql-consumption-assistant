import React, { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { type QueryTimeFrameType } from '../../interfaces/Interfaces';
import { initialTimeframeValue } from './TimeframeInitialValue';

interface ProviderProps {
  children: ReactNode;
}

/**
 * This context is to handle data of timeframe selector acroos the app
 * This state is used in all the queries of the app
 * This is Global timeframe value
 */

interface TimeframeContextType {
  timeframe: QueryTimeFrameType;
  setTimeFrame: (val: QueryTimeFrameType, loading: boolean) => void;
  isTimeframeContextLoading?: boolean;
}

export const TimeframeContext = createContext<TimeframeContextType | null>(null);

/** Context Hook */
export function useAppTimeframeContext() {
  const context = useContext(TimeframeContext);
  if (!context) {
    throw new Error('useAppTimeframeContext must be used within provider');
  }
  return context;
}

export const TimeframeContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isTimeframeContextLoading, setIsTimeframeContextLoading] = useState(true);
  const [timeframeValue, setTimeframeValue] = useState(initialTimeframeValue);

  // changing the timeframe value
  const setTimeFrame = useCallback((val: QueryTimeFrameType, loading: boolean) => {
    setTimeframeValue(val);
    setIsTimeframeContextLoading(loading);
  }, []);

  // Context values that will be passed to children
  const contextValues: TimeframeContextType = useMemo(() => {
    return {
      timeframe: timeframeValue,
      setTimeFrame,
      isTimeframeContextLoading,
    };
  }, [timeframeValue, setTimeFrame, isTimeframeContextLoading]);

  return <TimeframeContext.Provider value={contextValues}>{children}</TimeframeContext.Provider>;
};
