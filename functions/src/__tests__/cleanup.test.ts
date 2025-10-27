// Mock Firebase Admin before any imports
jest.mock('firebase-admin', () => ({
  apps: [], // Mock the apps array
  initializeApp: jest.fn(),
  firestore: jest.fn(),
}));

// Mock firebase-functions/logger
jest.mock('firebase-functions/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

import functionsTest from 'firebase-functions-test';

const test = functionsTest();

// Mock Firestore
const mockFirestore = {
  collection: jest.fn(),
};

describe('Cleanup Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the firestore mock to return our mockFirestore
    const admin = require('firebase-admin');
    admin.firestore.mockReturnValue(mockFirestore);
  });

  afterAll(() => {
    test.cleanup();
  });

  describe('cleanupExpiredPastes', () => {
    it('should identify expired pastes correctly', async () => {
      // Test data: one expired, one not expired
      const now = new Date();
      const expiredTime = new Date(now.getTime() - 20 * 60 * 1000); // 20 minutes ago
      const validTime = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes ago

      const mockDocs = [
        {
          id: 'expired-paste-1',
          data: () => ({ content: 'test', createdAt: expiredTime.toISOString() }),
          ref: { delete: jest.fn() }
        },
        {
          id: 'valid-paste-1', 
          data: () => ({ content: 'test', createdAt: validTime.toISOString() }),
          ref: { delete: jest.fn() }
        }
      ];

      const mockQuerySnapshot = {
        docs: mockDocs,
        empty: false,
        size: 2
      };

      const mockQuery = {
        get: jest.fn().mockResolvedValue(mockQuerySnapshot)
      };

      mockFirestore.collection.mockReturnValue(mockQuery);

      // Import the function after mocking
      const { cleanupExpiredPastes } = require('../cleanup');
      
      const result = await cleanupExpiredPastes();

      // Should identify 1 expired paste
      expect(result.deletedCount).toBe(1);
      expect(result.totalChecked).toBe(2);
      expect(mockDocs[0].ref.delete).toHaveBeenCalled();
      expect(mockDocs[1].ref.delete).not.toHaveBeenCalled();
    });

    it('should handle empty collection gracefully', async () => {
      const mockQuerySnapshot = {
        docs: [],
        empty: true,
        size: 0
      };

      const mockQuery = {
        get: jest.fn().mockResolvedValue(mockQuerySnapshot)
      };

      mockFirestore.collection.mockReturnValue(mockQuery);

      const { cleanupExpiredPastes } = require('../cleanup');
      
      const result = await cleanupExpiredPastes();

      expect(result.deletedCount).toBe(0);
      expect(result.totalChecked).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      const mockQuery = {
        get: jest.fn().mockRejectedValue(new Error('Firestore error'))
      };

      mockFirestore.collection.mockReturnValue(mockQuery);

      const { cleanupExpiredPastes } = require('../cleanup');
      
      const result = await cleanupExpiredPastes();

      expect(result.error).toBeDefined();
      expect(result.deletedCount).toBe(0);
    });

    it('should use configurable expiry time', async () => {
      // Test with custom expiry time (5 minutes)
      const customExpiryMinutes = 5;
      const now = new Date();
      const expiredTime = new Date(now.getTime() - 6 * 60 * 1000); // 6 minutes ago
      const validTime = new Date(now.getTime() - 4 * 60 * 1000); // 4 minutes ago

      const mockDocs = [
        {
          id: 'expired-paste-1',
          data: () => ({ content: 'test', createdAt: expiredTime.toISOString() }),
          ref: { delete: jest.fn() }
        },
        {
          id: 'valid-paste-1',
          data: () => ({ content: 'test', createdAt: validTime.toISOString() }),
          ref: { delete: jest.fn() }
        }
      ];

      const mockQuerySnapshot = {
        docs: mockDocs,
        empty: false,
        size: 2
      };

      const mockQuery = {
        get: jest.fn().mockResolvedValue(mockQuerySnapshot)
      };

      mockFirestore.collection.mockReturnValue(mockQuery);

      const { cleanupExpiredPastes } = require('../cleanup');
      
      const result = await cleanupExpiredPastes(customExpiryMinutes);

      expect(result.deletedCount).toBe(1);
      expect(result.totalChecked).toBe(2);
    });
  });
});