import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiChevronRight,
  FiChevronLeft,
  FiLock,
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
    desc: "Novelty of approach, uniqueness of solution, and problem disruption degree.",
    max: 10,
  },
  {
    key: "technical",
    label: "Technical Architecture & Complexity",
    desc: "System design, algorithm choice, data structures, security, and scalability.",
    max: 10,
  },
  {
    key: "prototype",
    label: "Working Prototype & Implementation",
    desc: "Completeness of running software/hardware, real-time fidelity, and error resilience.",
    max: 10,
  },
  {
    key: "uiux",
    label: "UI/UX & Product Polish",
    desc: "Interface ergonomics, typography, user friction, responsiveness, and aesthetic craft.",
    max: 10,
  },
  {
    key: "presentation",
    label: "Presentation & Technical Defense",
    desc: "Clarity of demonstration, depth of Q&A answers, and jury pitch effectiveness.",
    max: 10,
  },
];

const EVALUATOR_PROFILES = [
  { id: "eval-1", name: "Dr. S. K. Ramanathan", role: "Chief Technical Jury (AI & Systems)" },
  { id: "eval-2", name: "Prof. M. Anitha", role: "Lead Systems Architect & Security" },
  { id: "eval-3", name: "Er. Vikramaditya", role: "Industry Embedded & IoT Specialist" },
];

