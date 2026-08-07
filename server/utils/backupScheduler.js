import { generateDatabaseBackup } from "./backupEngine.js";

/**
 * Initialize automatic periodic database backup scheduler.
 * Runs in the background without blocking HTTP traffic.
 * Default interval: Every 24 hours (86,400,000 ms)
 */
export const initBackupScheduler = (intervalMs = 24 * 60 * 60 * 1000) => {
  console.log(`[${new Date().toISOString()}] ⏰ Initializing Automatic Database Backup Scheduler (Interval: Every 24 Hours)...`);

  // Run initial backup 2 minutes after server startup to establish initial state if needed
  setTimeout(async () => {
    try {
      await generateDatabaseBackup("AUTOMATIC_STARTUP_SCHEDULER");
    } catch (err) {
      console.warn("Startup backup warning:", err.message);
    }
  }, 2 * 60 * 1000);

  // Set recurring timer for daily background backups
  setInterval(async () => {
    try {
      await generateDatabaseBackup("AUTOMATIC_DAILY_SCHEDULER");
    } catch (err) {
      console.error("Scheduled daily backup error:", err.message);
    }
  }, intervalMs);
};
