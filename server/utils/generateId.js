import crypto from "crypto";

/**
 * Generate a unique registration ID using cryptographically secure random bytes.
 * Format: HV26-XXXXX (5 alphanumeric chars, no ambiguous chars like 0/O/1/I)
 * Uses crypto.randomBytes to prevent collisions.
 * @returns {string}
 */
export const generateRegistrationId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(5);
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars[bytes[i] % chars.length];
  }
  return `HV26-${random}`;
};

export const generateCertificateCode = () => {
  const bytes = crypto.randomBytes(3);
  const num = ((bytes[0] << 16) | (bytes[1] << 8) | bytes[2]) % 900000 + 100000;
  return `CERT-HV2026-${num}`;
};
