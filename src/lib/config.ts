/**
 * Application configuration with environment variable support
 */

export const config = {
  // Paste expiry time in minutes (default: 15 minutes)
  PASTE_EXPIRY_MINUTES: parseInt(process.env.NEXT_PUBLIC_PASTE_EXPIRY_MINUTES || '15', 10),
  
  // Cleanup function interval in minutes (default: 3 minutes)
  CLEANUP_INTERVAL_MINUTES: parseInt(process.env.CLEANUP_INTERVAL_MINUTES || '3', 10),
  
  // Storage cleanup threshold percentage (default: 85%)
  STORAGE_CLEANUP_THRESHOLD: parseInt(process.env.STORAGE_CLEANUP_THRESHOLD || '85', 10),
  
  // Maximum characters per paste
  MAX_CHARACTERS: parseInt(process.env.NEXT_PUBLIC_MAX_CHARACTERS || '50000', 10),
  
  // Firebase emulator settings
  USE_FIREBASE_EMULATOR: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true',
  FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST || 'localhost',
  FIRESTORE_EMULATOR_PORT: parseInt(process.env.FIRESTORE_EMULATOR_PORT || '8080', 10),
} as const;

/**
 * Utility functions for time calculations
 */
export const timeUtils = {
  /**
   * Convert minutes to milliseconds
   */
  minutesToMs: (minutes: number): number => minutes * 60 * 1000,
  
  /**
   * Get expiry timestamp for a paste created at given time
   */
  getExpiryTime: (createdAt: string): Date => {
    const created = new Date(createdAt);
    return new Date(created.getTime() + timeUtils.minutesToMs(config.PASTE_EXPIRY_MINUTES));
  },
  
  /**
   * Check if a paste is expired
   */
  isExpired: (createdAt: string): boolean => {
    const expiryTime = timeUtils.getExpiryTime(createdAt);
    return new Date() > expiryTime;
  },
  
  /**
   * Get remaining time in milliseconds
   */
  getRemainingTime: (createdAt: string): number => {
    const expiryTime = timeUtils.getExpiryTime(createdAt);
    const remaining = expiryTime.getTime() - new Date().getTime();
    return Math.max(0, remaining);
  },
  
  /**
   * Format remaining time as human-readable string
   */
  formatRemainingTime: (remainingMs: number): string => {
    if (remainingMs <= 0) return 'Expired';
    
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }
};

export default config;