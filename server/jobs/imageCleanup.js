const cron = require("node-cron");
const { cleanupOldImages } = require("../utils/cleanupOldImages");

/**
 * Initialize scheduled cleanup jobs
 */
const initializeCleanupJobs = () => {
  const cleanupDays = parseInt(process.env.IMAGE_CLEANUP_DAYS) || 90;

  // Run cleanup every day at 2 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("Running scheduled image cleanup...");
    try {
      const result = await cleanupOldImages(cleanupDays);
      console.log(
        `Cleanup completed: ${result.deleted} images deleted, ${result.failed} failed`
      );
    } catch (error) {
      console.error("Scheduled cleanup failed:", error);
    }
  });

  console.log(
    `Image cleanup job scheduled: Daily at 2 AM (${cleanupDays} days retention)`
  );
};

module.exports = { initializeCleanupJobs };
