import fs from "fs";
import path from "path";
import {
  generateDatabaseBackup,
  getBackupManifest,
  BACKUP_DIR,
} from "../utils/backupEngine.js";

// @desc    Get Backup History Manifest
// @route   GET /api/admin/backups
// @access  Private / Admin
export const getBackupHistory = async (req, res) => {
  try {
    const history = getBackupManifest();
    return res.status(200).json({
      success: true,
      count: history.length,
      backups: history,
    });
  } catch (error) {
    console.error("Error fetching backup history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve backup history",
    });
  }
};

// @desc    Trigger Manual Database Backup
// @route   POST /api/admin/backups
// @access  Private / Admin
export const createBackup = async (req, res) => {
  try {
    const adminUsername = req.admin?.username || "ADMIN_MANUAL";
    console.log(`[${new Date().toISOString()}] MANUAL_BACKUP_REQUESTED: Admin '${adminUsername}' triggered a manual backup.`);

    // Generate backup asynchronously
    const backupMetadata = await generateDatabaseBackup(`ADMIN_MANUAL (${adminUsername})`);

    return res.status(201).json({
      success: true,
      message: "Database backup generated successfully!",
      backup: backupMetadata,
    });
  } catch (error) {
    console.error("Error creating manual backup:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create manual backup",
    });
  }
};

// @desc    Download Backup File
// @route   GET /api/admin/backups/download/:filename
// @access  Private / Admin
export const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: Prevent path traversal attacks (e.g., ../../secrets)
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(BACKUP_DIR, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: `Backup file "${sanitizedFilename}" not found on server.`,
      });
    }

    console.log(`[${new Date().toISOString()}] BACKUP_DOWNLOAD: Admin '${req.admin?.username || "unknown"}' downloaded '${sanitizedFilename}'`);

    return res.download(filePath, sanitizedFilename);
  } catch (error) {
    console.error("Error downloading backup file:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to download backup file",
    });
  }
};
