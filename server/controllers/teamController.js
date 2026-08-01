import Team from "../models/Team.js";
import Payment from "../models/Payment.js";
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
      teams = localMemoryTeams;
    }

    return res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching teams",
    });
  }
};

// @desc    Get single team by ID or registrationId
// @route   GET /api/teams/:id
// @access  Public
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    let team = null;

    try {
      team = await Team.findOne({
        $or: [{ registrationId: id.toUpperCase() }, { _id: id }],
      });
    } catch (err) {
      team = localMemoryTeams.find(
        (t) => t.registrationId === id.toUpperCase() || t._id === id
      );
    }

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving team details",
    });
  }
};
