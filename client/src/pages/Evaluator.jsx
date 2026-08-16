import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiSearch,
  FiChevronRight,
  FiChevronLeft,
  FiUnlock,
  FiSave,
  FiBarChart2,
  FiSliders,
  FiInfo,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiFileText,
  FiTrendingUp,
  FiShield,
  FiMessageSquare,
  FiCornerDownRight,
  FiLayers,
  FiUserCheck,
  FiMenu,
  FiX,
  FiMinus,
  FiPlus,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiExternalLink,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";
import {
  getEvaluatorTeamsAPI,
  submitEvaluationAPI,
  getEvaluationLeaderboardAPI,
} from "../services/api";

const RUBRIC_CRITERIA = [
  {
    key: "innovation",
    label: "Innovation & Originality",
    category: "Concept & Vision",
    desc: "Uniqueness of solution, creative disruption, and novel problem-solving approach.",
    max: 10,
  },
  {
    key: "technical",
    label: "Architecture & Complexity",
    category: "Engineering Depth",
    desc: "System design, algorithm choice, code structure, data pipeline, and scalability.",
    max: 10,
  },
  {
    key: "prototype",
    label: "Working Prototype & Execution",
    category: "Implementation",
    desc: "Functional completeness, live working demo, edge case handling, and hardware/software stability.",
    max: 10,
  },
  {
    key: "uiux",
    label: "Design Craft & Usability",
    category: "Experience",
    desc: "Aesthetic refinement, ergonomic flow, friction-free interaction, and visual polish.",
    max: 10,
  },
  {
    key: "presentation",
    label: "Pitch & Defense",
    category: "Communication",
    desc: "Clarity of demonstration, depth of jury Q&A defense, and real-world viability articulation.",
    max: 10,
  },
];

const EVALUATOR_PROFILES = [
  { id: "eval-1", name: "Dr. S. K. Ramanathan", role: "Chief Technical Jury (AI & Systems)" },
  { id: "eval-2", name: "Prof. M. Anitha", role: "Lead Systems Architect & Security" },
  { id: "eval-3", name: "Er. Vikramaditya", role: "Industry Embedded & IoT Specialist" },
];

const VALID_PASSCODES = ["AMS2026", "JURY2026", "EVAL2026", "DEMO2026", "ADMIN2026"];

