import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import Registration from "../models/Registration.js";
import { generateRegistrationId } from "../utils/generateId.js";
import {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  validateTeamName,
  validatePersonName,
  validateMembers,
  checkDuplicateMemberEmails,
} from "../utils/validators.js";

// Escape special regex characters to prevent ReDoS / injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Register a new team
// @route   POST /api/teams/register
// @access  Public
export const registerTeam = async (req, res) => {
  try {
    const {
      teamName,
      teamSize,
      leaderName,
      leaderEmail,
      leaderPhone,
      college,
      department,
      year,
      members,
      track,
      problemTitle,
      problemAbstract,
      referralCode,
    } = req.body;

    // ─── 1. Required Field Validation ───
    const requiredFields = { teamName, leaderName, leaderEmail, leaderPhone, college, department, track, problemTitle, problemAbstract };
    const missingFields = Object.entries(requiredFields)
      .filter(([, val]) => !val || !String(val).trim())
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // ─── 2. Team Name Validation ───
    const teamNameCheck = validateTeamName(teamName);
    if (!teamNameCheck.valid) {
      return res.status(400).json({ success: false, message: teamNameCheck.message });
    }

    // ─── 3. Leader Name Validation ───
    const leaderNameCheck = validatePersonName(leaderName, "Leader name");
    if (!leaderNameCheck.valid) {
      return res.status(400).json({ success: false, message: leaderNameCheck.message });
    }

    // ─── 4. Email Format Validation ───
    if (!isValidEmail(leaderEmail)) {
      return res.status(400).json({
        success: false,
        message: `Invalid leader email address: "${leaderEmail}"`,
      });
    }

    // ─── 5. Phone Number Validation ───
    if (!isValidPhone(leaderPhone)) {
      return res.status(400).json({
        success: false,
        message: `Invalid leader phone number: "${leaderPhone}". Must contain 7-15 digits.`,
      });
    }

    // ─── 6. Team Size Validation ───
    const numTeamSize = Number(teamSize);
    if (!Number.isInteger(numTeamSize) || numTeamSize < 3 || numTeamSize > 6) {
      return res.status(400).json({
        success: false,
        message: "Team size must be an integer between 3 and 6",
      });
    }

    // ─── 7. Members Array Validation ───
    if (!members || !Array.isArray(members) || members.length < 3 || members.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Member details must contain between 3 and 6 members",
      });
    }

    if (members.length !== numTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Team size (${numTeamSize}) does not match number of members provided (${members.length})`,
      });
    }

    // ─── 8. Individual Member Validation ───
    const membersCheck = validateMembers(members);
    if (!membersCheck.valid) {
      return res.status(400).json({ success: false, message: membersCheck.message });
    }

    // ─── 9. Duplicate Email Check Within Members ───
    const dupEmailCheck = checkDuplicateMemberEmails(members);
    if (!dupEmailCheck.valid) {
      return res.status(400).json({ success: false, message: dupEmailCheck.message });
    }

    // ─── 10. Sanitize String Fields ───
    const cleanTeamName = sanitizeString(teamName, 100);
    const cleanLeaderName = sanitizeString(leaderName, 100);
    const cleanLeaderEmail = leaderEmail.trim().toLowerCase();
    const cleanLeaderPhone = leaderPhone.trim();
    const cleanCollege = sanitizeString(college, 200);
    const cleanDepartment = sanitizeString(department, 100);
    const cleanYear = sanitizeString(year || "3rd Year", 20);
    const cleanTrack = sanitizeString(track, 100);
    const cleanProblemTitle = sanitizeString(problemTitle, 200);
    const cleanProblemAbstract = sanitizeString(problemAbstract, 2000);

    // ─── 11. Duplicate Team Name Check (case-insensitive) ───
    const existingTeam = await Team.findOne({
      teamName: { $regex: new RegExp(`^${escapeRegex(cleanTeamName)}$`, "i") },
    });
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: `A team with the name "${cleanTeamName}" is already registered`,
      });
    }

    // Also check Registration collection for duplicate team name
    const existingReg = await Registration.findOne({
      teamName: { $regex: new RegExp(`^${escapeRegex(cleanTeamName)}$`, "i") },
    });
    if (existingReg) {
      return res.status(409).json({
        success: false,
        message: `A team with the name "${cleanTeamName}" is already registered`,
      });
    }

    // ─── 12. Duplicate Leader Email Check ───
    const existingLeaderTeam = await Team.findOne({ "leader.email": cleanLeaderEmail });
    if (existingLeaderTeam) {
      return res.status(409).json({
        success: false,
        message: `The email "${cleanLeaderEmail}" is already registered as a team leader`,
      });
    }

    const existingLeaderReg = await Registration.findOne({
      email: cleanLeaderEmail,
      paymentStatus: { $in: ["PAID", "SUCCESS", "CASH_PAID"] },
    });
    if (existingLeaderReg) {
      return res.status(409).json({
        success: false,
        message: `The email "${cleanLeaderEmail}" is already associated with a paid registration`,
      });
    }

    // ─── 13. Generate Unique Registration ID (with retry) ───
    let registrationId;
    let idAttempts = 0;
    do {
      registrationId = generateRegistrationId();
      idAttempts++;
      const existingId = await Team.findOne({ registrationId });
      if (!existingId) break;
      registrationId = null;
    } while (idAttempts < 5);

    if (!registrationId) {
      console.error("Failed to generate unique registration ID after 5 attempts");
      return res.status(500).json({
        success: false,
        message: "Failed to generate registration ID. Please try again.",
      });
    }

    // ─── 14. Sanitize Member Data ───
    const cleanMembers = members.map((m) => ({
      name: sanitizeString(m.name, 100),
      email: String(m.email).trim().toLowerCase(),
      phone: String(m.phone).trim(),
      role: sanitizeString(m.role, 50) || "Developer",
    }));

    // ─── 15. Save to Database ───
    const teamData = {
      registrationId,
      teamName: cleanTeamName,
      teamSize: numTeamSize,
      leader: {
        name: cleanLeaderName,
        email: cleanLeaderEmail,
        phone: cleanLeaderPhone,
        college: cleanCollege,
        department: cleanDepartment,
        year: cleanYear,
      },
      members: cleanMembers,
      track: cleanTrack,
      problemTitle: cleanProblemTitle,
      problemAbstract: cleanProblemAbstract,
      referralCode: sanitizeString(referralCode, 20) || "",
      status: "CONFIRMED",
      paymentStatus: "UNPAID",
    };

    let createdTeam;
    try {
      createdTeam = await Team.create(teamData);

      // Create stubbed Payment record
      await Payment.create({
        teamId: createdTeam._id,
        registrationId: createdTeam.registrationId,
        amount: 0,
        status: "UNPAID",
      });
    } catch (dbError) {
      // Handle Mongoose duplicate key errors gracefully
      if (dbError.code === 11000) {
        const field = Object.keys(dbError.keyPattern || {})[0] || "field";
        console.error(`Duplicate key error on ${field}:`, dbError.message);
        return res.status(409).json({
          success: false,
          message: `A registration with this ${field} already exists`,
        });
      }

      // Handle Mongoose validation errors
      if (dbError.name === "ValidationError") {
        const firstError = Object.values(dbError.errors)[0];
        console.error("Validation error:", firstError.message);
        return res.status(400).json({
          success: false,
          message: firstError.message,
        });
      }

      console.error("Failed to save team to database:", dbError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to save registration. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Team registered successfully!",
      registrationId: createdTeam.registrationId,
      team: createdTeam,
    });
  } catch (error) {
    console.error("Error in registerTeam:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to register team",
    });
  }
};

// @desc    Get all registered teams
// @route   GET /api/teams
// @access  Public / Admin
export const getTeams = async (req, res) => {
  try {
    let teams = [];
    try {
      teams = await Team.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    } catch (err) {
      console.error("Error querying Team collection:", err.message);
      teams = [];
    }

    // Fetch registrations from Registration collection
    let registrations = [];
    try {
      registrations = await Registration.find({ isDeleted: { $ne: true } }).sort({ registrationTimestamp: -1, createdAt: -1 });
    } catch (regErr) {
      console.warn("Could not query Registration collection:", regErr.message);
    }

    // Merge registration documents into teams list if not already present
    const existingRegistrationIds = new Set(teams.map(t => t.registrationId).filter(Boolean));
    const existingTeamNames = new Set(teams.map(t => t.teamName?.toLowerCase()).filter(Boolean));

    for (const reg of registrations) {
      const regId = reg.razorpayOrderId || `REG-${reg._id.toString().slice(-6).toUpperCase()}`;
      if (!existingRegistrationIds.has(regId) && !existingTeamNames.has(reg.teamName?.toLowerCase())) {
        const numMembers = Array.isArray(reg.teamMembers) && reg.teamMembers.length > 0 ? reg.teamMembers.length : 3;
        teams.push({
          _id: reg._id,
          registrationId: regId,
          teamName: reg.teamName,
          teamSize: numMembers,
          leader: {
            name: reg.teamLeaderName,
            email: reg.email,
            phone: reg.phoneNumber,
            college: reg.collegeName,
            department: reg.department,
            year: reg.year || "3rd Year",
          },
          members: reg.teamMembers || [],
          track: "Open Innovation",
          problemTitle: "AMS Hackathon Challenge",
          problemAbstract: "Submitted during registration",
          paymentStatus: reg.paymentStatus || "PAID",
          status: "CONFIRMED",
          createdAt: reg.registrationTimestamp || reg.createdAt,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching teams",
    });
  }
};

// @desc    Get single team by ID, registrationId, email, or phone
// @route   GET /api/teams/:id
// @access  Public
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryStr = sanitizeString(decodeURIComponent(id), 200);
    if (!queryStr || queryStr.length < 2) {
      return res.status(400).json({ success: false, message: "Please provide a valid search query (at least 2 characters)" });
    }

    const escaped = escapeRegex(queryStr);
    const regexQuery = new RegExp(`^${escaped}$`, "i");
    const containsQuery = new RegExp(escaped, "i");

    let team = null;

    // 1. Search Team collection
    try {
      team = await Team.findOne({
        isDeleted: { $ne: true },
        $or: [
          { registrationId: regexQuery },
          { registrationId: queryStr.toUpperCase() },
          { "leader.email": regexQuery },
          { "leader.email": containsQuery },
          { "leader.phone": regexQuery },
          { teamName: regexQuery },
          { _id: queryStr.match(/^[0-9a-fA-F]{24}$/) ? queryStr : null },
        ],
      });
    } catch (err) {
      console.error("Error querying Team collection in getTeamById:", err.message);
    }

    // 2. If not found in Team collection, search Registration collection
    if (!team) {
      try {
        const reg = await Registration.findOne({
          isDeleted: { $ne: true },
          $or: [
            { razorpayOrderId: queryStr },
            { razorpayPaymentId: queryStr },
            { email: regexQuery },
            { email: containsQuery },
            { phoneNumber: queryStr },
            { teamName: regexQuery },
            { _id: queryStr.match(/^[0-9a-fA-F]{24}$/) ? queryStr : null },
          ],
        });

        if (reg) {
          const numMembers = Array.isArray(reg.teamMembers) && reg.teamMembers.length > 0 ? reg.teamMembers.length : 3;
          team = {
            _id: reg._id,
            registrationId: reg.razorpayOrderId || `REG-${reg._id.toString().slice(-6).toUpperCase()}`,
            teamName: reg.teamName,
            teamSize: numMembers,
            leader: {
              name: reg.teamLeaderName,
              email: reg.email,
              phone: reg.phoneNumber,
              college: reg.collegeName,
              department: reg.department,
              year: reg.year || "3rd Year",
            },
            members: reg.teamMembers || [],
            track: "Open Innovation",
            problemTitle: "AMS Hackathon Challenge",
            problemAbstract: "Submitted during registration",
            paymentStatus: reg.paymentStatus || "PAID",
            status: "CONFIRMED",
            createdAt: reg.registrationTimestamp || reg.createdAt,
          };
        }
      } catch (regErr) {
        console.warn("Could not query Registration collection in getTeamById:", regErr.message);
      }
    }

    if (!team) {
      return res.status(404).json({
        success: false,
        message: `No registration found matching "${queryStr}".`,
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Error in getTeamById:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error retrieving team details",
    });
  }
};
