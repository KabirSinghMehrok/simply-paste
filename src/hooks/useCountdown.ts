import { useState, useEffect, useCallback } from 'react';
import { timeUtils } from '@/lib/config';

export interface CountdownState {
  timeRemaining: number; // in milliseconds
  isExpired: boolean;
  formattedTime: string; // e.g., "14m 32s"
}

export function useCountdown(createdAt: string): CountdownState {
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    // Initialize with calculated value to avoid initial render issues
    return timeUtils.getRemainingTime(createdAt);
  });
  const [isExpired, setIsExpired] = useState<boolean>(() => {
    // Initialize with calculated value
    return timeUtils.isExpired(createdAt);
  });

  const formatTime = useCallback((milliseconds: number): string => {
    if (milliseconds <= 0) return '0s';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  useEffect(() => {
    // Set up interval to update every second
    const interval = setInterval(() => {
      const remaining = timeUtils.getRemainingTime(createdAt);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [createdAt]);

  return {
    timeRemaining,
    isExpired,
    formattedTime: formatTime(timeRemaining),
  };
}