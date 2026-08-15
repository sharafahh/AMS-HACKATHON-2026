import mongoose from "mongoose";
﻿import Team from "../models/Team.js";
import Registration from "../models/Registration.js";
import Evaluation from "../models/Evaluation.js";

// Calibrated fair track credit multipliers
export const TRACK_WEIGHTAGES = {
  "AI & Machine Learning": 1.08,
  "Cyber Security": 1.07,
  "Smart Automation": 1.07,
  "Healthcare": 1.06,
  "Disaster Management": 1.05,
  "Agriculture": 1.05,
  "Sustainability": 1.05,
  "Open Innovation": 1.05,
  "Smart Mobility": 1.04,
  "FinTech": 1.04,
  "Smart Education": 1.02,
};

// Fallback demo teams for offline testing & immediate evaluation cockpit demo
const DEMO_TEAMS = [
  {
    _id: "demo-t1",
    registrationId: "HV26-A1092",
    teamName: "NeuralSentinels",
    teamSize: 4,
    track: "AI & Machine Learning",
    problemTitle: "Autonomous Multi-Agent Regulatory Compliance & Auditing Assistant",
    problemAbstract: "Constructed an ensemble LLM agent graph utilizing retrieval augmented generation and fine-tuned AST analyzers to audit enterprise regulatory documents in real time.",
    leader: {
      name: "Aakash Varma",
      email: "aakash.varma@college.edu",
      phone: "+91 98765 43210",
      college: "Aalim Muhammed Salegh College of Engineering",
      department: "CSE (AI & DS)",
      year: "3rd Year",
    },
    members: [
      { name: "Aakash Varma", email: "aakash.varma@college.edu", role: "AI Lead & Orchestrator" },
      { name: "Pooja Sundaram", email: "pooja.s@college.edu", role: "RAG & Vector DB Engineer" },
      { name: "Karthik Raja", email: "karthik.r@college.edu", role: "Fullstack UI/UX Engineer" },
      { name: "Rohit Nambiar", email: "rohit.n@college.edu", role: "Backend API Architect" },
    ],
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    _id: "demo-t2",
    registrationId: "HV26-B8314",
    teamName: "CipherVault",
    teamSize: 4,
    track: "Cyber Security",
    problemTitle: "Zero-Trust Behavioral Identity Verification & Session Hijacking Sentinel",
    problemAbstract: "A passive continuous authentication daemon that monitors biometric keystroke cadence and mouse trajectories to detect stolen session tokens and automated bots.",
    leader: {
      name: "Farhan Siddique",
      email: "farhan.s@college.edu",
      phone: "+91 98451 23456",
      college: "Aalim Muhammed Salegh College of Engineering",
      department: "Information Technology",
      year: "4th Year",
    },
    members: [
      { name: "Farhan Siddique", email: "farhan.s@college.edu", role: "Security Architect" },
      { name: "Zoya Khan", email: "zoya.k@college.edu", role: "ML Behavioral Modeler" },
      { name: "Siddharth Menon", email: "siddharth.m@college.edu", role: "Client Telemetry Daemon" },
      { name: "Deepak Chandran", email: "deepak.c@college.edu", role: "SOC Alert Dashboard" },
    ],
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    _id: "demo-t3",
    registrationId: "HV26-C4920",
    teamName: "PulseGrid IoT",
    teamSize: 4,
    track: "Healthcare",
    problemTitle: "Smart ICU Multi-Vital Telemetry & Sepsis Early Warning Engine",
    problemAbstract: "Embedded ESP32 vital monitor feeding a live clinician telemetry dashboard with predictive time-series machine learning to forecast septic shocks 4 hours in advance.",
    leader: {
      name: "Divya Krishnan",
      email: "divya.k@college.edu",
      phone: "+91 91234 56780",
      college: "Aalim Muhammed Salegh College of Engineering",
      department: "ECE / Biomedical",
      year: "3rd Year",
    },
    members: [
      { name: "Divya Krishnan", email: "divya.k@college.edu", role: "Embedded Firmware Lead" },
      { name: "Arun Prakash", email: "arun.p@college.edu", role: "Biomedical Hardware Tech" },
      { name: "Sneha Reddy", email: "sneha.r@college.edu", role: "Predictive Analytics Dev" },
      { name: "Vikram Sen", email: "vikram.s@college.edu", role: "Clinician Portal UI" },
    ],
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    _id: "demo-t4",
    registrationId: "HV26-D9102",
    teamName: "AgroMesh Robotics",
    teamSize: 5,
    track: "Agriculture",
    problemTitle: "Smart Soil NPK Telemetry & LoRaWAN Autonomous Drone Mesh Gateway",
    problemAbstract: "Solar-powered deep soil sensor pods broadcasting NPK and moisture metrics across 5km over LoRaWAN to generate automated micro-nutrient prescriptions for farmers.",
    leader: {
      name: "Manoj Kumar",
      email: "manoj.k@college.edu",
      phone: "+91 97654 32109",
      college: "Aalim Muhammed Salegh College of Engineering",
      department: "Mechanical & Robotics",
      year: "3rd Year",
    },
    members: [
      { name: "Manoj Kumar", email: "manoj.k@college.edu", role: "Robotics Hardware Lead" },
      { name: "Praveen Raj", email: "praveen.r@college.edu", role: "LoRa Protocol Specialist" },
      { name: "Ananya Iyer", email: "ananya.i@college.edu", role: "Agronomy Analytics Dev" },
      { name: "Suresh Babu", email: "suresh.b@college.edu", role: "Solar Power Engineer" },
      { name: "Meera Nair", email: "meera.n@college.edu", role: "Farmer Dashboard Dev" },
    ],
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    _id: "demo-t5",
    registrationId: "HV26-E3381",
    teamName: "EcoRoute Transit",
    teamSize: 4,
    track: "Smart Mobility",
    problemTitle: "Commercial EV Fleet Battery Telemetry & Dynamic Smart Charging Grid Allocator",
    problemAbstract: "CAN-bus battery degradation forecasting engine paired with integer linear programming to charge commercial delivery fleets at lowest real-time grid power tariffs.",
    leader: {
      name: "Tariq Ansar",
      email: "tariq.a@college.edu",
      phone: "+91 93456 78901",
      college: "Aalim Muhammed Salegh College of Engineering",
      department: "Electrical & Electronics",
      year: "4th Year",
    },
    members: [
      { name: "Tariq Ansar", email: "tariq.a@college.edu", role: "Battery Physics & CAN Lead" },
      { name: "Kavya Murugan", email: "kavya.m@college.edu", role: "Optimization Modeler" },
      { name: "Nikhil Joshi", email: "nikhil.j@college.edu", role: "Fleet Telematics Dev" },
      { name: "Harish Venkat", email: "harish.v@college.edu", role: "Mapbox UI Architect" },
    ],
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
];

// @desc    Get all teams populated with evaluation history
// @route   GET /api/evaluator/teams
// @access  Public (Evaluator Session)
export const getEvaluatorTeams = async (req, res) => {
  try {
    let teams = [];

    try {
      if (mongoose.connection.readyState === 1) {
        teams = await Team.find({ paymentStatus: "PAID" }).sort({ createdAt: 1 }).lean();
      } else {
        teams = DEMO_TEAMS;
      }
      if (!teams || teams.length === 0) {
        teams = await Team.find().sort({ createdAt: 1 }).lean();
      }
    } catch (dbErr) {
      console.warn("Using demo teams fallback:", dbErr.message);
      teams = DEMO_TEAMS;
    }

    if (!teams || teams.length === 0) {
      teams = DEMO_TEAMS;
    }

    // Fetch all evaluations
    let evaluations = [];
    try {
      if (mongoose.connection.readyState === 1) {
        evaluations = await Evaluation.find().lean();
      }
    } catch (evalErr) {
      evaluations = [];
    }

    // Map evaluations to teams
    const teamsWithEvaluations = teams.map((team) => {
      const teamEvals = evaluations.filter(
        (e) => e.registrationId === team.registrationId || e.teamName === team.teamName
      );

      const evaluationsByRound = {
        1: teamEvals.find((e) => e.round === 1) || null,
        2: teamEvals.find((e) => e.round === 2) || null,
        3: teamEvals.find((e) => e.round === 3) || null,
        4: teamEvals.find((e) => e.round === 4) || null,
      };

      const trackMultiplier = TRACK_WEIGHTAGES[team.track] || 1.0;

      return {
        ...team,
        trackMultiplier,
        evaluationsByRound,
      };
    });

    return res.status(200).json({
      success: true,
      count: teamsWithEvaluations.length,
      teams: teamsWithEvaluations,
      trackWeightages: TRACK_WEIGHTAGES,
    });
  } catch (error) {
    console.error("Error in getEvaluatorTeams:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teams for evaluation",
      error: error.message,
    });
  }
};

