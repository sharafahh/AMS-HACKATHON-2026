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
  FiChevronDown,
  FiChevronUp,
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
    number: "01",
    label: "Innovation & Originality",
    category: "Concept & Vision",
    desc: "Uniqueness of solution, creative disruption, and novel problem-solving approach.",
    max: 10,
  },
  {
    key: "technical",
    number: "02",
    label: "Architecture & Complexity",
    category: "Engineering Depth",
    desc: "System design, algorithm choice, code structure, data pipeline, and scalability.",
    max: 10,
  },
  {
    key: "prototype",
    number: "03",
    label: "Working Prototype & Execution",
    category: "Implementation",
    desc: "Functional completeness, live working demo, edge case handling, and hardware/software stability.",
    max: 10,
  },
  {
    key: "uiux",
    number: "04",
    label: "Design Craft & Usability",
    category: "Experience",
    desc: "Aesthetic refinement, ergonomic flow, friction-free interaction, and visual polish.",
    max: 10,
  },
  {
    key: "presentation",
    number: "05",
    label: "Pitch & Defense",
    category: "Communication",
    desc: "Clarity of demonstration, depth of jury Q&A defense, and real-world viability articulation.",
    max: 10,
  },
];

const VALID_PASSCODES = ["AMS2026", "JURY2026", "EVAL2026", "DEMO2026", "ADMIN2026"];

