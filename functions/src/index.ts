/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { cleanupExpiredPastes } from "./cleanup";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 2 });

/**
 * Scheduled function to cleanup expired pastes
 * Runs every 3 minutes to remove pastes older than 15 minutes
 */
export const scheduledCleanup = onSchedule(
  {
    schedule: "every 3 minutes",
    timeZone: "UTC",
    memory: "256MiB",
    maxInstances: 1,
  },
  async (event) => {
    logger.info("Starting scheduled cleanup of expired pastes");

    try {
      const result = await cleanupExpiredPastes(15); // 15 minutes expiry

      logger.info("Scheduled cleanup completed", {
        deletedCount: result.deletedCount,
        totalChecked: result.totalChecked,
        error: result.error,
      });

      if (result.error) {
        logger.error("Cleanup completed with errors", { error: result.error });
      }
    } catch (error) {
      logger.error("Scheduled cleanup failed", { error });
      throw error;
    }
  }
);
