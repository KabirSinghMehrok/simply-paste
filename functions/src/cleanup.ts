import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

// Initialize Firebase Admin if not already initialized
if (!admin.apps || !admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export interface CleanupResult {
  deletedCount: number;
  totalChecked: number;
  error?: string;
}

/**
 * Cleanup expired pastes from Firestore
 * @param expiryMinutes - Number of minutes after which pastes expire (default: 15)
 * @returns Promise<CleanupResult>
 */
export async function cleanupExpiredPastes(expiryMinutes: number = 15): Promise<CleanupResult> {
  try {
    logger.info(`Starting cleanup of pastes older than ${expiryMinutes} minutes`);
    
    const now = new Date();
    const expiryTime = new Date(now.getTime() - expiryMinutes * 60 * 1000);
    
    // Get all pastes from the collection
    const pastesSnapshot = await db.collection('pastes').get();
    
    if (pastesSnapshot.empty) {
      logger.info('No pastes found in collection');
      return {
        deletedCount: 0,
        totalChecked: 0
      };
    }

    const expiredPastes: admin.firestore.DocumentSnapshot[] = [];
    
    // Check each paste for expiry
    pastesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data && data.createdAt) {
        const createdAt = new Date(data.createdAt);
        if (createdAt < expiryTime) {
          expiredPastes.push(doc);
        }
      }
    });

    logger.info(`Found ${expiredPastes.length} expired pastes out of ${pastesSnapshot.size} total`);

    // Delete expired pastes
    const deletePromises = expiredPastes.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    const result: CleanupResult = {
      deletedCount: expiredPastes.length,
      totalChecked: pastesSnapshot.size
    };

    logger.info(`Cleanup completed: ${result.deletedCount} pastes deleted`);
    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error during cleanup:', error);
    
    return {
      deletedCount: 0,
      totalChecked: 0,
      error: errorMessage
    };
  }
}