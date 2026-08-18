import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Team from "../models/Team.js";
import PSReleaseLog from "../models/PSReleaseLog.js";
import { sendHardwarePSReleaseEmail } from "../utils/emailService.js";
import connectDB from "../config/db.js";

// Hardware problem statement reveal moment (11:01 AM IST, Aug 19 2026 = 05:31 UTC)
// Overridable via env for testing (PS_REVEAL_TIMESTAMP, epoch ms)
export const PS_REVEAL_TIMESTAMP = Number(process.env.PS_REVEAL_TIMESTAMP) ||
  new Date("2026-08-19T11:01:00+05:30").getTime();

const RELEASE_KEY = "hardware-ps-2026";

// Helper to ensure MongoDB connection is active
const ensureDB = async () => {
  if (mongoose.connection.readyState === 1) return true;
  if (process.env.MONGODB_URI || process.env.MONGO_URI) {
    try {
      await connectDB();
      return mongoose.connection.readyState === 1;
    } catch (e) {
      return false;
    }
  }
  return false;
};

// Deduplicate a list of registration-derived recipients by leader email
const collectRecipients = async () => {
  const recipients = [];
  const seen = new Set();

  const addRecipient = ({ email, leaderName, teamName, registrationId }) => {
    const clean = String(email || "").trim().toLowerCase();
    if (!clean || !clean.includes("@") || seen.has(clean)) return;
    seen.add(clean);
    recipients.push({ toEmail: clean, leaderName, teamName, registrationId });
  };

  try {
    // Registration collection (Razorpay-verified flow)
    const registrations = await Registration.find({
      isDeleted: { $ne: true },
      paymentStatus: { $in: ["PAID", "SUCCESS", "CASH_PAID"] },
    })
      .select("email teamLeaderName teamName registrationId")
      .lean();

    (registrations || []).forEach((reg) =>
      addRecipient({
        email: reg.email,
        leaderName: reg.teamLeaderName || "Team Leader",
        teamName: reg.teamName || "Your Team",
        registrationId: reg.registrationId,
      })
    );
  } catch (err) {
    console.warn(`[${new Date().toISOString()}] PS-RELEASE registration query notice: ${err.message}`);
  }

  try {
    // Team collection (manual / cash registrations)
    const teams = await Team.find({
      isDeleted: { $ne: true },
      paymentStatus: { $in: ["PAID", "CASH_PAID", "WAIVED"] },
    })
      .select("leader email teamName registrationId")
      .lean();

    (teams || []).forEach((team) =>
      addRecipient({
        email: team.leader?.email,
        leaderName: team.leader?.name || "Team Leader",
        teamName: team.teamName || "Your Team",
        registrationId: team.registrationId,
      })
    );
  } catch (err) {
    console.warn(`[${new Date().toISOString()}] PS-RELEASE team query notice: ${err.message}`);
  }

  return recipients;
};

// Send emails to all recipients with bounded concurrency (10 at a time)
const dispatchEmails = async (recipients) => {
  const results = { succeeded: 0, failed: 0 };
  const BATCH = 10;

  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    const outcomes = await Promise.all(
      batch.map((r) =>
        sendHardwarePSReleaseEmail(r).then(
          (ok) => (ok ? "ok" : "fail"),
          () => "fail"
        )
      )
    );
    outcomes.forEach((o) => (o === "ok" ? results.succeeded++ : results.failed++));
  }

  return results;
};

// @desc    Broadcast hardware PS release emails to all paid registered teams
// @route   POST /api/ps-release/notify  (also GET for Vercel cron)
// @access  Public-ish: guarded by reveal-time window + one-time log (idempotent)
export const notifyPSRelease = async (req, res) => {
  try {
    const isDBConnected = await ensureDB();

    // Idempotency guard: never send twice
    if (isDBConnected) {
      try {
        const existing = await PSReleaseLog.findOne({ releaseKey: RELEASE_KEY }).lean();
        if (existing) {
          return res.status(200).json({
            success: true,
            alreadySent: true,
            message: "Hardware PS release emails already dispatched.",
            sentAt: existing.releasedAt,
            recipientCount: existing.recipientCount,
            succeededCount: existing.succeededCount,
          });
        }
      } catch (logErr) {
        console.warn(`[${new Date().toISOString()}] PS-RELEASE log check notice: ${logErr.message}`);
      }
    }

    // Reveal-time guard: refuse to broadcast before the official reveal moment
    // (manual override: pass ?force=1 — used by organizers during testing)
    const force = req.query?.force === "1" || req.body?.force === true;
    if (!force && Date.now() < PS_REVEAL_TIMESTAMP) {
      const remaining = PS_REVEAL_TIMESTAMP - Date.now();
      return res.status(202).json({
        success: false,
        message: `Hardware PS not yet revealed. Retry in ${Math.ceil(remaining / 1000)}s.`,
        revealAt: new Date(PS_REVEAL_TIMESTAMP).toISOString(),
      });
    }

    const recipients = await collectRecipients();

    if (recipients.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No registered recipients found to notify.",
        recipientCount: 0,
      });
    }

    const { succeeded, failed } = await dispatchEmails(recipients);

    // Record the dispatch in the release log (only when DB is available)
    if (isDBConnected) {
      try {
        await PSReleaseLog.findOneAndUpdate(
          { releaseKey: RELEASE_KEY },
          {
            releaseKey: RELEASE_KEY,
            recipientCount: recipients.length,
            succeededCount: succeeded,
            failedCount: failed,
            triggeredBy: force ? "manual-test" : "cron-or-visitor",
            releasedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      } catch (logErr) {
        console.warn(`[${new Date().toISOString()}] PS-RELEASE log write notice: ${logErr.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Hardware PS release emails dispatched to ${recipients.length} team leader(s).`,
      recipientCount: recipients.length,
      succeededCount: succeeded,
      failedCount: failed,
      isLiveDB: isDBConnected,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] PS-RELEASE error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to dispatch PS release emails",
      error: error.message,
    });
  }
};

// @desc    Check PS release status (reveal time + whether emails were sent)
// @route   GET /api/ps-release/status
// @access  Public
export const getPSReleaseStatus = async (req, res) => {
  try {
    const isDBConnected = await ensureDB();
    let log = null;
    if (isDBConnected) {
      try {
        log = await PSReleaseLog.findOne({ releaseKey: RELEASE_KEY }).lean();
      } catch (e) {
        log = null;
      }
    }

    const now = Date.now();
    return res.status(200).json({
      success: true,
      isLiveDB: isDBConnected,
      revealed: now >= PS_REVEAL_TIMESTAMP,
      revealAt: new Date(PS_REVEAL_TIMESTAMP).toISOString(),
      remainingMs: Math.max(0, PS_REVEAL_TIMESTAMP - now),
      emailsDispatched: Boolean(log),
      recipientCount: log?.recipientCount || 0,
      succeededCount: log?.succeededCount || 0,
      failedCount: log?.failedCount || 0,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching PS release status" });
  }
};
