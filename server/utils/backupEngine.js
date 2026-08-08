import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";
import Team from "../models/Team.js";
import Registration from "../models/Registration.js";
import Payment from "../models/Payment.js";
import ContactMessage from "../models/ContactMessage.js";
import Certificate from "../models/Certificate.js";
import Announcement from "../models/Announcement.js";
import Coordinator from "../models/Coordinator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where backups are stored securely (uses /tmp in Vercel serverless environment)
export const BACKUP_DIR = process.env.VERCEL
  ? path.join("/tmp", "backups")
  : path.join(__dirname, "..", "backups");

export const MANIFEST_FILE = path.join(BACKUP_DIR, "backup_manifest.json");

// Ensure backup directory exists safely without crashing serverless initialization
try {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
} catch (dirErr) {
  console.warn("Backup directory creation notice (Serverless read-only mode):", dirErr.message);
}

/**
 * Read backup history manifest
 */
export const getBackupManifest = () => {
  try {
    if (!fs.existsSync(MANIFEST_FILE)) {
      return [];
    }
    const data = fs.readFileSync(MANIFEST_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading backup manifest:", err.message);
    return [];
  }
};

/**
 * Save backup manifest entry
 */
const saveToManifest = (entry) => {
  try {
    const history = getBackupManifest();
    history.unshift(entry); // Add latest backup to top
    // Keep max 50 historical entries in manifest
    const trimmed = history.slice(0, 50);
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving to backup manifest:", err.message);
  }
};

/**
 * Generate complete database backup in JSON, CSV, and XLSX formats asynchronously.
 * @param {string} triggeredBy - "AUTOMATIC_SCHEDULER" or "ADMIN_MANUAL"
 * @returns {Promise<Object>} Backup metadata object
 */
export const generateDatabaseBackup = async (triggeredBy = "AUTOMATIC_SCHEDULER") => {
  const timestampIso = new Date().toISOString();
  const dateFormatted = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupId = `AMS_Backup_${dateFormatted}`;

  console.log(`[${timestampIso}] 📦 [BACKUP_START] Initiating non-blocking database backup (Triggered by: ${triggeredBy})...`);

  try {
    // 1. Fetch all collections in parallel (read-only, non-blocking)
    const [teams, registrations, payments, contactMessages, certificates, announcements, coordinators] = await Promise.all([
      Team.find({ isDeleted: { $ne: true } }).lean(),
      Registration.find({ isDeleted: { $ne: true } }).lean(),
      Payment.find({ isDeleted: { $ne: true } }).lean(),
      ContactMessage.find({ isDeleted: { $ne: true } }).lean(),
      Certificate.find({ isDeleted: { $ne: true } }).lean(),
      Announcement.find({ isDeleted: { $ne: true } }).lean(),
      Coordinator.find({ isDeleted: { $ne: true } }).lean(),
    ]);

    const totalRecords = teams.length + registrations.length + payments.length;

    // ─── 2. Generate JSON Backup ───
    const jsonFileName = `${backupId}.json`;
    const jsonFilePath = path.join(BACKUP_DIR, jsonFileName);
    const jsonPayload = {
      backupId,
      timestamp: timestampIso,
      triggeredBy,
      recordCounts: {
        teams: teams.length,
        registrations: registrations.length,
        payments: payments.length,
        contactMessages: contactMessages.length,
        certificates: certificates.length,
        announcements: announcements.length,
        coordinators: coordinators.length,
      },
      data: {
        teams,
        registrations,
        payments,
        contactMessages,
        certificates,
        announcements,
        coordinators,
      },
    };
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonPayload, null, 2), "utf8");
    const jsonSize = fs.statSync(jsonFilePath).size;

    // ─── 3. Generate CSV Backup ───
    const csvFileName = `${backupId}.csv`;
    const csvFilePath = path.join(BACKUP_DIR, csvFileName);

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const csvHeaders = [
      "Registration ID",
      "Team Name",
      "Team Size",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "College",
      "Department",
      "Year",
      "Track",
      "Problem Title",
      "Payment Status",
      "Registration Date",
    ];

    const csvRows = registrations.map((r) => [
      escapeCSV(r.razorpayOrderId || r._id),
      escapeCSV(r.teamName),
      escapeCSV(Array.isArray(r.teamMembers) ? r.teamMembers.length : 4),
      escapeCSV(r.teamLeaderName),
      escapeCSV(r.email),
      escapeCSV(r.phoneNumber),
      escapeCSV(r.collegeName),
      escapeCSV(r.department),
      escapeCSV(r.year),
      escapeCSV("Open Innovation"),
      escapeCSV("AMS Hackathon Challenge"),
      escapeCSV(r.paymentStatus),
      escapeCSV(new Date(r.registrationTimestamp || r.createdAt).toISOString()),
    ]);

    const csvString = "\uFEFF" + [csvHeaders.map(escapeCSV).join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    fs.writeFileSync(csvFilePath, csvString, "utf8");
    const csvSize = fs.statSync(csvFilePath).size;

    // ─── 4. Generate Excel (.xlsx) Backup ───
    const xlsxFileName = `${backupId}.xlsx`;
    const xlsxFilePath = path.join(BACKUP_DIR, xlsxFileName);

    const workbook = XLSX.utils.book_new();

    // Registrations Sheet
    const flatRegistrations = registrations.map((r) => ({
      "Registration ID": r.razorpayOrderId || r._id,
      "Team Name": r.teamName,
      "Leader Name": r.teamLeaderName,
      "Leader Email": r.email,
      "Leader Phone": r.phoneNumber,
      "College": r.collegeName,
      "Department": r.department,
      "Year": r.year,
      "Payment Status": r.paymentStatus,
      "Razorpay Order ID": r.razorpayOrderId,
      "Razorpay Payment ID": r.razorpayPaymentId,
      "Registration Date": new Date(r.registrationTimestamp || r.createdAt).toLocaleString("en-IN"),
    }));
    const regSheet = XLSX.utils.json_to_sheet(flatRegistrations.length > 0 ? flatRegistrations : [{ Notice: "No records" }]);
    XLSX.utils.book_append_sheet(workbook, regSheet, "Registrations");

    // Teams Sheet
    const flatTeams = teams.map((t) => ({
      "Registration ID": t.registrationId,
      "Team Name": t.teamName,
      "Team Size": t.teamSize,
      "Leader Name": t.leader?.name,
      "Leader Email": t.leader?.email,
      "Leader Phone": t.leader?.phone,
      "College": t.leader?.college,
      "Track": t.track,
      "Problem Title": t.problemTitle,
      "Payment Status": t.paymentStatus,
      "Created At": new Date(t.createdAt).toLocaleString("en-IN"),
    }));
    const teamSheet = XLSX.utils.json_to_sheet(flatTeams.length > 0 ? flatTeams : [{ Notice: "No records" }]);
    XLSX.utils.book_append_sheet(workbook, teamSheet, "Teams");

    // Payments Sheet
    const flatPayments = payments.map((p) => ({
      "Registration ID": p.registrationId,
      "Order ID": p.orderId,
      "Payment ID": p.paymentId,
      "Amount (INR)": p.amount,
      "Status": p.status,
      "Gateway": p.paymentGateway,
      "Timestamp": new Date(p.paymentTimestamp || p.createdAt).toLocaleString("en-IN"),
    }));
    const paySheet = XLSX.utils.json_to_sheet(flatPayments.length > 0 ? flatPayments : [{ Notice: "No records" }]);
    XLSX.utils.book_append_sheet(workbook, paySheet, "Payments");

    XLSX.writeFile(workbook, xlsxFilePath);
    const xlsxSize = fs.statSync(xlsxFilePath).size;

    // ─── 5. Record Manifest Metadata ───
    const metadata = {
      backupId,
      timestamp: timestampIso,
      triggeredBy,
      status: "SUCCESS",
      totalRecords,
      files: {
        json: { filename: jsonFileName, sizeBytes: jsonSize },
        csv: { filename: csvFileName, sizeBytes: csvSize },
        xlsx: { filename: xlsxFileName, sizeBytes: xlsxSize },
      },
    };

    saveToManifest(metadata);
    console.log(`[${new Date().toISOString()}] ✅ [BACKUP_SUCCESS] Generated ${backupId} (${totalRecords} records). Files: .xlsx, .csv, .json`);

    return metadata;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ [BACKUP_FAILED] Error generating database backup:`, error.message);
    const failedEntry = {
      backupId,
      timestamp: timestampIso,
      triggeredBy,
      status: "FAILED",
      error: error.message,
      files: {},
    };
    saveToManifest(failedEntry);
    throw error;
  }
};