// @desc    Submit or update evaluation for a team round
// @route   POST /api/evaluator/evaluate
// @access  Public (Evaluator Session)
export const submitEvaluation = async (req, res) => {
  try {
    const {
      registrationId,
      teamName,
      track,
      round,
      evaluatorId = "evaluator-1",
      evaluatorName = "Jury Evaluator",
      scores = {},
      remarks = "",
      actionItemsForNextRound = "",
      previousActionItemsStatus = "N/A",
    } = req.body;

    if (!registrationId || !round) {
      return res.status(400).json({
        success: false,
        message: "Registration ID and Round are required",
      });
    }

    const numRound = Number(round);
    if (![1, 2, 3, 4].includes(numRound)) {
      return res.status(400).json({
        success: false,
        message: "Round must be 1, 2, 3, or 4",
      });
    }

    const innovation = Math.min(10, Math.max(0, Number(scores.innovation) || 0));
    const technical = Math.min(10, Math.max(0, Number(scores.technical) || 0));
    const prototype = Math.min(10, Math.max(0, Number(scores.prototype) || 0));
    const uiux = Math.min(10, Math.max(0, Number(scores.uiux) || 0));
    const presentation = Math.min(10, Math.max(0, Number(scores.presentation) || 0));

    const rawTotal = innovation + technical + prototype + uiux + presentation;
    const trackMultiplier = TRACK_WEIGHTAGES[track] || 1.0;
    const weightedTotal = Number((rawTotal * trackMultiplier).toFixed(2));

    const evalData = {
      registrationId: String(registrationId).trim(),
      teamName: String(teamName || "Team").trim(),
      track: String(track || "Open Innovation").trim(),
      round: numRound,
      evaluatorId: String(evaluatorId).trim(),
      evaluatorName: String(evaluatorName).trim(),
      scores: {
        innovation,
        technical,
        prototype,
        uiux,
        presentation,
      },
      rawTotal,
      trackMultiplier,
      weightedTotal,
      remarks: String(remarks || "").trim(),
      actionItemsForNextRound: String(actionItemsForNextRound || "").trim(),
      previousActionItemsStatus: String(previousActionItemsStatus || "N/A"),
      evaluatedAt: new Date(),
    };

    let savedEvaluation = null;

    try {
      if (mongoose.connection.readyState === 1) {
        savedEvaluation = await Evaluation.findOneAndUpdate(
        { registrationId: evalData.registrationId, round: numRound, evaluatorId: evalData.evaluatorId },
        evalData,
        { new: true, upsert: true }
        );
      } else {
        savedEvaluation = { ...evalData, _id: `eval-${Date.now()}` };
      }
    } catch (dbErr) {
      console.warn("DB Evaluation update warning:", dbErr.message);
      savedEvaluation = { ...evalData, _id: `eval-${Date.now()}` };
    }

    return res.status(200).json({
      success: true,
      message: `Evaluation for ${evalData.teamName} (Round ${numRound}) recorded successfully!`,
      evaluation: savedEvaluation,
    });
  } catch (error) {
    console.error("Error in submitEvaluation:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to record evaluation",
      error: error.message,
    });
  }
};

