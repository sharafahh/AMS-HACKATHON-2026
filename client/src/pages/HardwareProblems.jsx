import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiUnlock,
  FiKey,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiCpu,
  FiLayers,
  FiArrowRight,
  FiX,
  FiCopy,
  FiCheck,
  FiArrowLeft,
  FiInfo,
  FiZap,
  FiAward,
} from "react-icons/fi";
import { PROBLEM_STATEMENTS } from "../data/problemStatements";
import { PROBLEM_REVEAL_TIMESTAMP, formatRevealRemaining } from "../constants/reveal";
import ProblemStatementPicker from "../components/hardware/ProblemStatementPicker";

const TRACKS_LIST = [
  "All Tracks",
  "AI & Machine Learning",
  "Cyber Security",
  "Healthcare",
  "Agriculture",
  "Smart Education",
  "Smart Mobility",
  "Smart Automation",
  "FinTech",
  "Sustainability",
  "Disaster Management",
  "Quantum Computing",
  "Open Innovation",
];

const VALID_PASSCODES = ["AMS2026", "HACK2026", "PASS2026", "DEMO2026", "OPEN2026"];

function HardwareProblems() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryTrack = searchParams.get("track");

  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return (
      sessionStorage.getItem("ams_hackathon_ps_unlocked") === "true" ||
      Date.now() >= PROBLEM_REVEAL_TIMESTAMP
    );
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Auto-unlock the moment the official reveal time passes (11:01 AM IST, Aug 19)
  const [revealCountdown, setRevealCountdown] = useState(() =>
    Math.max(0, PROBLEM_REVEAL_TIMESTAMP - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = PROBLEM_REVEAL_TIMESTAMP - Date.now();
      setRevealCountdown(Math.max(0, remaining));
      if (remaining <= 0 && !sessionStorage.getItem("ams_hackathon_ps_unlocked")) {
        sessionStorage.setItem("ams_hackathon_ps_unlocked", "true");
        setIsUnlocked(true);

        // Backup email trigger: notify server once per browser that the reveal
        // moment has passed (server is idempotent — sends only once total).
        if (!sessionStorage.getItem("ams_hackathon_ps_notified")) {
          sessionStorage.setItem("ams_hackathon_ps_notified", "true");
          fetch("/api/ps-release/notify", { method: "POST" }).catch(() => {});
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filters State
  const [selectedTrack, setSelectedTrack] = useState(() => {
    if (queryTrack && TRACKS_LIST.includes(queryTrack)) {
      return queryTrack;
    }
    return "All Tracks";
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    if (queryTrack && TRACKS_LIST.includes(queryTrack)) {
      setSelectedTrack(queryTrack);
    }
  }, [queryTrack]);

  // Handle Authentication Submission
  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const cleanPass = passcode.trim().toUpperCase();

    const isValidPass =
      VALID_PASSCODES.includes(cleanPass) ||
      cleanPass.startsWith("HV26-") ||
      cleanPass.length >= 6;

    setTimeout(() => {
      setAuthLoading(false);
      if (isValidPass) {
        setIsUnlocked(true);
        sessionStorage.setItem("ams_hackathon_ps_unlocked", "true");
      } else {
        setAuthError("Invalid access key. Use the demo key 'AMS2026' or your Registration ID.");
      }
    }, 400);
  };

  const handleQuickUnlock = () => {
    setPasscode("AMS2026");
    setIsUnlocked(true);
    sessionStorage.setItem("ams_hackathon_ps_unlocked", "true");
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem("ams_hackathon_ps_unlocked");
    setPasscode("");
    setAuthError("");
  };

  // Filtered Problem Statements
  const filteredProblems = useMemo(() => {
    return PROBLEM_STATEMENTS.filter((ps) => {
      // Track filter
      if (selectedTrack !== "All Tracks" && ps.track !== selectedTrack) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "Hardware" && ps.category !== "Hardware" && ps.category !== "Dual Track") {
          return false;
        }
        if (selectedCategory === "Software" && ps.category !== "Software" && ps.category !== "Dual Track") {
          return false;
        }
        if (selectedCategory === "Dual Track" && ps.category !== "Dual Track") {
          return false;
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = ps.id.toLowerCase().includes(query);
        const matchesTitle = ps.title.toLowerCase().includes(query);
        const matchesTrack = ps.track.toLowerCase().includes(query);
        const matchesSummary = ps.summary.toLowerCase().includes(query);
        const matchesTech = ps.techStack.some((t) => t.toLowerCase().includes(query));
        return matchesId || matchesTitle || matchesTrack || matchesSummary || matchesTech;
      }
      return true;
    });
  }, [selectedTrack, selectedCategory, searchQuery]);

  const handleCopyId = (id, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <Link
              to="/#tracks"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider font-['Space_Grotesk'] mb-2"
            >
              <FiArrowLeft /> Back to Hackathon Tracks
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
              Hackathon <span className="text-gradient-cyan-purple">Problem Statements</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-light">
              Official challenge statements across 12 innovation domains (Software & Hardware).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5">
                  <FiUnlock size={13} /> Access Granted
                </span>
                <button
                  onClick={handleLockSession}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-gray-300 hover:text-rose-300 text-xs font-semibold font-['Space_Grotesk'] transition-all cursor-pointer"
                >
                  Lock Session
                </button>
              </div>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5">
                <FiLock size={13} /> Protected Portal
              </span>
            )}
          </div>
        </div>

        {/* -------------------- GATED AUTHENTICATION LOCK VIEW -------------------- */}
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center space-y-8 pt-6"
          >
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0b1329] via-[#050816] to-[#0d0920]">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
                <FiLock size={36} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] inline-flex items-center gap-1.5">
                  <FiKey /> Team Access Required
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Enter Access Passcode
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
                  Enter your assigned Participant Passcode or Registration ID to explore the official problem statements and specifications.
                </p>
                {revealCountdown > 0 && (
                  <p className="text-amber-300 text-xs sm:text-sm font-semibold font-['Space_Grotesk'] inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3.5 py-1.5">
                    <FiClock className="animate-pulse" />
                    Official Reveal in {formatRevealRemaining(revealCountdown)}
                  </p>
                )}
              </div>

              {/* Passcode Form */}
              <form onSubmit={handleUnlock} className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300 font-['Space_Grotesk'] flex items-center gap-1.5">
                    <FiKey className="text-amber-400" /> Access Key / Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="e.g. AMS2026 or HV26-XXXXX"
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#030712] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-sm font-['Space_Grotesk'] focus:outline-none transition-colors shadow-inner"
                      autoFocus
                    />
                  </div>
                  {authError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-400 font-semibold flex items-center gap-1 mt-1.5"
                    >
                      <FiAlertCircle /> {authError}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-extrabold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying Access...
                    </span>
                  ) : (
                    <>
                      <FiUnlock size={16} />
                      Unlock Problem Statements
                    </>
                  )}
                </button>
              </form>

              {/* Placeholder / Demo Pass Banner */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-gray-300 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 font-['Space_Grotesk'] flex items-center gap-1.5">
                    <FiInfo className="text-cyan-400" /> Placeholder Demo Key:
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] font-['Space_Grotesk'] border border-cyan-500/40 transition-colors cursor-pointer"
                  >
                    Quick Unlock (AMS2026)
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  During development and visitor inspection, you can unlock using passcode <strong className="text-cyan-300 font-mono font-bold">AMS2026</strong> or any valid registration ID.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (

          /* -------------------- UNLOCKED PROBLEM STATEMENTS CATALOG -------------------- */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Team Problem Statement Selection */}
            <ProblemStatementPicker />

            {/* Search & Filter Bar */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 bg-[#0b1329]/70 backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by statement title, PS Code (e.g. PS-AI-01), track, or technology..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 text-white placeholder-gray-400 text-sm focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Category Selector Tabs */}
                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                  {["All", "Software", "Hardware", "Dual Track"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {cat === "All" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Track Selector Horizontal Scroll Pills */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 font-['Space_Grotesk'] flex items-center gap-1.5">
                  <FiLayers /> Filter By Innovation Track:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {TRACKS_LIST.map((track) => (
                    <button
                      key={track}
                      onClick={() => {
                        setSelectedTrack(track);
                        if (track === "All Tracks") {
                          searchParams.delete("track");
                          setSearchParams(searchParams);
                        } else {
                          setSearchParams({ track });
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-['Space_Grotesk'] whitespace-nowrap transition-all cursor-pointer ${
                        selectedTrack === track
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20"
                          : "bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count Header */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-gray-400 font-medium">
                Showing <strong className="text-white font-bold">{filteredProblems.length}</strong> problem statements
                {selectedTrack !== "All Tracks" ? ` in ${selectedTrack}` : ""}
              </span>
              <span className="text-[11px] text-cyan-400 font-semibold font-['Space_Grotesk'] uppercase tracking-wider">
                Click any statement to view full specifications
              </span>
            </div>

            {/* Problem Statements Cards Grid */}
            {filteredProblems.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-3xl border border-white/10 space-y-4">
                <FiInfo className="mx-auto text-4xl text-gray-500" />
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  No matching problem statements found
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Try clearing your search query or selecting "All Tracks" from the filter tabs above.
                </p>
                <button
                  onClick={() => {
                    setSelectedTrack("All Tracks");
                    setSelectedCategory("All");
                    setSearchQuery("");
                    searchParams.delete("track");
                    setSearchParams(searchParams);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs font-['Space_Grotesk'] border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((problem) => (
                  <motion.div
                    key={problem.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setSelectedProblem(problem)}
                    className="glass-card p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 flex flex-col justify-between cursor-pointer relative group transition-all duration-300 shadow-xl hover:shadow-2xl bg-[#0a0f24]/60 hover:bg-[#0d1430]"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                          {problem.id}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-['Space_Grotesk'] tracking-wider ${
                              problem.category === "Hardware"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : problem.category === "Dual Track"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {problem.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-['Space_Grotesk'] ${
                              problem.difficulty === "Grand Challenge"
                                ? "bg-rose-500/20 text-rose-300"
                                : problem.difficulty === "Advanced"
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Track Domain Tag */}
                      <div className="text-[11px] font-bold text-gray-400 group-hover:text-cyan-300 transition-colors uppercase tracking-wider font-['Space_Grotesk']">
                        {problem.track}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                        {problem.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-300 text-xs leading-relaxed font-light line-clamp-3">
                        {problem.summary}
                      </p>

                      {/* Deliverables snippet */}
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          Key Deliverable Focus:
                        </span>
                        <div className="text-xs text-gray-300 flex items-start gap-2">
                          <FiCheckCircle className="text-cyan-400 mt-0.5 flex-shrink-0" size={12} />
                          <span className="line-clamp-1">{problem.deliverables[0]}</span>
                        </div>
                      </div>

                      {/* Tech Stack Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {problem.techStack.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {problem.techStack.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-cyan-400 font-bold">
                            +{problem.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="pt-5 border-t border-white/10 mt-5 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span className="text-[11px] uppercase font-bold tracking-wider font-['Space_Grotesk']">
                        View Specification
                      </span>
                      <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* -------------------- DETAIL SPECIFICATION MODAL -------------------- */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProblem(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/40 relative overflow-hidden shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto bg-[#070c20]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <FiX size={20} />
                </button>

                {/* Header Section */}
                <div className="space-y-3 border-b border-white/10 pb-5 pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
                      {selectedProblem.id}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold text-xs font-['Space_Grotesk']">
                      {selectedProblem.track}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs font-['Space_Grotesk']">
                      {selectedProblem.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-xs font-['Space_Grotesk']">
                      {selectedProblem.difficulty}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white leading-tight">
                    {selectedProblem.title}
                  </h2>
                </div>

                {/* Body Content */}
                <div className="space-y-6 text-sm text-gray-300 font-light leading-relaxed">
                  {/* Context & Background */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-['Space_Grotesk'] flex items-center gap-1.5">
                      <FiInfo /> Background & Industry Problem Context
                    </h4>
                    <p className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {selectedProblem.context}
                    </p>
                  </div>

                  {/* Summary / Challenge Statement */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-['Space_Grotesk'] flex items-center gap-1.5">
                      <FiZap /> Challenge Statement Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-200">
                      {selectedProblem.summary}
                    </p>
                  </div>

                  {/* Expected Deliverables */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-['Space_Grotesk'] flex items-center gap-1.5">
                      <FiCheckCircle /> Expected Solution Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProblem.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation Criteria */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-['Space_Grotesk'] flex items-center gap-1.5">
                      <FiAward /> Evaluation & Scoring Matrix
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedProblem.evaluation.map((evalItem, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200"
                        >
                          {evalItem}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack / Hardware Components */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-['Space_Grotesk'] flex items-center gap-1.5">
                      <FiCpu /> Suggested Tech Stack & Hardware Components
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProblem.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-xs font-mono text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={(e) => handleCopyId(selectedProblem.id, e)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold font-['Space_Grotesk'] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedId === selectedProblem.id ? (
                      <>
                        <FiCheck className="text-emerald-400" /> Copied Problem ID
                      </>
                    ) : (
                      <>
                        <FiCopy /> Copy Problem ID ({selectedProblem.id})
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HardwareProblems;