function Evaluator() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ams_evaluator_auth") === "true";
  });
  const [activeEvaluator, setActiveEvaluator] = useState(() => {
    const saved = sessionStorage.getItem("ams_evaluator_profile");
    return saved ? JSON.parse(saved) : EVALUATOR_PROFILES[0];
  });
  const [loginPass, setLoginPass] = useState("");
  const [authError, setAuthError] = useState("");

  // Main UI States
  const [activeView, setActiveView] = useState("evaluate"); // 'evaluate' | 'leaderboard'
  const [selectedRound, setSelectedRound] = useState(1); // 1, 2, 3, 4
  const [teams, setTeams] = useState([]);
  const [trackWeightages, setTrackWeightages] = useState({});
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'EVALUATED' | 'PENDING'

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // Current Team Evaluation Form State
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

  // Fetch Teams and Evaluations on Load
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
      console.warn("Using local teams state fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeams();
    }
  }, [isAuthenticated]);

  // Fetch Leaderboard when tab active
  useEffect(() => {
    if (activeView === "leaderboard") {
      setLeaderboardLoading(true);
      getEvaluationLeaderboardAPI()
        .then((res) => {
          if (res.success && res.leaderboard) {
            setLeaderboard(res.leaderboard);
          }
        })
        .catch((e) => console.warn("Leaderboard fetch error:", e))
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeView, teams]);

  // Filtered Teams List
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      // Track Filter
      if (selectedTrackFilter !== "ALL" && team.track !== selectedTrackFilter) {
        return false;
      }
      // Status Filter for Selected Round
      const isEvaluated = Boolean(team.evaluationsByRound && team.evaluationsByRound[selectedRound]);
      if (statusFilter === "EVALUATED" && !isEvaluated) return false;
      if (statusFilter === "PENDING" && isEvaluated) return false;

      // Text Query
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

  // Sync Form whenever Current Team or Round changes
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
      // Fresh evaluation form for this round
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
    setSaveSuccessMsg("");
  }, [currentTeam, selectedRound]);

  // Calculations
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

  // Previous Rounds Remarks for Context
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

  // Handle Score Input
  const handleScoreChange = (key, value) => {
    const num = Math.min(10, Math.max(0, Number(value) || 0));
    setScores((prev) => ({ ...prev, [key]: num }));
  };

  // Submit Evaluation
  const handleSaveEvaluation = async (autoAdvance = false) => {
    if (!currentTeam) return;
    setSaving(true);
    setSaveSuccessMsg("");

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
        setSaveSuccessMsg(`✓ Saved score for ${currentTeam.teamName} (Round ${selectedRound})!`);

        // Update local state directly so UI responds instantly
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

        if (autoAdvance) {
          if (selectedTeamIndex < filteredTeams.length - 1) {
            setSelectedTeamIndex((prev) => prev + 1);
          }
        }
      }
    } catch (err) {
      alert(`Error saving evaluation: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Authentication Login
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (loginPass.trim() === "judge2026" || loginPass.trim() === "amshackathon2026" || loginPass.trim().toLowerCase() === "evaluator" || loginPass.length >= 4) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ams_evaluator_auth", "true");
      sessionStorage.setItem("ams_evaluator_profile", JSON.stringify(activeEvaluator));
      setAuthError("");
    } else {
      setAuthError("Invalid credentials. Try 'judge2026' or 'evaluator'.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ams_evaluator_auth");
    sessionStorage.removeItem("ams_evaluator_profile");
  };

  // -------------------------------------------------------------
  // Render: Login Screen for Evaluator
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0d121f] border border-slate-800/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center font-mono">
              <FiShield size={22} />
            </div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">
              AMS Hackathon 2026
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Official Jury & Evaluator Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Select Evaluator Identity
              </label>
              <select
                value={activeEvaluator.id}
                onChange={(e) => {
                  const prof = EVALUATOR_PROFILES.find((p) => p.id === e.target.value);
                  if (prof) setActiveEvaluator(prof);
                }}
                className="w-full bg-[#080b14] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {EVALUATOR_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Evaluator Passkey
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter passkey (e.g. judge2026)"
                className="w-full bg-[#080b14] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-rose-400 font-mono mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <FiUnlock size={14} /> Enter Judging Console
            </button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 text-center">
            <button
              onClick={() => {
                setLoginPass("judge2026");
                setIsAuthenticated(true);
                sessionStorage.setItem("ams_evaluator_auth", "true");
                sessionStorage.setItem("ams_evaluator_profile", JSON.stringify(activeEvaluator));
              }}
              className="text-[11px] text-slate-400 hover:text-amber-400 font-mono underline transition-colors cursor-pointer"
            >
              Quick Test Sign-In (judge2026)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Main Evaluator Interface
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-200 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Sleek Top Console Bar */}
      <header className="sticky top-0 z-30 bg-[#0c101c]/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
            title="Return to Main Site"
          >
            <FiArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-100 tracking-tight">
                AMS HACKATHON 2026
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                Jury Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Evaluator: <strong className="text-slate-300">{activeEvaluator.name}</strong> • {activeEvaluator.role}
            </p>
          </div>
        </div>

        {/* Center: Round Selector Pills */}
        <div className="flex items-center gap-1 bg-[#06080e] p-1 rounded-xl border border-slate-800">
          {[
            { round: 1, label: "R1: Ideation" },
            { round: 2, label: "R2: Prototype" },
            { round: 3, label: "R3: Working MVP" },
            { round: 4, label: "R4: Grand Finals" },
          ].map((r) => (
            <button
              key={r.round}
              onClick={() => setSelectedRound(r.round)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedRound === r.round
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Right: View switcher & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView(activeView === "evaluate" ? "leaderboard" : "evaluate")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === "leaderboard"
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-slate-800/60 hover:bg-slate-700/60 border-slate-700/60 text-slate-300"
            }`}
          >
            <FiBarChart2 size={13} />
            {activeView === "leaderboard" ? "Back to Evaluation Queue" : "View Live Leaderboard"}
          </button>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/40 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700/40 text-slate-400 text-xs font-mono transition-colors cursor-pointer"
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* 2. Main Content Body */}
      {activeView === "leaderboard" ? (
        /* ---------------- LEADERBOARD VIEW ---------------- */
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <FiAward className="text-amber-400" /> Hackathon Jury Evaluation Leaderboard
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Real-time scores normalized with fair track weightage multipliers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                Total Teams Evaluated: <strong className="text-white">{leaderboard.length}</strong>
              </span>
            </div>
          </div>

          {leaderboardLoading ? (
            <div className="text-center py-20 font-mono text-xs text-slate-500 animate-pulse">
              Computing weighted rankings...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-[#0b0f1b] border border-slate-800 rounded-xl p-12 text-center font-mono space-y-3">
              <FiInfo className="mx-auto text-3xl text-slate-600" />
              <p className="text-sm text-slate-300 font-semibold">No Evaluations Recorded Yet</p>
              <p className="text-xs text-slate-500">
                Scores will automatically populate here as you evaluate teams in the queue.
              </p>
            </div>
          ) : (
            <div className="bg-[#0b0f1b] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#060810] border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Rank</th>
                      <th className="py-3.5 px-4">Registration ID</th>
                      <th className="py-3.5 px-4">Team Name</th>
                      <th className="py-3.5 px-4">Track Domain</th>
                      <th className="py-3.5 px-4 text-center">Track Weight</th>
                      <th className="py-3.5 px-4 text-center">Rounds Scored</th>
                      <th className="py-3.5 px-4 text-right">Raw Total</th>
                      <th className="py-3.5 px-4 text-right text-amber-300 font-bold">Weighted Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leaderboard.map((entry, idx) => (
                      <tr
                        key={entry.registrationId}
                        className={`hover:bg-slate-800/30 transition-colors ${
                          idx === 0 ? "bg-amber-500/5 font-semibold text-white" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-[11px] ${
                              idx === 0
                                ? "bg-amber-500 text-slate-950"
                                : idx === 1
                                ? "bg-slate-300 text-slate-950"
                                : idx === 2
                                ? "bg-amber-700 text-white"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{entry.registrationId}</td>
                        <td className="py-3 px-4 font-semibold text-white">{entry.teamName}</td>
                        <td className="py-3 px-4 text-slate-400">{entry.track}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px]">
                            {entry.trackMultiplier}x
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-400">
                          {entry.roundsCount} / 4
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {entry.rawCumulative}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-amber-400 text-sm">
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

        /* ---------------- DUAL-PANE EVALUATION COCKPIT ---------------- */
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-full">
          {/* Left Panel: Team Queue Rail */}
          <aside className="w-full lg:w-80 xl:w-96 bg-[#090d18] border-r border-slate-800/80 flex flex-col h-auto lg:h-[calc(100vh-61px)] overflow-hidden">
            {/* Search & Filters Header */}
            <div className="p-3.5 border-b border-slate-800/80 space-y-2.5 bg-[#0a0f1c]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, ID, leader..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050810] border border-slate-800 focus:border-amber-500 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={selectedTrackFilter}
                  onChange={(e) => setSelectedTrackFilter(e.target.value)}
                  className="flex-1 bg-[#050810] border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Tracks</option>
                  {Object.keys(trackWeightages).map((t) => (
                    <option key={t} value={t}>
                      {t} ({trackWeightages[t]}x)
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#050810] border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">⏳ Pending</option>
                  <option value="EVALUATED">✓ Evaluated</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1 pt-1">
                <span>
                  Teams: <strong className="text-slate-300">{filteredTeams.length}</strong>
                </span>
                <span>Round {selectedRound}</span>
              </div>
            </div>

            {/* Team Cards Scroll List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
              {loading ? (
                <div className="text-center py-12 font-mono text-xs text-slate-500 animate-pulse">
                  Loading teams queue...
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="text-center py-10 font-mono text-xs text-slate-500">
                  No matching teams found.
                </div>
              ) : (
                filteredTeams.map((team, idx) => {
                  const isSelected = currentTeam && currentTeam.registrationId === team.registrationId;
                  const roundEval = team.evaluationsByRound?.[selectedRound];
                  const isEvaluated = Boolean(roundEval);

                  return (
                    <button
                      key={team.registrationId}
                      onClick={() => setSelectedTeamIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all border font-mono cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? "bg-slate-800/90 border-amber-500/80 shadow-md"
                          : "bg-[#0c101c]/40 hover:bg-slate-800/40 border-transparent hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-cyan-400">
                          {team.registrationId}
                        </span>
                        {isEvaluated ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                            <FiCheck size={10} /> {roundEval.weightedTotal?.toFixed(2)} pts
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-xs text-white truncate">
                        {team.teamName}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[170px]">{team.track}</span>
                        <span className="text-amber-400 font-bold">
                          {(trackWeightages[team.track] || team.trackMultiplier || 1.0)}x
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Panel: Evaluation Scoring Workspace */}
          <section className="flex-1 bg-[#070a12] p-4 sm:p-6 overflow-y-auto h-auto lg:h-[calc(100vh-61px)] space-y-6">
            {!currentTeam ? (
              <div className="text-center py-20 font-mono text-slate-500">
                Select a team from the queue to start evaluation.
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Save Success Banner */}
                {saveSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between"
                  >
                    <span>{saveSuccessMsg}</span>
                    <button
                      onClick={() => setSaveSuccessMsg("")}
                      className="text-emerald-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {/* Team Dossier Header */}
                <div className="bg-[#0c111e] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                          {currentTeam.registrationId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs">
                          {currentTeam.track}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
                          <FiTrendingUp size={12} /> Track Credit Weight: {trackMultiplier}x
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {currentTeam.teamName}
                      </h2>
                    </div>

                    {/* Navigation Buttons between Teams */}
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <button
                        onClick={() => setSelectedTeamIndex((prev) => Math.max(0, prev - 1))}
                        disabled={selectedTeamIndex === 0}
                        className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <FiChevronLeft /> Prev
                      </button>
                      <span className="px-2 text-slate-500">
                        {selectedTeamIndex + 1} / {filteredTeams.length}
                      </span>
                      <button
                        onClick={() => setSelectedTeamIndex((prev) => Math.min(filteredTeams.length - 1, prev + 1))}
                        disabled={selectedTeamIndex >= filteredTeams.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 disabled:opacity-30 text-slate-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        Next <FiChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Problem & Abstract */}
                  <div className="bg-[#070a14] border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <FiFileText className="text-amber-400" />
                      Problem Statement:
                      <span className="text-white font-sans font-semibold">
                        {currentTeam.problemTitle || "Project Problem Statement"}
                      </span>
                    </div>
                    {currentTeam.problemAbstract && (
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {currentTeam.problemAbstract}
                      </p>
                    )}
                  </div>

                  {/* Members & Leader Info */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <FiUserCheck className="text-cyan-400" /> Leader:{" "}
                      <strong>{currentTeam.leader?.name || "N/A"}</strong>
                    </span>
                    {currentTeam.leader?.college && (
                      <span>• {currentTeam.leader.college}</span>
                    )}
                    {currentTeam.leader?.department && (
                      <span>• {currentTeam.leader.department}</span>
                    )}
                    {currentTeam.members && currentTeam.members.length > 0 && (
                      <span className="text-slate-500">
                        ({currentTeam.members.length} team members)
                      </span>
                    )}
                  </div>
                </div>

                {/* Previous Rounds Remarks Context (Crucial for Rounds 2, 3, 4) */}
                {previousRoundsHistory.length > 0 && (
                  <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <FiMessageSquare /> Previous Jury Remarks & Advice
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">
                        Reference from Earlier Rounds
                      </span>
                    </div>

                    <div className="space-y-3">
                      {previousRoundsHistory.map((h) => (
                        <div
                          key={h.round}
                          className="bg-[#060810] border border-slate-800/80 rounded-xl p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="font-bold text-slate-300">
                              Round {h.round} Evaluation Feedback:
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              Scored: {h.data.weightedTotal} pts
                            </span>
                          </div>
                          {h.data.remarks && (
                            <p className="text-xs text-slate-300 font-sans italic">
                              "{h.data.remarks}"
                            </p>
                          )}
                          {h.data.actionItemsForNextRound && (
                            <div className="text-xs bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5 text-amber-200">
                              <strong className="font-mono text-amber-300 block text-[11px] uppercase">
                                📌 Action Items given to team:
                              </strong>
                              {h.data.actionItemsForNextRound}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Items Verification Selector */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <FiCheckCircle className="text-emerald-400" />
                        Did team address earlier action items in Round {selectedRound}?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                        {[
                          { id: "RESOLVED", label: "✓ Fully Resolved", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" },
                          { id: "PARTIAL", label: "◐ Partially Addressed", color: "bg-amber-500/20 border-amber-500/50 text-amber-300" },
                          { id: "UNADDRESSED", label: "✗ Unaddressed", color: "bg-rose-500/20 border-rose-500/50 text-rose-300" },
                          { id: "N/A", label: "— Not Applicable", color: "bg-slate-800 border-slate-700 text-slate-400" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPreviousActionItemsStatus(opt.id)}
                            className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer ${
                              previousActionItemsStatus === opt.id
                                ? opt.color + " font-bold shadow-sm"
                                : "bg-[#060810] border-slate-800 text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rubric Evaluation Form */}
                <div className="bg-[#0c111e] border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                        <FiSliders className="text-amber-400" />
                        Round {selectedRound} Rubric Scoring (Max 10 Pts Per Criterion)
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Adjust sliders or click numbers to assign marks.
                      </p>
                    </div>

                    {/* Live Score Counter Pill */}
                    <div className="bg-[#060810] border border-slate-700/80 rounded-xl px-4 py-2 flex items-center gap-3 font-mono">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Raw / 50</span>
                        <strong className="text-sm text-slate-200">{rawTotal}</strong>
                      </div>
                      <div className="h-6 w-px bg-slate-700" />
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400 block uppercase">Weighted Score</span>
                        <strong className="text-lg text-amber-400 font-bold">{weightedTotal}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 5 Criteria Inputs */}
                  <div className="space-y-5">
                    {RUBRIC_CRITERIA.map((crit, idx) => {
                      const val = scores[crit.key] || 0;
                      return (
                        <div
                          key={crit.key}
                          className="bg-[#070a14] border border-slate-800/80 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 inline-flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                {crit.label}
                              </div>
                              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                {crit.desc}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                                {val} / 10
                              </span>
                            </div>
                          </div>

                          {/* Quick Step Buttons & Slider */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="1"
                                value={val}
                                onChange={(e) => handleScoreChange(crit.key, e.target.value)}
                                className="flex-1 accent-amber-500 cursor-pointer bg-slate-800 h-1.5 rounded-lg"
                              />
                            </div>

                            {/* Quick Number Buttons for Lightning Fast Scoring */}
                            <div className="grid grid-cols-11 gap-1 font-mono text-[10px]">
                              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleScoreChange(crit.key, num)}
                                  className={`py-1 rounded transition-all cursor-pointer text-center ${
                                    val === num
                                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                                      : "bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Score Math Card */}
                  <div className="p-4 rounded-xl bg-[#060810] border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-slate-400 space-y-0.5 text-center sm:text-left">
                      <div>Formula: <span className="text-slate-300">Raw Subtotal ({rawTotal}/50) × Track Multiplier ({trackMultiplier}x)</span></div>
                      <div className="text-[11px] text-slate-500">Fair track credit adjustment applied for {currentTeam.track}.</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">Normalized Round Total</span>
                      <span className="text-2xl font-extrabold text-amber-400">{weightedTotal}</span>
                      <span className="text-xs text-slate-500 ml-1 font-normal">/ {(50 * trackMultiplier).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Remarks & Feedback Inputs */}
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <FiMessageSquare className="text-cyan-400" />
                        Jury Evaluation Remarks & Constructive Critique
                      </label>
                      <textarea
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Detail the strengths, weaknesses, code architecture observations, and suggestions..."
                        className="w-full bg-[#070a14] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    {/* Action Items for Upcoming Rounds (Crucial for Rounds 1 & 2) */}
                    {selectedRound < 4 && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <FiCornerDownRight className="text-amber-400" />
                          Key Action Items for Team to Implement by Round {selectedRound + 1}
                        </label>
                        <textarea
                          rows={2}
                          value={actionItemsForNextRound}
                          onChange={(e) => setActionItemsForNextRound(e.target.value)}
                          placeholder="e.g. 1) Connect ESP32 real sensor payload, 2) Optimize inference latency, 3) Build clinician dashboard filters..."
                          className="w-full bg-[#070a14] border border-amber-500/30 rounded-xl p-3 text-xs text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-sans"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-slate-500">
                      Evaluating as: <strong className="text-slate-300">{activeEvaluator.name}</strong>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleSaveEvaluation(false)}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <FiSave size={13} />
                        {saving ? "Saving..." : "Save Evaluation"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveEvaluation(true)}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                      >
                        <span>Save & Next Team</span>
                        <FiChevronRight size={14} />
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
