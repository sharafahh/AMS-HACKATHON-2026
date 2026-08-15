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
} from "react-icons/fi";
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

  // Data States
  const [teams, setTeams] = useState([]);
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

  // Fetch Teams
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await getEvaluatorTeamsAPI();
      if (res.success && Array.isArray(res.teams)) {
        setTeams(res.teams);
        if (res.trackWeightages) {
          setTrackWeightages(res.trackWeightages);
        }
      }
    } catch (err) {
      console.warn("Teams load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated]);

  // Fetch Leaderboard
  useEffect(() => {
    if (activeView === "leaderboard") {
      setLeaderboardLoading(true);
      getEvaluationLeaderboardAPI()
        .then((res) => {
          if (res.success && res.leaderboard) {
            setLeaderboard(res.leaderboard);
          }
        })
        .catch((e) => console.warn("Leaderboard error:", e))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeView, teams]);

  // Filtered Teams List
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      if (selectedTrackFilter !== "ALL" && team.track !== selectedTrackFilter) {
        return false;
      }
      const isEvaluated = Boolean(team.evaluationsByRound && team.evaluationsByRound[selectedRound]);
      if (statusFilter === "EVALUATED" && !isEvaluated) return false;
      if (statusFilter === "PENDING" && isEvaluated) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = (team.teamName || "").toLowerCase().includes(q);
        const mId = (team.registrationId || "").toLowerCase().includes(q);
        const mTrack = (team.track || "").toLowerCase().includes(q);
        const mLeader = (team.leader?.name || "").toLowerCase().includes(q);
        return mName || mId || mTrack || mLeader;
      }
      return true;
    });
  }, [teams, selectedTrackFilter, statusFilter, selectedRound, searchQuery]);

  // Current Active Team
  const currentTeam = filteredTeams[selectedTeamIndex] || filteredTeams[0] || null;

  // Sync Form State
  useEffect(() => {
    if (!currentTeam) return;

    const existingEval = currentTeam.evaluationsByRound?.[selectedRound];
    if (existingEval) {
      setScores({
        innovation: existingEval.scores?.innovation || 0,
        technical: existingEval.scores?.technical || 0,
        prototype: existingEval.scores?.prototype || 0,
        uiux: existingEval.scores?.uiux || 0,
        presentation: existingEval.scores?.presentation || 0,
      });
      setRemarks(existingEval.remarks || "");
      setActionItemsForNextRound(existingEval.actionItemsForNextRound || "");
      setPreviousActionItemsStatus(existingEval.previousActionItemsStatus || "N/A");
    } else {
      setScores({
        innovation: 0,
        technical: 0,
        prototype: 0,
        uiux: 0,
        presentation: 0,
      });
      setRemarks("");
      setActionItemsForNextRound("");
      setPreviousActionItemsStatus("N/A");
    }
    setSaveToast("");
  }, [currentTeam, selectedRound]);

  // Mathematical Calculations
  const rawTotal = useMemo(() => {
    return Object.values(scores).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }, [scores]);

  const trackMultiplier = useMemo(() => {
    if (!currentTeam) return 1.0;
    return trackWeightages[currentTeam.track] || currentTeam.trackMultiplier || 1.0;
  }, [currentTeam, trackWeightages]);

  const weightedTotal = useMemo(() => {
    return Number((rawTotal * trackMultiplier).toFixed(2));
  }, [rawTotal, trackMultiplier]);

  // Previous Rounds History
  const previousRoundsHistory = useMemo(() => {
    if (!currentTeam || !currentTeam.evaluationsByRound) return [];
    const history = [];
    for (let r = 1; r < selectedRound; r++) {
      const prev = currentTeam.evaluationsByRound[r];
      if (prev) {
        history.push({ round: r, data: prev });
      }
    }
    return history;
  }, [currentTeam, selectedRound]);

  // Score Step Modification
  const adjustScore = (key, delta) => {
    setScores((prev) => {
      const curr = Number(prev[key]) || 0;
      const updated = Math.min(10, Math.max(0, curr + delta));
      return { ...prev, [key]: updated };
    });
  };

  const setScoreDirect = (key, value) => {
    const num = Math.min(10, Math.max(0, Number(value) || 0));
    setScores((prev) => ({ ...prev, [key]: num }));
  };

  // Submit Evaluation
  const handleSave = async (advanceNext = false) => {
    if (!currentTeam) return;
    setSaving(true);
    setSaveToast("");

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

    try {
      const res = await submitEvaluationAPI(payload);
      if (res.success) {
        setSaveToast(`Score recorded for ${currentTeam.teamName} (Round ${selectedRound})`);

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
      alert(`Could not save evaluation: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Sign In Handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (loginPass.trim() === "judge2026" || loginPass.trim() === "evaluator" || loginPass.length >= 4) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ams_evaluator_auth", "true");
      sessionStorage.setItem("ams_evaluator_profile", JSON.stringify(activeEvaluator));
      setAuthError("");
    } else {
      setAuthError("Invalid access key. Use 'judge2026' or 'evaluator'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ams_evaluator_auth");
    sessionStorage.removeItem("ams_evaluator_profile");
  };

  // -------------------------------------------------------------
  // Render: Executive Login Screen (Warm Minimalist Luxury)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e1017] text-[#f4f2eb] flex items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
        {/* Subtle Warm Amber Glow */}
        <div className="absolute w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-md w-full bg-[#151822] border border-[#c5a059]/20 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 relative z-10">
          <div className="space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#e6ca85] mx-auto flex items-center justify-center shadow-inner">
              <FiShield size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#c5a059] font-medium block">
                Jury Evaluation Chamber
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-['Space_Grotesk']">
                AMS Hackathon 2026
              </h1>
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Official scoring portal with fair domain weightage and multi-round remark archiving.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                Jury Member Identity
              </label>
              <select
                value={activeEvaluator.id}
                onChange={(e) => {
                  const prof = EVALUATOR_PROFILES.find((p) => p.id === e.target.value);
                  if (prof) setActiveEvaluator(prof);
                }}
                className="w-full bg-[#0c0e14] border border-stone-700/60 rounded-xl px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-[#c5a059] transition-colors"
              >
                {EVALUATOR_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-stone-400 font-medium">
                Access Passkey
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter jury passkey (e.g. judge2026)"
                className="w-full bg-[#0c0e14] border border-stone-700/60 rounded-xl px-4 py-3 text-xs text-stone-200 focus:outline-none focus:border-[#c5a059] transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e2c974] to-[#c5a059] text-stone-950 font-bold text-xs uppercase tracking-widest transition-all hover:opacity-95 shadow-lg shadow-[#c5a059]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiUnlock size={14} /> Enter Evaluation Suite
            </button>
          </form>

          <div className="border-t border-stone-800/80 pt-4 text-center">
            <button
              onClick={() => {
                setLoginPass("judge2026");
                setIsAuthenticated(true);
                sessionStorage.setItem("ams_evaluator_auth", "true");
                sessionStorage.setItem("ams_evaluator_profile", JSON.stringify(activeEvaluator));
              }}
              className="text-xs text-stone-400 hover:text-[#e6ca85] transition-colors cursor-pointer"
            >
              Quick Test Access (judge2026) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Main Evaluator Interface (Executive Minimalist Luxury)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0e1017] text-[#f4f2eb] font-['Inter',sans-serif] flex flex-col selection:bg-[#c5a059]/30 selection:text-[#f4f2eb]">
      {/* 1. Executive Top Bar */}
      <header className="sticky top-0 z-40 bg-[#141722]/95 border-b border-stone-800/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left Branding & Mobile Drawer Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 transition-colors"
            title="Open Team Queue"
          >
            <FiMenu size={18} />
          </button>

          <Link
            to="/"
            className="hidden sm:inline-flex p-2 rounded-xl bg-stone-800/60 hover:bg-stone-700/60 text-stone-400 hover:text-stone-200 transition-colors"
            title="Return to Main Site"
          >
            <FiArrowLeft size={16} />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Space_Grotesk'] font-bold text-sm text-white tracking-wide">
                AMS HACKATHON 2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#e6ca85]">
                Jury Suite
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block font-light">
              Jury Member: <strong className="text-stone-200 font-medium">{activeEvaluator.name}</strong>
            </p>
          </div>
        </div>

        {/* Center: Round Selector Pills (Responsive horizontal scroll) */}
        <div className="flex items-center gap-1 bg-[#0a0c12] p-1 rounded-2xl border border-stone-800/80 overflow-x-auto max-w-full">
          {[
            { round: 1, label: "R1: Ideation" },
            { round: 2, label: "R2: Prototype" },
            { round: 3, label: "R3: Working MVP" },
            { round: 4, label: "R4: Grand Finals" },
          ].map((r) => (
            <button
              key={r.round}
              onClick={() => setSelectedRound(r.round)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                selectedRound === r.round
                  ? "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-stone-950 font-bold shadow-md shadow-[#c5a059]/20"
                  : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Right: Leaderboard Toggle & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView(activeView === "evaluate" ? "leaderboard" : "evaluate")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === "leaderboard"
                ? "bg-[#c5a059]/20 border-[#c5a059]/60 text-[#e6ca85]"
                : "bg-stone-800/60 hover:bg-stone-700/60 border-stone-700/60 text-stone-300"
            }`}
          >
            <FiBarChart2 size={13} />
            <span className="hidden sm:inline">
              {activeView === "leaderboard" ? "Back to Scoring" : "Leaderboard"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-stone-800/40 hover:bg-rose-500/20 hover:text-rose-300 border border-stone-700/40 text-stone-400 text-xs transition-colors cursor-pointer"
            title="Sign Out"
          >
            <span className="hidden sm:inline">Exit</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Views */}
      {activeView === "leaderboard" ? (
        /* ---------------- LUXURY LEADERBOARD VIEW ---------------- */
        <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-medium">
                Official Aggregated Standings
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk'] text-white flex items-center gap-2.5">
                <FiAward className="text-[#e6ca85]" /> Jury Evaluation Leaderboard
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 font-light">
                Normalized rankings reflecting domain difficulty weightage and multi-round cumulative scoring.
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#141722] border border-stone-800 text-xs text-stone-300">
              Teams Scored: <strong className="text-white font-semibold">{leaderboard.length}</strong>
            </div>
          </div>

          {leaderboardLoading ? (
            <div className="text-center py-24 text-xs text-stone-500 font-light animate-pulse">
              Computing weighted rankings...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-[#141722] border border-stone-800/80 rounded-3xl p-12 text-center space-y-3">
              <FiInfo className="mx-auto text-3xl text-stone-500" />
              <p className="text-base text-stone-200 font-medium font-['Space_Grotesk']">
                No Team Evaluations Recorded Yet
              </p>
              <p className="text-xs text-stone-400 max-w-md mx-auto font-light">
                Scores will automatically calculate and update live as you grade teams in the evaluation queue.
              </p>
            </div>
          ) : (
            <div className="bg-[#141722] border border-stone-800/80 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0d14] border-b border-stone-800/80 text-stone-400 uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="py-4 px-6">Rank</th>
                      <th className="py-4 px-6">Team Details</th>
                      <th className="py-4 px-6">Track Domain</th>
                      <th className="py-4 px-6 text-center">Credit Weight</th>
                      <th className="py-4 px-6 text-center">Rounds Completed</th>
                      <th className="py-4 px-6 text-right">Raw Total</th>
                      <th className="py-4 px-6 text-right text-[#e6ca85] font-semibold">Final Weighted Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60 text-stone-300">
                    {leaderboard.map((entry, idx) => (
                      <tr
                        key={entry.registrationId}
                        className={`hover:bg-stone-800/30 transition-colors ${
                          idx === 0 ? "bg-[#c5a059]/5 font-medium text-white" : ""
                        }`}
                      >
                        <td className="py-4 px-6">
                          <span
                            className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                              idx === 0
                                ? "bg-gradient-to-br from-[#e2c974] to-[#c5a059] text-stone-950 shadow-md shadow-[#c5a059]/30"
                                : idx === 1
                                ? "bg-stone-300 text-stone-950"
                                : idx === 2
                                ? "bg-[#a8793b] text-white"
                                : "bg-stone-800 text-stone-400"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sm text-white">{entry.teamName}</div>
                          <div className="text-[11px] text-stone-400">{entry.registrationId}</div>
                        </td>
                        <td className="py-4 px-6 text-stone-300">{entry.track}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-[#e6ca85] text-[11px] font-medium">
                            {entry.trackMultiplier}x
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-stone-400">
                          {entry.roundsCount} / 4
                        </td>
                        <td className="py-4 px-6 text-right text-stone-400">
                          {entry.rawCumulative}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-[#e6ca85] text-base font-['Space_Grotesk']">
                          {entry.weightedCumulative.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      ) : (

        /* ---------------- DUAL-PANE SCORING COCKPIT ---------------- */
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-full">
          {/* Mobile Quick Team Bar (< lg displays) */}
          <div className="lg:hidden bg-[#141722] border-b border-stone-800/80 p-3 flex items-center justify-between gap-2">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-[#0c0e16] border border-stone-700/60 text-xs text-left"
            >
              <div className="truncate">
                <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Active Team</span>
                <span className="font-semibold text-white truncate block">
                  {currentTeam ? currentTeam.teamName : "Select a team"}
                </span>
              </div>
              <span className="px-2 py-1 rounded-lg bg-[#c5a059]/20 text-[#e6ca85] text-[10px] font-bold">
                {selectedTeamIndex + 1}/{filteredTeams.length}
              </span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedTeamIndex((p) => Math.max(0, p - 1))}
                disabled={selectedTeamIndex === 0}
                className="p-2.5 rounded-xl bg-[#0c0e16] border border-stone-700/60 text-stone-300 disabled:opacity-30"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => setSelectedTeamIndex((p) => Math.min(filteredTeams.length - 1, p + 1))}
                disabled={selectedTeamIndex >= filteredTeams.length - 1}
                className="p-2.5 rounded-xl bg-[#0c0e16] border border-stone-700/60 text-stone-300 disabled:opacity-30"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Desktop Left Panel & Mobile Drawer Container */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-[#12151f] border-r border-stone-800/80 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 lg:h-[calc(100vh-65px)] lg:z-auto ${
              mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Drawer Header on Mobile */}
            <div className="p-4 border-b border-stone-800/80 flex items-center justify-between bg-[#0e111a]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-medium block">
                  Round {selectedRound} Queue
                </span>
                <h3 className="font-['Space_Grotesk'] font-semibold text-white text-sm">
                  Teams Registry ({filteredTeams.length})
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Search & Filter Inputs */}
            <div className="p-3.5 border-b border-stone-800/60 space-y-2 bg-[#0e111a]/70">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, code, track..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#080a10] border border-stone-800 focus:border-[#c5a059] text-xs text-stone-200 placeholder-stone-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={selectedTrackFilter}
                  onChange={(e) => setSelectedTrackFilter(e.target.value)}
                  className="flex-1 bg-[#080a10] border border-stone-800 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-300 focus:outline-none"
                >
                  <option value="ALL">All Innovation Tracks</option>
                  {Object.keys(trackWeightages).map((t) => (
                    <option key={t} value={t}>
                      {t} ({trackWeightages[t]}x)
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#080a10] border border-stone-800 rounded-xl px-2.5 py-1.5 text-[11px] text-stone-300 focus:outline-none"
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">⏳ Pending</option>
                  <option value="EVALUATED">✓ Scored</option>
                </select>
              </div>
            </div>

            {/* Team Scroll Cards */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
              {loading ? (
                <div className="text-center py-16 text-xs text-stone-500 font-light animate-pulse">
                  Loading evaluation queue...
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="text-center py-12 text-xs text-stone-500 font-light">
                  No teams match the filter criteria.
                </div>
              ) : (
                filteredTeams.map((team, idx) => {
                  const isSelected = currentTeam && currentTeam.registrationId === team.registrationId;
                  const roundEval = team.evaluationsByRound?.[selectedRound];
                  const isEvaluated = Boolean(roundEval);

                  return (
                    <button
                      key={team.registrationId}
                      onClick={() => {
                        setSelectedTeamIndex(idx);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-[#1d2232] border-[#c5a059]/80 shadow-md"
                          : "bg-[#141722]/60 hover:bg-[#191d2c]/80 border-stone-800/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-stone-400">
                          {team.registrationId}
                        </span>
                        {isEvaluated ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                            <FiCheck size={10} /> {roundEval.weightedTotal?.toFixed(2)} pts
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800/80 text-stone-400">
                            Unscored
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-xs sm:text-sm text-white font-['Space_Grotesk'] truncate">
                        {team.teamName}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span className="truncate max-w-[170px]">{team.track}</span>
                        <span className="text-[#e6ca85] font-medium">
                          {(trackWeightages[team.track] || team.trackMultiplier || 1.0)}x weight
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Backdrop for Mobile Drawer */}
          {mobileDrawerOpen && (
            <div
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
          )}

          {/* Right Panel: Scoring Cockpit */}
          <section className="flex-1 bg-[#0e1017] p-4 sm:p-8 overflow-y-auto lg:h-[calc(100vh-65px)] space-y-6">
            {!currentTeam ? (
              <div className="text-center py-24 text-stone-500 font-light">
                Select a team from the queue to start scoring.
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Save Feedback Toast */}
                {saveToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      <FiCheckCircle className="text-emerald-400" /> {saveToast}
                    </span>
                    <button onClick={() => setSaveToast("")} className="text-emerald-400 hover:text-white">
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Team Dossier Card (Minimalist Luxury) */}
                <div className="bg-[#141722] border border-stone-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-stone-800/90 text-stone-300 font-medium text-xs">
                          {currentTeam.registrationId}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-stone-800/60 text-stone-300 text-xs">
                          {currentTeam.track}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#e6ca85] font-semibold text-xs flex items-center gap-1.5">
                          <FiTrendingUp size={12} /> Credit Multiplier: {trackMultiplier}x
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">
                        {currentTeam.teamName}
                      </h2>
                    </div>

                    {/* Team Queue Navigation */}
                    <div className="flex items-center gap-2 text-xs self-end sm:self-center">
                      <button
                        onClick={() => setSelectedTeamIndex((prev) => Math.max(0, prev - 1))}
                        disabled={selectedTeamIndex === 0}
                        className="px-3 py-2 rounded-xl bg-stone-800/70 hover:bg-stone-700/70 disabled:opacity-30 text-stone-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <FiChevronLeft /> Prev Team
                      </button>
                      <span className="text-stone-500 px-1">
                        {selectedTeamIndex + 1} / {filteredTeams.length}
                      </span>
                      <button
                        onClick={() => setSelectedTeamIndex((prev) => Math.min(filteredTeams.length - 1, prev + 1))}
                        disabled={selectedTeamIndex >= filteredTeams.length - 1}
                        className="px-3 py-2 rounded-xl bg-stone-800/70 hover:bg-stone-700/70 disabled:opacity-30 text-stone-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        Next Team <FiChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Problem Statement Detail */}
                  <div className="bg-[#0b0e16] border border-stone-800/80 rounded-2xl p-5 space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#c5a059] flex items-center gap-1.5">
                      <FiFileText /> Problem Statement Target
                    </div>
                    <h4 className="text-sm font-medium text-white">
                      {currentTeam.problemTitle || "Project Challenge Statement"}
                    </h4>
                    {currentTeam.problemAbstract && (
                      <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed pt-1">
                        {currentTeam.problemAbstract}
                      </p>
                    )}
                  </div>

                  {/* Leader & Members Line */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-400 border-t border-stone-800/60 pt-4">
                    <span className="flex items-center gap-1.5 text-stone-300">
                      <FiUserCheck className="text-[#c5a059]" /> Team Leader:{" "}
                      <strong className="text-white font-medium">{currentTeam.leader?.name || "N/A"}</strong>
                    </span>
                    {currentTeam.leader?.college && (
                      <span>• {currentTeam.leader.college}</span>
                    )}
                    {currentTeam.leader?.department && (
                      <span>• {currentTeam.leader.department}</span>
                    )}
                  </div>
                </div>

                {/* Previous Rounds Remarks Context (Crucial for Rounds 2, 3, 4) */}
                {previousRoundsHistory.length > 0 && (
                  <div className="bg-[#141722] border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-stone-800/60 pb-3">
                      <h3 className="text-xs uppercase tracking-widest text-[#c5a059] font-semibold flex items-center gap-2">
                        <FiMessageSquare /> Previous Rounds Jury Remarks & Action Items
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        Historical Context
                      </span>
                    </div>

                    <div className="space-y-3">
                      {previousRoundsHistory.map((h) => (
                        <div
                          key={h.round}
                          className="bg-[#0b0e16] border border-stone-800/60 rounded-2xl p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-stone-200">
                              Round {h.round} Evaluation Summary:
                            </span>
                            <span className="text-emerald-400 font-medium">
                              Weighted Score: {h.data.weightedTotal} pts
                            </span>
                          </div>
                          {h.data.remarks && (
                            <p className="text-xs text-stone-300 font-light italic">
                              "{h.data.remarks}"
                            </p>
                          )}
                          {h.data.actionItemsForNextRound && (
                            <div className="text-xs bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-xl p-3 text-[#f4f2eb] space-y-1">
                              <strong className="text-[11px] text-[#e6ca85] uppercase tracking-wider block font-semibold">
                                📌 Action Items given to team in Round {h.round}:
                              </strong>
                              <p className="font-light">{h.data.actionItemsForNextRound}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Items Verification Selector */}
                    <div className="pt-3 border-t border-stone-800/60 space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-stone-300 font-medium flex items-center gap-1.5">
                        <FiCheckCircle className="text-emerald-400" />
                        Did the team implement previous round action items in Round {selectedRound}?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { id: "RESOLVED", label: "✓ Fully Implemented", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold" },
                          { id: "PARTIAL", label: "◐ Partially Addressed", color: "bg-[#c5a059]/20 border-[#c5a059]/50 text-[#e6ca85] font-semibold" },
                          { id: "UNADDRESSED", label: "✗ Unaddressed", color: "bg-rose-500/20 border-rose-500/50 text-rose-300 font-semibold" },
                          { id: "N/A", label: "— Not Applicable", color: "bg-stone-800 border-stone-700 text-stone-400" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPreviousActionItemsStatus(opt.id)}
                            className={`py-2.5 px-3 rounded-xl border transition-all text-center cursor-pointer ${
                              previousActionItemsStatus === opt.id
                                ? opt.color + " shadow-md"
                                : "bg-[#0b0e16] border-stone-800 text-stone-400 hover:text-stone-200"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5-Criteria Rubric Scoring Form (Tactile Luxury Steppers) */}
                <div className="bg-[#141722] border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800/60 pb-5">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white font-['Space_Grotesk'] flex items-center gap-2">
                        <FiSliders className="text-[#e6ca85]" />
                        Round {selectedRound} Rubric Evaluation (0 — 10 Pts)
                      </h3>
                      <p className="text-xs text-stone-400 font-light mt-0.5">
                        Touch +/- steppers, slider, or tap quick score presets.
                      </p>
                    </div>

                    {/* Live Score Counter Pill */}
                    <div className="bg-[#0b0e16] border border-stone-700/60 rounded-2xl px-5 py-2.5 flex items-center gap-4 shadow-inner">
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Raw Total</span>
                        <strong className="text-sm sm:text-base text-stone-200">{rawTotal} / 50</strong>
                      </div>
                      <div className="h-7 w-px bg-stone-800" />
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#c5a059] block font-semibold">Weighted Total</span>
                        <strong className="text-lg sm:text-xl text-[#e6ca85] font-bold font-['Space_Grotesk']">
                          {weightedTotal}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 5 Criteria Stepper Cards */}
                  <div className="space-y-5">
                    {RUBRIC_CRITERIA.map((crit, idx) => {
                      const val = scores[crit.key] || 0;
                      return (
                        <div
                          key={crit.key}
                          className="bg-[#0b0e16] border border-stone-800/70 rounded-2xl p-5 space-y-4 hover:border-stone-700 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-stone-800 text-[#e6ca85] inline-flex items-center justify-center text-[11px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="font-semibold text-sm text-white font-['Space_Grotesk']">
                                  {crit.label}
                                </span>
                                <span className="text-[10px] uppercase tracking-widest text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-full">
                                  {crit.category}
                                </span>
                              </div>
                              <p className="text-xs text-stone-400 font-light leading-relaxed pl-7">
                                {crit.desc}
                              </p>
                            </div>

                            {/* Large Tactile Stepper on Desktop/Mobile */}
                            <div className="flex items-center gap-2.5 self-end sm:self-center bg-[#141722] border border-stone-700/60 rounded-2xl p-1.5 shadow-inner">
                              <button
                                type="button"
                                onClick={() => adjustScore(crit.key, -1)}
                                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                                title="Decrease score"
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="w-9 text-center font-bold text-lg text-[#e6ca85] font-['Space_Grotesk']">
                                {val}
                              </span>
                              <button
                                type="button"
                                onClick={() => adjustScore(crit.key, 1)}
                                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                                title="Increase score"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Slider & Quick Presets */}
                          <div className="space-y-2.5 pt-1">
                            <input
                              type="range"
                              min="0"
                              max="10"
                              step="1"
                              value={val}
                              onChange={(e) => setScoreDirect(crit.key, e.target.value)}
                              className="w-full accent-[#d4af37] cursor-pointer bg-stone-800 h-2 rounded-lg"
                            />

                            {/* Quick Presets for Rapid Evaluation */}
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
                                  className={`px-2.5 py-1 rounded-lg transition-all text-center cursor-pointer ${
                                    val === preset.num
                                      ? "bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-stone-950 font-bold shadow-sm"
                                      : "bg-stone-800/40 hover:bg-stone-800 text-stone-400 hover:text-stone-200"
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

                  {/* Summary Normalization Math Card */}
                  <div className="p-5 rounded-2xl bg-[#0b0e16] border border-stone-800/80 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-stone-400 space-y-1 text-center sm:text-left">
                      <div className="font-medium text-stone-300">
                        Formula: Raw Subtotal ({rawTotal}/50) × Domain Weight ({trackMultiplier}x)
                      </div>
                      <div className="text-[11px] text-stone-500 font-light">
                        Domain difficulty adjustment applied for {currentTeam.track}.
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">
                        Final Round {selectedRound} Score
                      </span>
                      <span className="text-3xl font-extrabold text-[#e6ca85] font-['Space_Grotesk']">
                        {weightedTotal}
                      </span>
                      <span className="text-xs text-stone-500 ml-1">
                        / {(50 * trackMultiplier).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Remarks & Action Items */}
                  <div className="space-y-5 pt-2 border-t border-stone-800/60">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-stone-300 font-medium flex items-center gap-1.5">
                        <FiMessageSquare className="text-[#c5a059]" />
                        Jury Feedback & Detailed Evaluation Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Detail the technical strengths, architectural choices, and jury advice..."
                        className="w-full bg-[#0b0e16] border border-stone-800 rounded-2xl p-4 text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-[#c5a059] transition-colors leading-relaxed"
                      />
                    </div>

                    {/* Action Items for Upcoming Rounds */}
                    {selectedRound < 4 && (
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-[#e6ca85] font-semibold flex items-center gap-1.5">
                          <FiCornerDownRight className="text-[#e6ca85]" />
                          Action Items for Team to Implement by Round {selectedRound + 1}
                        </label>
                        <textarea
                          rows={2}
                          value={actionItemsForNextRound}
                          onChange={(e) => setActionItemsForNextRound(e.target.value)}
                          placeholder="e.g. 1) Implement sensor calibration, 2) Complete clinician export flow, 3) Test live inference latency..."
                          className="w-full bg-[#0b0e16] border border-[#c5a059]/30 rounded-2xl p-4 text-xs sm:text-sm text-[#f4f2eb] placeholder-stone-600 focus:outline-none focus:border-[#c5a059] transition-colors leading-relaxed"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-stone-400 font-light text-center sm:text-left">
                      Signed: <strong className="text-stone-200 font-medium">{activeEvaluator.name}</strong>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <FiSave size={14} />
                        {saving ? "Saving..." : "Save Score"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e2c974] to-[#c5a059] hover:opacity-95 text-stone-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c5a059]/20 disabled:opacity-50"
                      >
                        <span>Save & Next Team</span>
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default Evaluator;