function Evaluator() {
  // Single Unified Evaluator Authentication State (No individual names)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ams_evaluator_auth") === "true";
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

  // Unified Authentication Login (No individual name required)
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const clean = loginPass.trim().toUpperCase();
    if (VALID_PASSCODES.includes(clean)) {
      sessionStorage.setItem("ams_evaluator_auth", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Jury Passcode. Please contact the hackathon organizing committee.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ams_evaluator_auth");
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
        evaluatorId: "jury-panel",
        evaluatorName: "Jury Evaluator",
        scores,
        remarks,
        actionItemsForNextRound,
        previousActionItemsStatus,
      };

      const res = await submitEvaluationAPI(payload);

      if (res.success) {
        setSaveToast(`Score recorded for ${currentTeam.teamName} (Round ${selectedRound})`);
        setTimeout(() => setSaveToast(""), 3000);

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
          window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen clay-bg-executive text-slate-800 font-['Inter'] selection:bg-indigo-500 selection:text-white flex flex-col pt-6 sm:pt-8 pb-28 lg:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Top Floating Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 right-6 z-50 clay-box px-5 py-3.5 bg-white border-l-4 border-emerald-500 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xl"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <FiCheckCircle size={15} />
            </div>
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SINGLE UNIFIED EVALUATOR LOGIN GATE (NO NAMES) ─── */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full clay-box p-8 sm:p-10 space-y-7 shadow-xl bg-white"
          >
            {/* Brand Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <img src={collegeLogo} alt="College Logo" className="h-9 w-auto object-contain" />
                <div className="h-6 w-[1.5px] bg-slate-200" />
                <img src={amsHackathonLogo} alt="Hackathon Logo" className="h-9 w-auto object-contain" />
              </div>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider">
                  Official Jury Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-slate-900 mt-2">
                  AMS HACKATHON 2026
                </h1>
                <p className="text-slate-500 text-xs mt-1">
                  Evaluator Console & Multi-Round Scoring
                </p>
              </div>
            </div>

            {/* Single Unified Passcode Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Jury Access Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Enter Jury Passcode"
                    className="w-full clay-input-field px-4 py-3.5 text-sm font-semibold tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                  <FiShield className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                </div>
                {authError && (
                  <p className="text-rose-600 text-xs font-medium flex items-center gap-1.5 pt-1">
                    <FiAlertCircle size={14} /> {authError}
                  </p>
                )}
              </div>

              {/* Quick Preset Passcode Chips */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <span>Quick Fill:</span>
                {["AMS2026", "JURY2026"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLoginPass(code)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors text-[11px] cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full clay-btn-main py-3.5 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <FiUnlock size={15} />
                <span>Unlock Evaluator Console</span>
              </button>
            </form>

            <div className="pt-3 text-center border-t border-slate-100">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <FiArrowLeft size={14} /> Return to Hackathon Homepage
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ─── MAIN EVALUATION APP WORKSPACE ─── */
        <div className="max-w-7xl w-full mx-auto space-y-6">
          {/* Top Floating Sleek Navigation Bar (Not glued to the ceiling!) */}
          <header className="clay-box p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white shadow-sm">
            {/* Left Brand */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-3">
                <Link to="/" className="clay-btn-ghost p-2.5 text-slate-600 hover:text-indigo-600" title="Homepage">
                  <FiArrowLeft size={16} />
                </Link>
                <div className="flex items-center gap-2.5">
                  <img src={collegeLogo} alt="College" className="h-8 w-auto object-contain" />
                  <div className="h-5 w-[1px] bg-slate-200" />
                  <img src={amsHackathonLogo} alt="AMS" className="h-8 w-auto object-contain" />
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold font-['Space_Grotesk'] text-slate-900 leading-tight">
                      AMS HACKATHON 2026
                    </h2>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                      Jury Evaluation Console
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden clay-btn-ghost px-3 py-2 text-slate-700 flex items-center gap-2 text-xs font-bold"
              >
                <FiMenu size={15} />
                <span>Teams ({filteredTeams.length})</span>
              </button>
            </div>

            {/* Center: Round Selector Stepper */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 overflow-x-auto max-w-full">
              {[
                { r: 1, label: "Round 1", title: "Ideation & Design" },
                { r: 2, label: "Round 2", title: "System Architecture" },
                { r: 3, label: "Round 3", title: "Working Prototype" },
                { r: 4, label: "Round 4", title: "Grand Pitch & Defense" },
              ].map((roundItem) => (
                <button
                  key={roundItem.r}
                  type="button"
                  onClick={() => setSelectedRound(roundItem.r)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRound === roundItem.r
                      ? "bg-white text-indigo-700 shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{roundItem.label}</span>
                  <span className="hidden sm:inline text-[10px] text-slate-400 ml-1 font-normal">
                    ({roundItem.title})
                  </span>
                </button>
              ))}
            </div>

            {/* Right: View Switcher, Live DB Status, Lock */}
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView("evaluate")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeView === "evaluate" ? "bg-white text-indigo-700 shadow-sm font-bold" : "text-slate-600"
                  }`}
                >
                  <FiSliders size={13} />
                  <span>Evaluate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("leaderboard")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeView === "leaderboard" ? "bg-white text-indigo-700 shadow-sm font-bold" : "text-slate-600"
                  }`}
                >
                  <FiBarChart2 size={13} />
                  <span>Leaderboard</span>
                </button>
              </div>

              {/* Unified Status Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Jury Panel Active</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Lock Session"
                className="clay-btn-ghost p-2.5 text-slate-600 hover:text-rose-600 cursor-pointer"
              >
                <FiUnlock size={15} />
              </button>
            </div>
          </header>

          {/* ─── LEADERBOARD TAB (4 PODIUM PRIZES) ─── */}
          {activeView === "leaderboard" ? (
            <section className="space-y-6">
              {/* Leaderboard Header Card */}
              <div className="clay-box p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-slate-900 flex items-center gap-2.5">
                    <FiAward className="text-amber-500" size={24} />
                    Live Hackathon Jury Leaderboard
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Normalized score rankings across all 4 rounds adjusted by track domain complexity multipliers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={fetchLeaderboard}
                    disabled={leaderboardLoading}
                    className="clay-btn-ghost px-4 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <FiRefreshCw className={leaderboardLoading ? "animate-spin text-indigo-600" : ""} size={14} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportLeaderboardCSV}
                    className="clay-btn-main px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <FiDownload size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* 4-PLACE PODIUM OF PRIZES */}
              {leaderboard.length >= 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1st Place (Grand Champion) */}
                  <div className="clay-box p-5 bg-gradient-to-b from-amber-50/70 via-white to-white border-t-4 border-amber-500 space-y-3 shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold flex items-center gap-1.5">
                        🏆 1st Champion
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-700">{leaderboard[0].registrationId}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base truncate">{leaderboard[0].teamName}</h4>
                      <p className="text-xs text-indigo-600 font-medium truncate">{leaderboard[0].track}</p>
                    </div>
                    <div className="pt-3 border-t border-amber-100 flex items-baseline justify-between">
                      <span className="text-[11px] text-amber-900 font-semibold">Total Score</span>
                      <span className="text-2xl font-extrabold font-['Space_Grotesk'] text-amber-600">
                        {leaderboard[0].weightedCumulative}
                      </span>
                    </div>
                  </div>

                  {/* 2nd Place (1st Runner Up) */}
                  <div className="clay-box p-5 bg-white border-t-4 border-slate-400 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold flex items-center gap-1.5">
                        🥈 2nd Place
                      </span>
                      <span className="text-xs font-mono text-slate-500">{leaderboard[1].registrationId}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base truncate">{leaderboard[1].teamName}</h4>
                      <p className="text-xs text-indigo-600 font-medium truncate">{leaderboard[1].track}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Total Score</span>
                      <span className="text-2xl font-bold font-['Space_Grotesk'] text-slate-800">
                        {leaderboard[1].weightedCumulative}
                      </span>
                    </div>
                  </div>

                  {/* 3rd Place (2nd Runner Up) */}
                  <div className="clay-box p-5 bg-white border-t-4 border-amber-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-amber-900 text-[11px] font-extrabold flex items-center gap-1.5">
                        🥉 3rd Place
                      </span>
                      <span className="text-xs font-mono text-slate-500">{leaderboard[2].registrationId}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base truncate">{leaderboard[2].teamName}</h4>
                      <p className="text-xs text-indigo-600 font-medium truncate">{leaderboard[2].track}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Total Score</span>
                      <span className="text-2xl font-bold font-['Space_Grotesk'] text-slate-800">
                        {leaderboard[2].weightedCumulative}
                      </span>
                    </div>
                  </div>

                  {/* 4th Place (Podium Finalist) */}
                  <div className="clay-box p-5 bg-white border-t-4 border-indigo-500 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-extrabold flex items-center gap-1.5">
                        🎖️ 4th Place
                      </span>
                      <span className="text-xs font-mono text-indigo-600">{leaderboard[3].registrationId}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base truncate">{leaderboard[3].teamName}</h4>
                      <p className="text-xs text-indigo-600 font-medium truncate">{leaderboard[3].track}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Total Score</span>
                      <span className="text-2xl font-bold font-['Space_Grotesk'] text-slate-800">
                        {leaderboard[3].weightedCumulative}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Standings Table */}
              <div className="clay-box overflow-hidden bg-white">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Full Team Standings</h3>
                  <span className="text-xs text-slate-500">{leaderboard.length} Teams Ranked</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] sm:text-xs border-b border-slate-100">
                      <tr>
                        <th className="py-3.5 px-4 text-center w-12">Rank</th>
                        <th className="py-3.5 px-4">Registration ID</th>
                        <th className="py-3.5 px-4">Team Name</th>
                        <th className="py-3.5 px-4">Track</th>
                        <th className="py-3.5 px-4 text-center">Multiplier</th>
                        <th className="py-3.5 px-4 text-center">Rounds</th>
                        <th className="py-3.5 px-4 text-right">Weighted Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard.map((item, idx) => (
                        <tr key={item.registrationId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 text-center font-extrabold text-slate-700">
                            {idx === 0 ? "🥇 1" : idx === 1 ? "🥈 2" : idx === 2 ? "🥉 3" : idx === 3 ? "🎖️ 4" : `#${idx + 1}`}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{item.registrationId}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{item.teamName}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.track}</td>
                          <td className="py-3.5 px-4 text-center font-semibold text-indigo-600">
                            {item.trackMultiplier}x
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-600">
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
            /* ─── MAIN EVALUATOR WORKSPACE (SLEEK & ORGANISED) ─── */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Sidebar: Team Queue (4 Cols on Desktop) */}
              <aside className="hidden lg:flex lg:col-span-4 flex-col clay-box p-4 space-y-4 sticky top-6 max-h-[calc(100vh-140px)] overflow-hidden bg-white">
                {/* Search & Filters */}
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
                      className="w-full clay-input-field pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
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
                      className="clay-input-field px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white"
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
                      className="clay-input-field px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white"
                    >
                      <option value="ALL">All Status</option>
                      <option value="EVALUATED">Evaluated</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Team List Items */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {loading ? (
                    <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
                      <FiRefreshCw className="animate-spin text-indigo-600" size={20} />
                      <span>Loading teams...</span>
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs clay-well p-4">
                      No matching teams.
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
                          className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer border ${
                            isSelected
                              ? "clay-box-selected bg-indigo-50/40"
                              : "bg-white border-slate-200/80 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-xs text-indigo-600">
                              {team.registrationId}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isEvaluated
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {isEvaluated ? `R${selectedRound}: ${evalForRound.weightedTotal}` : "Pending"}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate">
                            {team.teamName}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                            <span className="truncate max-w-[160px]">{team.track}</span>
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

              {/* Mobile Sliding Drawer */}
              <AnimatePresence>
                {mobileDrawerOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden flex justify-end"
                  >
                    <motion.div
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      className="w-full max-w-xs bg-white h-full p-5 space-y-4 overflow-y-auto flex flex-col shadow-2xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm">Select Team ({filteredTeams.length})</h3>
                        <button
                          type="button"
                          onClick={() => setMobileDrawerOpen(false)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
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
                          className="w-full clay-input-field px-3.5 py-2 text-xs"
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
                            className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50"
                          >
                            <div className="font-mono text-xs text-indigo-600 font-bold">{team.registrationId}</div>
                            <div className="font-bold text-slate-900 text-xs truncate">{team.teamName}</div>
                            <div className="text-[11px] text-slate-500 truncate">{team.track}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Right: Main Team Evaluation Workspace (8 Cols on Desktop) */}
              <section className="lg:col-span-8 space-y-5">
                {!currentTeam ? (
                  <div className="clay-box p-12 text-center text-slate-500 space-y-3 bg-white">
                    <FiUsers className="mx-auto text-slate-400" size={36} />
                    <h3 className="text-lg font-bold text-slate-800">No Team Selected</h3>
                    <p className="text-xs text-slate-500">
                      Choose a team from the queue to start scoring for Round {selectedRound}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* 1. Team Dossier Card */}
                    <div className="clay-box p-5 sm:p-6 space-y-4 bg-white">
                      {/* Top Bar: Reg ID, Track Pill, Nav arrows */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {currentTeam.registrationId}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
                              {currentTeam.track} • {trackMultiplier}x Multiplier
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {currentTeam.leader?.college || "Aalim Muhammed Salegh College of Engineering"}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-slate-900">
                            {currentTeam.teamName}
                          </h2>
                        </div>

                        {/* Navigation Step Arrows */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            disabled={selectedTeamIndex === 0}
                            onClick={() => setSelectedTeamIndex((prev) => Math.max(0, prev - 1))}
                            className="clay-btn-ghost p-2.5 text-slate-600 disabled:opacity-40 cursor-pointer"
                            title="Previous Team"
                          >
                            <FiChevronLeft size={16} />
                          </button>
                          <span className="text-xs font-semibold text-slate-500 px-1">
                            {selectedTeamIndex + 1} of {filteredTeams.length}
                          </span>
                          <button
                            type="button"
                            disabled={selectedTeamIndex >= filteredTeams.length - 1}
                            onClick={() => setSelectedTeamIndex((prev) => Math.min(filteredTeams.length - 1, prev + 1))}
                            className="clay-btn-ghost p-2.5 text-slate-600 disabled:opacity-40 cursor-pointer"
                            title="Next Team"
                          >
                            <FiChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Problem Statement Snippet / Collapsible */}
                      <div className="clay-well p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <FiFileText className="text-indigo-600" />
                            Problem Statement
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowAbstractModal(!showAbstractModal)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <span>{showAbstractModal ? "Hide Abstract" : "View Full Abstract"}</span>
                            {showAbstractModal ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </button>
                        </div>
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {currentTeam.problemTitle || "AMS Hackathon Challenge"}
                        </p>
                        {showAbstractModal && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-slate-600 pt-2 leading-relaxed border-t border-slate-200 mt-2"
                          >
                            {currentTeam.problemAbstract || "No problem abstract submitted."}
                          </motion.p>
                        )}
                      </div>

                      {/* Team Roster */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Roster:</span>
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-semibold text-xs">
                          ⭐ {currentTeam.leader?.name || "Leader"} ({currentTeam.leader?.department || "CSE"})
                        </span>
                        {currentTeam.members?.slice(1).map((m, mIdx) => (
                          <span key={mIdx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
                            {m.name || `Member ${mIdx + 2}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 2. Previous Round Feedback & Status (If Round > 1) */}
                    {selectedRound > 1 && (
                      <div className="clay-box p-4 sm:p-5 space-y-3 bg-amber-50/50 border border-amber-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  previousActionItemsStatus === st
                                    ? st === "RESOLVED"
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : st === "PARTIAL"
                                      ? "bg-amber-600 text-white shadow-sm"
                                      : st === "UNADDRESSED"
                                      ? "bg-rose-600 text-white shadow-sm"
                                      : "bg-slate-700 text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-200/70 italic leading-relaxed">
                          {currentTeam.evaluationsByRound?.[selectedRound - 1]?.actionItemsForNextRound ||
                            "No specific action items recorded in previous round."}
                        </p>
                      </div>
                    )}

                    {/* 3. Rubric Scoring Cards (5 Criteria) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <FiSliders className="text-indigo-600" />
                          Round {selectedRound} Rubric Criteria (0 to 10 Points Each)
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          Subtotal: <strong className="text-indigo-700 font-bold">{rawTotal}</strong> / 50
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {RUBRIC_CRITERIA.map((crit) => {
                          const val = Number(scores[crit.key]) || 0;

                          return (
                            <div
                              key={crit.key}
                              className="clay-box p-4 sm:p-5 space-y-3 bg-white transition-all hover:border-indigo-200"
                            >
                              {/* Top Row: Category + Title + Subtitle */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                                      {crit.category}
                                    </span>
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                      {crit.number}. {crit.label}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{crit.desc}</p>
                                </div>

                                {/* Tactile Stepper Control (Ergonomic 42px touch buttons) */}
                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleScoreChange(crit.key, -1)}
                                    disabled={val <= 0}
                                    className="clay-step-btn cursor-pointer"
                                    title="Decrease"
                                  >
                                    <FiMinus size={16} />
                                  </button>

                                  <div className="w-14 h-[42px] clay-well bg-white flex items-center justify-center font-bold font-['Space_Grotesk'] text-indigo-700 text-lg">
                                    {val}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleScoreChange(crit.key, 1)}
                                    disabled={val >= crit.max}
                                    className="clay-step-btn cursor-pointer"
                                    title="Increase"
                                  >
                                    <FiPlus size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Slider & Quick Presets */}
                              <div className="space-y-2 pt-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={val}
                                  onChange={(e) => setScoreDirect(crit.key, e.target.value)}
                                  className="clay-range cursor-pointer"
                                />

                                <div className="flex items-center justify-between gap-1.5 text-[11px]">
                                  {[
                                    { num: 2, label: "2 (Basic)" },
                                    { num: 4, label: "4 (Fair)" },
                                    { num: 6, label: "6 (Good)" },
                                    { num: 8, label: "8 (Great)" },
                                    { num: 10, label: "10 (Elite)" },
                                  ].map((preset) => (
                                    <button
                                      key={preset.num}
                                      type="button"
                                      onClick={() => setScoreDirect(crit.key, preset.num)}
                                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-semibold text-xs ${
                                        val === preset.num
                                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                      }`}
                                    >
                                      {preset.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Score Calculation Summary Banner */}
                    <div className="clay-box p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-white via-indigo-50/40 to-white border-l-4 border-indigo-600">
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="font-bold text-slate-800 text-sm sm:text-base">
                          Formula: Raw Subtotal ({rawTotal}/50) × Domain Weight ({trackMultiplier}x)
                        </div>
                        <div className="text-xs text-slate-500">
                          Fair domain complexity multiplier for {currentTeam.track}.
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                          Round {selectedRound} Score
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-indigo-700">
                          {weightedTotal}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          / {(50 * trackMultiplier).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* 5. Remarks & Future Action Items */}
                    <div className="clay-box p-5 sm:p-6 space-y-4 bg-white">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <FiMessageSquare className="text-indigo-600" />
                          Jury Evaluation Feedback & Advice
                        </label>
                        <textarea
                          rows={3}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Detail technical strengths, code architecture, and recommendations..."
                          className="w-full clay-input-field p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed"
                        />
                      </div>

                      {selectedRound < 4 && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                            <FiCornerDownRight className="text-indigo-600" />
                            Action Items to Implement for Round {selectedRound + 1}
                          </label>
                          <textarea
                            rows={2}
                            value={actionItemsForNextRound}
                            onChange={(e) => setActionItemsForNextRound(e.target.value)}
                            placeholder="e.g. 1) Optimize latency, 2) Test live sensor calibration, 3) Add export flow..."
                            className="w-full clay-input-field p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed border-indigo-200"
                          />
                        </div>
                      )}
                    </div>

                    {/* 6. Desktop Action Control Bar */}
                    <div className="hidden sm:flex clay-box p-4 sm:p-5 items-center justify-between gap-4 bg-white">
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <FiUserCheck className="text-emerald-600" size={16} />
                        <span>Official Jury Evaluation Record</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSave(false)}
                          disabled={saving}
                          className="clay-btn-ghost px-5 py-3 text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <FiSave size={15} />
                          <span>{saving ? "Saving..." : "Save Score"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSave(true)}
                          disabled={saving}
                          className="clay-btn-main px-6 py-3 text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
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

          {/* ─── STICKY MOBILE BOTTOM ACTION BAR ─── */}
          {activeView === "evaluate" && currentTeam && (
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 shadow-lg flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Round {selectedRound} Total</div>
                <div className="text-xl font-extrabold font-['Space_Grotesk'] text-indigo-700 leading-tight">
                  {weightedTotal} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="clay-btn-ghost p-3 text-slate-700 text-xs font-bold"
                  title="Save Current"
                >
                  <FiSave size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="clay-btn-main px-4 py-3 text-xs flex items-center gap-1 font-bold"
                >
                  <span>Save & Next</span>
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Evaluator;
