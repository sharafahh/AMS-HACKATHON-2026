// ─── Shared Validation Utilities ───
// Centralized input validation for the AMS Hackathon 2026 registration system.

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,15}$/;

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate a phone number format (7-15 digits, allows +, spaces, dashes, parens).
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.trim();
  if (!PHONE_REGEX.test(cleaned)) return false;
  // Ensure at least 7 actual digits
  const digits = cleaned.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

/**
 * Sanitize a string: trim whitespace, collapse internal whitespace, limit length.
 * @param {*} value - The value to sanitize.
 * @param {number} maxLength - Maximum allowed length (default 200).
 * @returns {string}
 */
export const sanitizeString = (value, maxLength = 200) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
};

/**
 * Validate a team name: must be 2-100 characters, no purely numeric/special-char names.
 * @param {string} name
 * @returns {{valid: boolean, message?: string}}
 */
export const validateTeamName = (name) => {
  const cleaned = sanitizeString(name, 100);
  if (!cleaned || cleaned.length < 2) {
    return { valid: false, message: "Team name must be at least 2 characters long" };
  }
  if (!/[a-zA-Z]/.test(cleaned)) {
    return { valid: false, message: "Team name must contain at least one letter" };
  }
  return { valid: true };
};

/**
 * Validate a person's name: must be 2-100 characters, contain at least one letter.
 * @param {string} name
 * @param {string} fieldLabel - Label for error message (e.g. "Leader name").
 * @returns {{valid: boolean, message?: string}}
 */
export const validatePersonName = (name, fieldLabel = "Name") => {
  const cleaned = sanitizeString(name, 100);
  if (!cleaned || cleaned.length < 2) {
    return { valid: false, message: `${fieldLabel} must be at least 2 characters long` };
  }
  if (!/[a-zA-Z]/.test(cleaned)) {
    return { valid: false, message: `${fieldLabel} must contain at least one letter` };
  }
  return { valid: true };
};

/**
 * Validate all member objects in an array.
 * Each member must have: name (2+ chars), email (valid format), phone (valid format), role.
 * @param {Array} members
 * @returns {{valid: boolean, message?: string}}
 */
export const validateMembers = (members) => {
  if (!Array.isArray(members)) {
    return { valid: false, message: "Members must be an array" };
  }

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const idx = i + 1;

    if (!m || typeof m !== "object") {
      return { valid: false, message: `Member ${idx}: Invalid member data` };
    }

    const nameCheck = validatePersonName(m.name, `Member ${idx} name`);
    if (!nameCheck.valid) return nameCheck;

    if (!isValidEmail(m.email)) {
      return { valid: false, message: `Member ${idx}: Invalid email address "${m.email || ""}"` };
    }

    if (!isValidPhone(m.phone)) {
      return { valid: false, message: `Member ${idx}: Invalid phone number "${m.phone || ""}"` };
    }

    if (!m.role || sanitizeString(m.role).length < 2) {
      return { valid: false, message: `Member ${idx}: Role is required` };
    }
  }

  return { valid: true };
};

/**
 * Check for duplicate emails within a members array.
 * @param {Array} members
 * @returns {{valid: boolean, message?: string}}
 */
export const checkDuplicateMemberEmails = (members) => {
  if (!Array.isArray(members)) return { valid: true };

  const emails = new Set();
  for (let i = 0; i < members.length; i++) {
    const email = (members[i]?.email || "").toLowerCase().trim();
    if (email && emails.has(email)) {
      return { valid: false, message: `Duplicate email found among members: "${email}"` };
    }
    emails.add(email);
  }
  return { valid: true };
};
