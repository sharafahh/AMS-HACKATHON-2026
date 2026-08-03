import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
import Registration from "../models/Registration.js";
import { generateRegistrationId } from "../utils/generateId.js";

// In-memory fallback store if local MongoDB is disconnected
const localMemoryTeams = [];

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

    // Basic Input Validations
    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !college || !department || !track || !problemTitle || !problemAbstract) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const numTeamSize = Number(teamSize);
    if (numTeamSize < 3 || numTeamSize > 6) {
      return res.status(400).json({
        success: false,
        message: "Team size must be between 3 and 6 members",
      });
    }

    if (!members || !Array.isArray(members) || members.length < 3 || members.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Member details must contain between 3 and 6 members",
      });
    }

    const registrationId = generateRegistrationId();

    const teamData = {
      registrationId,
      teamName,
      teamSize: numTeamSize,
      leader: {
        name: leaderName,
        email: leaderEmail,
        phone: leaderPhone,
        college,
        department,
        year: year || "3rd Year",
      },
      members,
      track,
      problemTitle,
      problemAbstract,
      referralCode: referralCode || "",
      status: "CONFIRMED",
      paymentStatus: "UNPAID",
      createdAt: new Date(),
    };

    let createdTeam = null;

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
      console.warn("Saving team to in-memory store fallback:", dbError.message);
      localMemoryTeams.push({ _id: `mem-${Date.now()}`, ...teamData });
      createdTeam = teamData;
    }

    return res.status(201).json({
      success: true,
      message: "Team registered successfully!",
      registrationId: createdTeam.registrationId,
      team: createdTeam,
    });
  } catch (error) {
    console.error("Error in registerTeam:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register team",
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
      teams = await Team.find().sort({ createdAt: -1 });
    } catch (err) {
      teams = [...localMemoryTeams];
    }

    // Fetch registrations from Registration collection
    let registrations = [];
    try {
      registrations = await Registration.find().sort({ registrationTimestamp: -1, createdAt: -1 });
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
    console.error("Error fetching teams:", error);
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
    const queryStr = decodeURIComponent(id).trim();
    if (!queryStr) {
      return res.status(400).json({ success: false, message: "Please provide a valid search query" });
    }

    const regexQuery = new RegExp(`^${queryStr}$`, "i");
    const containsQuery = new RegExp(queryStr, "i");

    let team = null;

    // 1. Search Team collection
    try {
      team = await Team.findOne({
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
      team = localMemoryTeams.find(
        (t) =>
          t.registrationId === queryStr.toUpperCase() ||
          t.leader?.email?.toLowerCase() === queryStr.toLowerCase() ||
          t._id === queryStr
      );
    }

    // 2. If not found in Team collection, search Registration collection
    if (!team) {
      try {
        const reg = await Registration.findOne({
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
    console.error("Error in getTeamById:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving team details",
    });
  }
};
