// Simple in-memory rate limiter for serverless (Vercel) compatibility
// No external dependencies needed

const loginAttempts = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10; // max attempts per window
const LOCKOUT_THRESHOLD = 5; // lock after 5 consecutive failures
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minute lockout

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of loginAttempts.entries()) {
    if (now - data.windowStart > WINDOW_MS) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry) {
    // Check if currently locked out
    if (entry.lockedUntil && now < entry.lockedUntil) {
      const remainingSec = Math.ceil((entry.lockedUntil - now) / 1000);
      console.warn(`[${new Date().toISOString()}] LOGIN_LOCKOUT: IP ${ip} locked for ${remainingSec}s`);
      return res.status(429).json({
        success: false,
        message: `Too many failed login attempts. Account temporarily locked. Try again in ${remainingSec} seconds.`,
      });
    }

    // Reset window if expired
    if (now - entry.windowStart > WINDOW_MS) {
      loginAttempts.set(ip, { windowStart: now, attempts: 1, failures: 0, lockedUntil: null });
      return next();
    }

    // Check rate limit
    if (entry.attempts >= MAX_ATTEMPTS) {
      console.warn(`[${new Date().toISOString()}] LOGIN_RATE_LIMIT: IP ${ip} exceeded ${MAX_ATTEMPTS} attempts`);
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
      });
    }

    entry.attempts += 1;
  } else {
    loginAttempts.set(ip, { windowStart: now, attempts: 1, failures: 0, lockedUntil: null });
  }

  next();
};

// Call this after a failed login to track consecutive failures
export const recordLoginFailure = (req) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const entry = loginAttempts.get(ip);
  if (entry) {
    entry.failures = (entry.failures || 0) + 1;
    if (entry.failures >= LOCKOUT_THRESHOLD) {
      entry.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      console.warn(`[${new Date().toISOString()}] ACCOUNT_LOCKOUT: IP ${ip} locked after ${entry.failures} consecutive failures`);
    }
  }
};

// Call this after a successful login to reset failure count
export const resetLoginFailures = (req) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const entry = loginAttempts.get(ip);
  if (entry) {
    entry.failures = 0;
    entry.lockedUntil = null;
  }
};