// @desc    Get Evaluator Leaderboard
// @route   GET /api/evaluator/leaderboard
// @access  Public
export const getEvaluationLeaderboard = async (req, res) => {
  try {
    let evaluations = [];
    try {
      if (mongoose.connection.readyState === 1) {
        evaluations = await Evaluation.find().lean();
      }
    } catch (e) {
      evaluations = [];
    }

    const leaderboardMap = {};

    evaluations.forEach((item) => {
      if (!leaderboardMap[item.registrationId]) {
        leaderboardMap[item.registrationId] = {
          registrationId: item.registrationId,
          teamName: item.teamName,
          track: item.track,
          trackMultiplier: item.trackMultiplier,
          roundsCount: 0,
          rawCumulative: 0,
          weightedCumulative: 0,
          roundsBreakdown: {},
        };
      }

      leaderboardMap[item.registrationId].roundsCount += 1;
      leaderboardMap[item.registrationId].rawCumulative += item.rawTotal;
      leaderboardMap[item.registrationId].weightedCumulative += item.weightedTotal;
      leaderboardMap[item.registrationId].roundsBreakdown[item.round] = {
        rawTotal: item.rawTotal,
        weightedTotal: item.weightedTotal,
        remarks: item.remarks,
      };
    });

    const leaderboard = Object.values(leaderboardMap).sort(
      (a, b) => b.weightedCumulative - a.weightedCumulative
    );

    return res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
    });
  }
};