function Evaluator() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ams_evaluator_auth") === "true";
  });
  const [activeEvaluator, setActiveEvaluator] = useState(() => {
    const saved = sessionStorage.getItem("ams_evaluator_profile");
    return saved ? JSON.parse(saved) : EVALUATOR_PROFILES[0];
  });
  const [loginPass, setLoginPass] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation & Views
  const [activeView, setActiveView] = useState("evaluate"); // 'evaluate' | 'leaderboard'
  const [selectedRound, setSelectedRound] = useState(1); // 1, 2, 3, 4
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showAbstractModal, setShowAbstractModal] = useState(false);

  // Data States
  const [teams, setTeams] = useState([]);
  const [isLiveDB, setIsLiveDB] = useState(false);
  const [trackWeightages, setTrackWeightages] = useState({});
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'EVALUATED' | 'PENDING'

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // Active Team Scoring State
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    prototype: 0,
    uiux: 0,
    presentation: 0,
  });
  const [remarks, setRemarks] = useState("");
  const [actionItemsForNextRound, setActionItemsForNextRound] = useState("");
  const [previousActionItemsStatus, setPreviousActionItemsStatus] = useState("N/A");

  // Load teams and evaluations from MongoDB Atlas
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getEvaluatorTeamsAPI();
      if (data.success && Array.isArray(data.teams)) {
        setTeams(data.teams);
        setIsLiveDB(Boolean(data.isLiveDB));
        if (data.trackWeightages) setTrackWeightages(data.trackWeightages);
      }
    } catch (err) {
      console.warn("Using offline evaluator store:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load leaderboard directly from MongoDB Atlas
  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const data = await getEvaluationLeaderboardAPI();
      if (data.success && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeView === "leaderboard") {
      fetchLeaderboard();
    }
  }, [isAuthenticated, activeView]);

  // Filtered teams list based on search and track filter
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        team.teamName?.toLowerCase().includes(q) ||
        team.registrationId?.toLowerCase().includes(q) ||
        team.leader?.name?.toLowerCase().includes(q) ||
        team.track?.toLowerCase().includes(q);

      const matchesTrack =
        selectedTrackFilter === "ALL" || team.track === selectedTrackFilter;

      const evalForRound = team.evaluationsByRound?.[selectedRound];
      const isEvaluated = Boolean(evalForRound && evalForRound.rawTotal > 0);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "EVALUATED" && isEvaluated) ||
        (statusFilter === "PENDING" && !isEvaluated);

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [teams, searchQuery, selectedTrackFilter, statusFilter, selectedRound]);

  // Current active team
  const currentTeam = useMemo(() => {
    if (!filteredTeams.length) return null;
    return filteredTeams[Math.min(selectedTeamIndex, filteredTeams.length - 1)];
  }, [filteredTeams, selectedTeamIndex]);

  // Synchronize score form whenever current team, round, or evaluation state updates
  useEffect(() => {
    if (!currentTeam) {
      setScores({ innovation: 0, technical: 0, prototype: 0, uiux: 0, presentation: 0 });
      setRemarks("");
      setActionItemsForNextRound("");
      setPreviousActionItemsStatus("N/A");
      return;
    }

    const evalData = currentTeam.evaluationsByRound?.[selectedRound];
    if (evalData && evalData.scores) {
      setScores({
        innovation: Number(evalData.scores.innovation) || 0,
        technical: Number(evalData.scores.technical) || 0,
        prototype: Number(evalData.scores.prototype) || 0,
        uiux: Number(evalData.scores.uiux) || 0,
        presentation: Number(evalData.scores.presentation) || 0,
      });
      setRemarks(evalData.remarks || "");
      setActionItemsForNextRound(evalData.actionItemsForNextRound || "");
      setPreviousActionItemsStatus(evalData.previousActionItemsStatus || "N/A");
    } else {
      setScores({ innovation: 0, technical: 0, prototype: 0, uiux: 0, presentation: 0 });
      setRemarks("");
      setActionItemsForNextRound("");
      setPreviousActionItemsStatus("N/A");
    }
  }, [currentTeam, selectedRound]);

  // Score calculations
  const rawTotal = useMemo(() => {
    return (
      (Number(scores.innovation) || 0) +
      (Number(scores.technical) || 0) +
      (Number(scores.prototype) || 0) +
      (Number(scores.uiux) || 0) +
      (Number(scores.presentation) || 0)
    );
  }, [scores]);

  const trackMultiplier = useMemo(() => {
    if (!currentTeam) return 1.0;
    return trackWeightages[currentTeam.track] || currentTeam.trackMultiplier || 1.0;
  }, [currentTeam, trackWeightages]);

  const weightedTotal = useMemo(() => {
    return Number((rawTotal * trackMultiplier).toFixed(2));
  }, [rawTotal, trackMultiplier]);

  // Stepper handlers
  const handleScoreChange = (key, delta) => {
    setScores((prev) => {
      const currentVal = Number(prev[key]) || 0;
      const nextVal = Math.min(10, Math.max(0, currentVal + delta));
      return { ...prev, [key]: nextVal };
    });
  };

  const setScoreDirect = (key, val) => {
    const num = Math.min(10, Math.max(0, Number(val) || 0));
    setScores((prev) => ({ ...prev, [key]: num }));
  };

  // Authentication Login
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const clean = loginPass.trim().toUpperCase();
    if (VALID_PASSCODES.includes(clean)) {
      sessionStorage.setItem("ams_evaluator_auth", "true");
      sessionStorage.setItem("ams_evaluator_profile", JSON.stringify(activeEvaluator));
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Jury Access Key. Please check with hackathon committee.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ams_evaluator_auth");
    sessionStorage.removeItem("ams_evaluator_profile");
    setIsAuthenticated(false);
  };

  // Submit Evaluation to MongoDB Atlas
  const handleSave = async (advanceNext = false) => {
    if (!currentTeam) return;

    setSaving(true);
    try {
      const payload = {
        registrationId: currentTeam.registrationId,
        teamName: currentTeam.teamName,
        track: currentTeam.track,
        round: selectedRound,
        evaluatorId: activeEvaluator.id,
        evaluatorName: activeEvaluator.name,
        scores,
        remarks,
        actionItemsForNextRound,
        previousActionItemsStatus,
      };

      const res = await submitEvaluationAPI(payload);

      if (res.success) {
        setSaveToast(`Saved Round ${selectedRound} evaluation for ${currentTeam.teamName}!`);
        setTimeout(() => setSaveToast(""), 3500);

        // Update local state cache
        setTeams((prevTeams) =>
          prevTeams.map((t) => {
            if (t.registrationId === currentTeam.registrationId) {
              return {
                ...t,
                evaluationsByRound: {
                  ...t.evaluationsByRound,
                  [selectedRound]: res.evaluation || {
                    round: selectedRound,
                    scores,
                    rawTotal,
                    trackMultiplier,
                    weightedTotal,
                    remarks,
                    actionItemsForNextRound,
                    previousActionItemsStatus,
                  },
                },
              };
            }
            return t;
          })
        );

        if (advanceNext && selectedTeamIndex < filteredTeams.length - 1) {
          setSelectedTeamIndex((prev) => prev + 1);
        }
      }
    } catch (err) {
      alert("Failed to submit score: " + (err.message || "Network error"));
    } finally {
      setSaving(false);
    }
  };

  // Export Leaderboard to CSV
  const exportLeaderboardCSV = () => {
    if (!leaderboard.length) return alert("No leaderboard records available to export.");

    const headers = ["Rank", "Registration ID", "Team Name", "Track", "Multiplier", "Rounds Completed", "Cumulative Weighted Score"];
    const rows = leaderboard.map((item, idx) => [
      idx + 1,
      item.registrationId,
      item.teamName,
      item.track,
      item.trackMultiplier,
      item.roundsCount,
      item.weightedCumulative,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,﻿" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AMS_Hackathon_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tracksList = useMemo(() => {
    const set = new Set(teams.map((t) => t.track).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [teams]);

  return (
    <div className="min-h-screen clay-page-bg text-slate-800 font-['Inter'] selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Floating Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 clay-card px-5 py-3.5 bg-white border-2 border-emerald-500/80 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xl"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <FiCheckCircle size={16} />
            </div>
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── AUTHENTICATION GATE (CLAYMORPHISM) ─── */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full clay-card-elevated p-8 sm:p-10 space-y-7 relative"
          >
            {/* Header Brand */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <div className="clay-badge p-2 bg-white">
                  <img src={collegeLogo} alt="College Logo" className="h-9 w-auto object-contain" />
                </div>
                <div className="h-6 w-[2px] bg-slate-200" />
                <div className="clay-badge p-2 bg-white">
                  <img src={amsHackathonLogo} alt="Hackathon Logo" className="h-9 w-auto object-contain" />
                </div>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                  Jury & Evaluator Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 mt-2">
                  AMS HACKATHON 2026
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  Multi-Round Scoring, Fair Weightages & Live Atlas Database Sync
                </p>
              </div>
            </div>

            {/* Evaluator Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Evaluator Identity
              </label>
              <div className="grid grid-cols-1 gap-2">
                {EVALUATOR_PROFILES.map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setActiveEvaluator(prof)}
                    className={`p-3 rounded-2xl text-left transition-all clay-card-interactive cursor-pointer ${
                      activeEvaluator.id === prof.id
                        ? "clay-card-active bg-indigo-50/50"
                        : "clay-card-subtle bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{prof.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{prof.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Passcode Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Jury Security Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter Jury Key (e.g. AMS2026)"
                    className="w-full clay-input px-4 py-3.5 text-sm font-semibold tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  <FiShield className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                </div>
                {authError && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1.5 pt-1">
                    <FiAlertCircle size={14} /> {authError}
                  </p>
                )}
              </div>

              {/* Quick Preset Passcodes */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Quick Keys:</span>
                {["AMS2026", "JURY2026"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLoginPass(code)}
                    className="px-2.5 py-1 rounded-lg clay-badge bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full clay-btn-primary py-3.5 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <FiUnlock size={16} />
                <span>Enter Evaluation Workspace</span>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-200">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <FiArrowLeft size={14} /> Return to Public Homepage
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ─── MAIN EVALUATION APP (CLAYMORPHISM) ─── */
        <main className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto p-3 sm:p-6 space-y-5">
          {/* Top Claymorphic Navigation Bar */}
          <header className="clay-card p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Brand info */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3">
                <Link to="/" className="clay-btn-secondary p-2.5 flex items-center justify-center text-slate-600 hover:text-indigo-600">
                  <FiArrowLeft size={16} />
                </Link>
                <div className="flex items-center gap-2">
                  <img src={collegeLogo} alt="College" className="h-8 w-auto object-contain" />
                  <div className="h-5 w-[1.5px] bg-slate-200" />
                  <img src={amsHackathonLogo} alt="AMS" className="h-8 w-auto object-contain" />
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold font-['Space_Grotesk'] text-slate-900 leading-tight">
                      AMS HACKATHON 2026
                    </h2>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                      Jury Scoring Console
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden clay-btn-secondary p-2.5 text-slate-700 flex items-center gap-1 text-xs font-bold"
              >
                <FiMenu size={16} /> Teams ({filteredTeams.length})
              </button>
            </div>

            {/* Center: Evaluation Round Selector Pills */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 shadow-inner overflow-x-auto max-w-full">
              {[
                { r: 1, label: "Round 1", sub: "Ideation & Design" },
                { r: 2, label: "Round 2", sub: "Architecture" },
                { r: 3, label: "Round 3", sub: "Working Demo" },
                { r: 4, label: "Round 4", sub: "Final Pitch" },
              ].map((roundItem) => (
                <button
                  key={roundItem.r}
                  type="button"
                  onClick={() => setSelectedRound(roundItem.r)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRound === roundItem.r
                      ? "clay-btn-primary shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span>{roundItem.label}</span>
                  <span className="hidden sm:inline text-[10px] opacity-80 ml-1.5 font-normal">
                    ({roundItem.sub})
                  </span>
                </button>
              ))}
            </div>

            {/* Right: View Toggle, Evaluator Badge & Logout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView("evaluate")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === "evaluate"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FiSliders size={13} />
                  <span>Evaluate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("leaderboard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === "leaderboard"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FiBarChart2 size={13} />
                  <span>Leaderboard</span>
                </button>
              </div>

              {/* Active Evaluator Badge */}
              <div className="clay-badge px-3 py-1.5 bg-white border border-slate-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-left hidden lg:block">
                  <div className="text-[11px] font-bold text-slate-800 leading-none">{activeEvaluator.name}</div>
                  <div className="text-[9px] text-slate-500 font-medium">Jury Evaluator</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Lock Session / Logout"
                className="clay-btn-secondary p-2.5 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              >
                <FiUnlock size={15} />
              </button>
            </div>
          </header>

          {/* ─── LEADERBOARD VIEW (CLAYMORPHISM) ─── */}
          {activeView === "leaderboard" ? (
            <section className="space-y-6">
              {/* Leaderboard Top Controls Card */}
              <div className="clay-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-slate-900 flex items-center gap-2.5">
                    <FiAward className="text-amber-500" size={24} />
                    Live Hackathon Jury Leaderboard
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Normalized scores across all 4 rounds adjusted by track domain complexity multipliers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={fetchLeaderboard}
                    disabled={leaderboardLoading}
                    className="clay-btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 text-slate-700"
                  >
                    <FiRefreshCw className={leaderboardLoading ? "animate-spin text-indigo-600" : ""} size={14} />
                    <span>Refresh Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportLeaderboardCSV}
                    className="clay-btn-primary px-4 py-2.5 text-xs font-bold flex items-center gap-2"
                  >
                    <FiDownload size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Podium Top 3 Cards */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="clay-card p-6 border-t-4 border-slate-400 flex flex-col justify-between order-2 md:order-1"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold clay-badge">
                          🥈 2nd Place
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{leaderboard[1].registrationId}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{leaderboard[1].teamName}</h3>
                        <span className="text-xs font-semibold text-indigo-600">{leaderboard[1].track}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-end justify-between">
                      <span className="text-xs text-slate-500">Cumulative Score</span>
                      <span className="text-2xl font-extrabold font-['Space_Grotesk'] text-slate-800">
                        {leaderboard[1].weightedCumulative}
                      </span>
                    </div>
                  </motion.div>

                  {/* 1st Place (Gold Champion) */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="clay-card-elevated p-6 border-t-4 border-amber-500 bg-gradient-to-b from-amber-50/40 to-white flex flex-col justify-between order-1 md:order-2 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold clay-badge flex items-center gap-1.5">
                          🏆 1st Champion
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{leaderboard[0].registrationId}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">{leaderboard[0].teamName}</h3>
                        <span className="text-xs font-bold text-indigo-600">{leaderboard[0].track}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-amber-100 mt-4 flex items-end justify-between">
                      <span className="text-xs text-amber-800 font-bold">Total Weighted Score</span>
                      <span className="text-3xl font-extrabold font-['Space_Grotesk'] text-amber-600">
                        {leaderboard[0].weightedCumulative}
                      </span>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="clay-card p-6 border-t-4 border-amber-700 flex flex-col justify-between order-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-orange-100 text-amber-900 text-xs font-extrabold clay-badge">
                          🥉 3rd Place
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">{leaderboard[2].registrationId}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{leaderboard[2].teamName}</h3>
                        <span className="text-xs font-semibold text-indigo-600">{leaderboard[2].track}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-end justify-between">
                      <span className="text-xs text-slate-500">Cumulative Score</span>
                      <span className="text-2xl font-extrabold font-['Space_Grotesk'] text-slate-800">
                        {leaderboard[2].weightedCumulative}
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Full Standings Table */}
              <div className="clay-card overflow-hidden">
                <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Full Team Standings</h3>
                  <span className="text-xs text-slate-500">{leaderboard.length} Teams Ranked</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4 text-center w-12">Rank</th>
                        <th className="py-3.5 px-4">Registration ID</th>
                        <th className="py-3.5 px-4">Team Name</th>
                        <th className="py-3.5 px-4">Track</th>
                        <th className="py-3.5 px-4 text-center">Track Multiplier</th>
                        <th className="py-3.5 px-4 text-center">Rounds Evaluated</th>
                        <th className="py-3.5 px-4 text-right">Weighted Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard.map((item, idx) => (
                        <tr key={item.registrationId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 text-center font-extrabold text-slate-700">
                            {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : `#${idx + 1}`}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{item.registrationId}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.teamName}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.track}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs clay-badge">
                              {item.trackMultiplier}x
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                            {item.roundsCount} / 4
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold font-['Space_Grotesk'] text-slate-900 text-base">
                            {item.weightedCumulative}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            /* ─── EVALUATOR WORKSPACE (CLAYMORPHISM) ─── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
              {/* Left Sidebar: Team Browser & Selector (4 Cols on Desktop) */}
              <aside className="hidden lg:flex lg:col-span-4 flex-col clay-card p-4 space-y-4 max-h-[calc(100vh-140px)] sticky top-6 overflow-hidden">
                {/* Search & Track Filter */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedTeamIndex(0);
                      }}
                      placeholder="Search team or reg ID..."
                      className="w-full clay-input pl-9 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={selectedTrackFilter}
                      onChange={(e) => {
                        setSelectedTrackFilter(e.target.value);
                        setSelectedTeamIndex(0);
                      }}
                      className="clay-input px-2.5 py-2 text-[11px] font-semibold text-slate-700 bg-white"
                    >
                      {tracksList.map((t) => (
                        <option key={t} value={t}>
                          {t === "ALL" ? "All Tracks" : t}
                        </option>
                      ))}
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setSelectedTeamIndex(0);
                      }}
                      className="clay-input px-2.5 py-2 text-[11px] font-semibold text-slate-700 bg-white"
                    >
                      <option value="ALL">All Status</option>
                      <option value="EVALUATED">Evaluated</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Team Cards List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
                  {loading ? (
                    <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
                      <FiRefreshCw className="animate-spin text-indigo-600" size={20} />
                      <span>Loading teams from database...</span>
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs clay-card-subtle p-4">
                      No matching teams found.
                    </div>
                  ) : (
                    filteredTeams.map((team, idx) => {
                      const evalForRound = team.evaluationsByRound?.[selectedRound];
                      const isEvaluated = Boolean(evalForRound && evalForRound.rawTotal > 0);
                      const isSelected = currentTeam?.registrationId === team.registrationId;

                      return (
                        <button
                          key={team.registrationId || idx}
                          type="button"
                          onClick={() => setSelectedTeamIndex(idx)}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all clay-card-interactive cursor-pointer ${
                            isSelected
                              ? "clay-card-active bg-indigo-50/60"
                              : "clay-card-subtle bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-[11px] text-indigo-700">
                              {team.registrationId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full clay-badge ${
                                isEvaluated
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isEvaluated ? `R${selectedRound}: ${evalForRound.weightedTotal} pts` : "Pending"}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate">
                            {team.teamName}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                            <span className="truncate max-w-[170px]">{team.track}</span>
                            <span className="font-semibold text-indigo-600">
                              {(trackWeightages[team.track] || 1.0)}x
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Mobile Sliding Drawer for Teams */}
              <AnimatePresence>
                {mobileDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden flex justify-end"
                  >
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      className="w-full max-w-sm bg-white h-full p-5 space-y-4 overflow-y-auto flex flex-col shadow-2xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <h3 className="font-extrabold text-slate-900 text-sm">Select Team ({filteredTeams.length})</h3>
                        <button
                          type="button"
                          onClick={() => setMobileDrawerOpen(false)}
                          className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                        >
                          <FiX size={18} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search teams..."
                          className="w-full clay-input px-3.5 py-2 text-xs"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2">
                        {filteredTeams.map((team, idx) => (
                          <button
                            key={team.registrationId || idx}
                            type="button"
                            onClick={() => {
                              setSelectedTeamIndex(idx);
                              setMobileDrawerOpen(false);
                            }}
                            className="w-full text-left p-3 rounded-xl clay-card-subtle bg-slate-50 hover:bg-indigo-50 transition-colors"
                          >
                            <div className="font-mono text-xs text-indigo-600 font-bold">{team.registrationId}</div>
                            <div className="font-bold text-slate-900 text-xs">{team.teamName}</div>
                            <div className="text-[10px] text-slate-500">{team.track}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right: Main Evaluation Workspace (8 Cols on Desktop) */}
              <section className="lg:col-span-8 space-y-5">
                {!currentTeam ? (
                  <div className="clay-card p-12 text-center text-slate-500 space-y-3">
                    <FiUsers className="mx-auto text-indigo-400" size={36} />
                    <h3 className="text-lg font-bold text-slate-800">No Team Selected</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Please select a team from the left sidebar to commence scoring for Round {selectedRound}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Team Header Info Card (Claymorphic) */}
                    <div className="clay-card p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 clay-badge">
                              {currentTeam.registrationId}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold clay-badge">
                              {currentTeam.track} ({trackMultiplier}x Multiplier)
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                              {currentTeam.leader?.college || "Aalim Muhammed Salegh College of Engineering"}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-slate-900 mt-2">
                            {currentTeam.teamName}
                          </h2>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={selectedTeamIndex === 0}
                            onClick={() => setSelectedTeamIndex((prev) => Math.max(0, prev - 1))}
                            className="clay-btn-secondary p-2.5 text-slate-600 disabled:opacity-40"
                            title="Previous Team"
                          >
                            <FiChevronLeft size={16} />
                          </button>
                          <span className="text-xs font-bold text-slate-500">
                            {selectedTeamIndex + 1} / {filteredTeams.length}
                          </span>
                          <button
                            type="button"
                            disabled={selectedTeamIndex >= filteredTeams.length - 1}
                            onClick={() => setSelectedTeamIndex((prev) => Math.min(filteredTeams.length - 1, prev + 1))}
                            className="clay-btn-secondary p-2.5 text-slate-600 disabled:opacity-40"
                            title="Next Team"
                          >
                            <FiChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Problem Statement Card / Collapsible */}
                      <div className="clay-card-subtle p-4 space-y-2 bg-slate-50/80">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FiFileText className="text-indigo-600" />
                            Problem Statement Title
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAbstractModal(!showAbstractModal)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                          >
                            {showAbstractModal ? "Hide Abstract" : "View Full Abstract"}
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {currentTeam.problemTitle || "AMS Hackathon Innovation Challenge"}
                        </h3>

                        {showAbstractModal && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-200"
                          >
                            {currentTeam.problemAbstract || "No problem abstract submitted."}
                          </motion.div>
                        )}
                      </div>

                      {/* Team Roster Badges */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Team Members Roster ({currentTeam.members?.length || currentTeam.teamSize || 4} Members)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-3 py-1 rounded-xl clay-card-subtle bg-white text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span>Leader: {currentTeam.leader?.name || "Team Leader"}</span>
                            <span className="text-[10px] text-slate-400">({currentTeam.leader?.department || "CSE"})</span>
                          </div>
                          {currentTeam.members?.slice(1).map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="px-3 py-1 rounded-xl clay-card-subtle bg-white text-xs font-medium text-slate-700 flex items-center gap-1.5"
                            >
                              <span>{m.name || `Member ${mIdx + 2}`}</span>
                              <span className="text-[10px] text-slate-400">({m.role || "Developer"})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Previous Round Action Items Card (If Round > 1) */}
                    {selectedRound > 1 && (
                      <div className="clay-card p-5 space-y-3 bg-amber-50/40 border border-amber-200/80">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <FiCornerDownRight className="text-amber-700" />
                            Round {selectedRound - 1} Assigned Action Items
                          </span>
                          <div className="flex items-center gap-1.5">
                            {["RESOLVED", "PARTIAL", "UNADDRESSED", "N/A"].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setPreviousActionItemsStatus(st)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                  previousActionItemsStatus === st
                                    ? st === "RESOLVED"
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : st === "PARTIAL"
                                      ? "bg-amber-600 text-white shadow-sm"
                                      : st === "UNADDRESSED"
                                      ? "bg-rose-600 text-white shadow-sm"
                                      : "bg-slate-700 text-white shadow-sm"
                                    : "bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-amber-200/60 italic">
                          {currentTeam.evaluationsByRound?.[selectedRound - 1]?.actionItemsForNextRound ||
                            "No specific action items recorded in previous round."}
                        </p>
                      </div>
                    )}

                    {/* Rubric Criteria Scoring Grid (5 Interactive Clay Cards) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <FiSliders className="text-indigo-600" />
                          Round {selectedRound} Rubric Criteria (0 to 10 Points Each)
                        </h3>
                        <span className="text-xs font-bold text-slate-500">
                          Subtotal: <strong className="text-indigo-700">{rawTotal}</strong> / 50
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {RUBRIC_CRITERIA.map((crit) => {
                          const val = Number(scores[crit.key]) || 0;

                          return (
                            <motion.div
                              key={crit.key}
                              whileHover={{ scale: 1.005 }}
                              className="clay-card p-5 space-y-3.5 transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider clay-badge">
                                      {crit.category}
                                    </span>
                                    <h4 className="font-bold text-slate-900 text-sm">{crit.label}</h4>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-1">{crit.desc}</p>
                                </div>

                                {/* Tactile Stepper Control */}
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleScoreChange(crit.key, -1)}
                                    disabled={val <= 0}
                                    className="clay-stepper w-9 h-9 flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
                                    title="Decrease score"
                                  >
                                    <FiMinus size={15} />
                                  </button>

                                  <div className="w-12 h-9 clay-input bg-white flex items-center justify-center font-extrabold font-['Space_Grotesk'] text-indigo-700 text-base">
                                    {val}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleScoreChange(crit.key, 1)}
                                    disabled={val >= crit.max}
                                    className="clay-stepper w-9 h-9 flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
                                    title="Increase score"
                                  >
                                    <FiPlus size={15} />
                                  </button>
                                </div>
                              </div>

                              {/* Interactive Slider & Quick Chips */}
                              <div className="space-y-2 pt-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={val}
                                  onChange={(e) => setScoreDirect(crit.key, e.target.value)}
                                  className="clay-slider"
                                />

                                {/* Quick Presets */}
                                <div className="flex items-center justify-between gap-1 text-[11px]">
                                  {[
                                    { num: 2, label: "2 (Basic)" },
                                    { num: 5, label: "5 (Fair)" },
                                    { num: 7, label: "7 (Good)" },
                                    { num: 9, label: "9 (Great)" },
                                    { num: 10, label: "10 (Exceptional)" },
                                  ].map((preset) => (
                                    <button
                                      key={preset.num}
                                      type="button"
                                      onClick={() => setScoreDirect(crit.key, preset.num)}
                                      className={`px-2.5 py-1 rounded-lg transition-all text-center cursor-pointer text-[10px] sm:text-[11px] font-bold ${
                                        val === preset.num
                                          ? "clay-btn-primary shadow-sm"
                                          : "clay-card-subtle bg-white text-slate-600 hover:bg-slate-100"
                                      }`}
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Final Score Calculation Card (Claymorphic) */}
                    <div className="clay-card-elevated p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-white via-indigo-50/30 to-white">
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="font-bold text-slate-800 text-sm">
                          Formula: Raw Subtotal ({rawTotal}/50) × Domain Weight ({trackMultiplier}x)
                        </div>
                        <div className="text-xs text-slate-500">
                          Fair domain difficulty multiplier applied for {currentTeam.track}.
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                          Final Round {selectedRound} Score
                        </span>
                        <span className="text-4xl font-extrabold font-['Space_Grotesk'] text-indigo-700">
                          {weightedTotal}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          / {(50 * trackMultiplier).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Remarks & Action Items Section */}
                    <div className="clay-card p-6 space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                          <FiMessageSquare className="text-indigo-600" size={15} />
                          Jury Feedback & Evaluation Remarks
                        </label>
                        <textarea
                          rows={3}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Detail the technical strengths, architectural choices, and jury advice..."
                          className="w-full clay-input p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {selectedRound < 4 && (
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
                            <FiCornerDownRight className="text-indigo-600" size={15} />
                            Action Items for Team to Implement by Round {selectedRound + 1}
                          </label>
                          <textarea
                            rows={2}
                            value={actionItemsForNextRound}
                            onChange={(e) => setActionItemsForNextRound(e.target.value)}
                            placeholder="e.g. 1) Optimize edge inference latency, 2) Complete clinician export flow, 3) Stress test concurrent users..."
                            className="w-full clay-input p-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed border-indigo-200"
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Controls Bar */}
                    <div className="clay-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-slate-500 font-medium text-center sm:text-left flex items-center gap-2">
                        <FiUserCheck className="text-emerald-600" size={16} />
                        <span>Signed by Jury: <strong className="text-slate-800">{activeEvaluator.name}</strong></span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleSave(false)}
                          disabled={saving}
                          className="flex-1 sm:flex-none clay-btn-secondary px-6 py-3.5 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <FiSave size={15} />
                          <span>{saving ? "Saving..." : "Save Score"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSave(true)}
                          disabled={saving}
                          className="flex-1 sm:flex-none clay-btn-primary px-7 py-3.5 text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
                        >
                          <span>Save & Next Team</span>
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default Evaluator;
