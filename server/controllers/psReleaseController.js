import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Team from "../models/Team.js";
import PSReleaseLog from "../models/PSReleaseLog.js";
import {
  sendHardwarePSReleaseEmail,
  sendHardwarePSHeadsUpEmail,
} from "../utils/emailService.js";
import connectDB from "../config/db.js";

// Hardware problem statement reveal moment (11:01 AM IST, Aug 19 2026 = 05:31 UTC)
// Overridable via env for testing (PS_REVEAL_TIMESTAMP, epoch ms)
export const PS_REVEAL_TIMESTAMP = Number(process.env.PS_REVEAL_TIMESTAMP) ||
  new Date("2026-08-19T11:01:00+05:30").getTime();

const RELEASE_KEY = "hardware-ps-2026";
const HEADSUP_KEY = "hardware-ps-headsup-2026";

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
const dispatchEmails = async (recipients, emailFn) => {
  const results = { succeeded: 0, failed: 0 };
  const BATCH = 10;

  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    const outcomes = await Promise.all(
      batch.map((r) =>
        emailFn(r).then(
          (ok) => (ok ? "ok" : "fail"),
          () => "fail"
        )
      )
    );
    outcomes.forEach((o) => (o === "ok" ? results.succeeded++ : results.failed++));
  }

  return results;
};

// Check whether SMTP credentials are configured (email readiness flag)
const isSMTPConfigured = () => {
  return Boolean(
    (process.env.SMTP_USER || process.env.EMAIL_USER) &&
    (process.env.SMTP_PASS || process.env.EMAIL_PASS)
  );
};

// @desc    Broadcast hardware PS release or heads-up emails to registered team leaders
// @route   POST /api/ps-release/notify  (also GET for Vercel cron)
// @query   type=release|headsup   (default release)
// @query   testEmail=you@x.com    (send ONE email to this address only, no broadcast)
// @query   force=1                (bypass reveal-time guard — organizer testing)
// @access  Public-ish: guarded by reveal-time window + one-time log (idempotent)
export const notifyPSRelease = async (req, res) => {
  try {
    const isDBConnected = await ensureDB();
    const type = req.query?.type === "headsup" ? "headsup" : "release";
    const emailFn = type === "headsup" ? sendHardwarePSHeadsUpEmail : sendHardwarePSReleaseEmail;
    const logKey = type === "headsup" ? HEADSUP_KEY : RELEASE_KEY;
    const force = req.query?.force === "1" || req.body?.force === true;

    // Test mode: single email to the given address, skips broadcast + log entirely
    const testEmail = String(req.query?.testEmail || req.body?.testEmail || "").trim();
    if (testEmail) {
      const ok = await emailFn({
        toEmail: testEmail,
        leaderName: "Test Recipient",
        teamName: "AMS Hackathon Test",
        registrationId: "HV26-TEST",
      });
      return res.status(ok ? 200 : 500).json({
        success: ok,
        mode: "test",
        type,
        message: ok
          ? `Test ${type} email sent to ${testEmail}.`
          : `Test ${type} email FAILED (check SMTP config).`,
        smtpConfigured: isSMTPConfigured(),
      });
    }

    // Idempotency guard: never send the same broadcast twice
    if (isDBConnected) {
      try {
        const existing = await PSReleaseLog.findOne({ releaseKey: logKey }).lean();
        if (existing) {
          return res.status(200).json({
            success: true,
            alreadySent: true,
            type,
            message: `${type === "headsup" ? "Heads-up" : "Hardware PS release"} emails already dispatched.`,
            sentAt: existing.releasedAt,
            recipientCount: existing.recipientCount,
            succeededCount: existing.succeededCount,
          });
        }
      } catch (logErr) {
        console.warn(`[${new Date().toISOString()}] PS-RELEASE log check notice: ${logErr.message}`);
      }
    }

    // Reveal-time guard:
    // - heads-up is a pre-reveal coordinator action → requires force=1
    // - release broadcast auto-fires at the reveal moment (cron/visitor backup),
    //   or earlier with force=1 (organizer testing)
    if (!force && Date.now() < PS_REVEAL_TIMESTAMP) {
      if (type === "headsup") {
        return res.status(403).json({
          success: false,
          message: "Heads-up emails are a coordinator action. Pass ?force=1 to send before reveal.",
        });
      }
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

    const { succeeded, failed } = await dispatchEmails(recipients, emailFn);

    // Record the dispatch in the release log (only when DB is available)
    if (isDBConnected) {
      try {
        await PSReleaseLog.findOneAndUpdate(
          { releaseKey: logKey },
          {
            releaseKey: logKey,
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
      type,
      message: `${type === "headsup" ? "Heads-up" : "Hardware PS release"} emails dispatched to ${recipients.length} team leader(s).`,
      recipientCount: recipients.length,
      succeededCount: succeeded,
      failedCount: failed,
      isLiveDB: isDBConnected,
      smtpConfigured: isSMTPConfigured(),
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

// @desc    Check PS release status (reveal time + whether emails were sent + SMTP readiness)
// @route   GET /api/ps-release/status
// @access  Public
export const getPSReleaseStatus = async (req, res) => {
  try {
    const isDBConnected = await ensureDB();
    let releaseLog = null;
    let headsupLog = null;
    if (isDBConnected) {
      try {
        [releaseLog, headsupLog] = await Promise.all([
          PSReleaseLog.findOne({ releaseKey: RELEASE_KEY }).lean(),
          PSReleaseLog.findOne({ releaseKey: HEADSUP_KEY }).lean(),
        ]);
      } catch (e) {
        releaseLog = null;
        headsupLog = null;
      }
    }

    const now = Date.now();
    return res.status(200).json({
      success: true,
      isLiveDB: isDBConnected,
      smtpConfigured: isSMTPConfigured(),
      revealed: now >= PS_REVEAL_TIMESTAMP,
      revealAt: new Date(PS_REVEAL_TIMESTAMP).toISOString(),
      remainingMs: Math.max(0, PS_REVEAL_TIMESTAMP - now),
      headsUpDispatched: Boolean(headsupLog),
      emailsDispatched: Boolean(releaseLog),
      headsUp: {
        dispatched: Boolean(headsupLog),
        recipientCount: headsupLog?.recipientCount || 0,
        succeededCount: headsupLog?.succeededCount || 0,
        failedCount: headsupLog?.failedCount || 0,
      },
      release: {
        dispatched: Boolean(releaseLog),
        recipientCount: releaseLog?.recipientCount || 0,
        succeededCount: releaseLog?.succeededCount || 0,
        failedCount: releaseLog?.failedCount || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching PS release status" });
  }
};
