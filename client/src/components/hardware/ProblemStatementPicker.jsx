import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiKey,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiTarget,
  FiClock,
  FiUser,
  FiLayers,
} from "react-icons/fi";
import { PROBLEM_STATEMENTS } from "../../data/problemStatements";

/**
 * ProblemStatementPicker
 * Lets a registered team leader look up their team by Registration ID and
 * select one problem statement from their own track's hardware set.
 * Multiple teams may select the same statement (last write wins per team).
 */
export default function ProblemStatementPicker() {
  const [regId, setRegId] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [teamInfo, setTeamInfo] = useState(null);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState(null);
  const [softwareNote, setSoftwareNote] = useState(null);
  const [isHardwareTrack, setIsHardwareTrack] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [justSaved, setJustSaved] = useState("");

  const handleLookup = async (e) => {
    e?.preventDefault();
    const id = regId.trim().toUpperCase();
    if (!id) {
      setLookupError("Enter your Registration ID (e.g. HV26-XXXXX).");
      return;
    }
    setLoading(true);
    setLookupError("");
    setSaveError("");
    setJustSaved("");
    try {
      const res = await fetch(`/api/ps-selection/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!data.success) {
        setTeamInfo(null);
        setAvailable([]);
        setSelected(null);
        setSoftwareNote(null);
        setLookupError(data.message || "Lookup failed. Try again.");
        return;
      }
      setTeamInfo(data.team);
      setIsHardwareTrack(data.hardwareTrack);
      setSoftwareNote(data.softwareNote || null);
      setSelected(data.selectedProblem || null);
      // Match full statement details from the shared client dataset
      setAvailable(
        (data.availableProblems || []).map((p) => {
          const full = PROBLEM_STATEMENTS.find((s) => s.id === p.id) || {};
          return { ...p, ...full };
        })
      );
    } catch (err) {
      setLookupError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (problem) => {
    setSavingId(problem.id);
    setSaveError("");
    setJustSaved("");
    try {
      const res = await fetch("/api/ps-selection/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId.trim().toUpperCase(),
          problemId: problem.id,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setSaveError(data.message || "Selection failed. Try again.");
        return;
      }
      setSelected(data.selectedProblem);
      setJustSaved(data.message);
    } catch (err) {
      setSaveError("Network error while saving. Try again.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-amber-500/25 bg-[#0b1329]/70 backdrop-blur-xl space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <FiTarget size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold font-['Space_Grotesk'] text-white flex items-center gap-2">
            Choose Your Problem Statement
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              One per team · Change allowed
            </span>
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Enter your team&apos;s Registration ID from the confirmation email to see the official
            statements for your track and lock in your pick.
          </p>
        </div>
      </div>

      {/* Registration ID lookup */}
      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
          <input
            type="text"
            value={regId}
            onChange={(e) => setRegId(e.target.value.toUpperCase())}
            placeholder="e.g. HV26-7VT23"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-400 text-white placeholder-gray-500 text-sm font-mono focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Looking up...
            </span>
          ) : (
            <>
              <FiArrowRight size={14} /> Find My Team
            </>
          )}
        </button>
      </form>

      {lookupError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-rose-400 font-semibold flex items-center gap-1.5"
        >
          <FiAlertCircle /> {lookupError}
        </motion.p>
      )}

      {/* Lookup result */}
      <AnimatePresence>
        {teamInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 border-t border-white/10 pt-4"
          >
            {/* Team summary */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 font-semibold flex items-center gap-1.5">
                <FiUser className="text-amber-400" /> {teamInfo.teamName}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-200 font-mono font-semibold">
                {teamInfo.registrationId}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-semibold flex items-center gap-1.5">
                <FiLayers className="text-cyan-400" /> {teamInfo.track}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-semibold">
                {teamInfo.paymentStatus}
              </span>
            </div>

            {/* Software-only track notice */}
            {!isHardwareTrack && softwareNote && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-100 flex items-start gap-2">
                <FiClock className="text-cyan-400 mt-0.5 shrink-0" />
                <span>{softwareNote}</span>
              </div>
            )}

            {/* Current selection banner */}
            {selected && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2">
                <FiCheckCircle className="text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold uppercase tracking-wider text-emerald-300">Current Selection</p>
                  <p>
                    <span className="font-mono font-bold">{selected.problemId}</span> — {selected.title}
                  </p>
                </div>
              </div>
            )}

            {justSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5"
              >
                <FiCheckCircle /> {justSaved}
              </motion.p>
            )}
            {saveError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-rose-400 font-semibold flex items-center gap-1.5"
              >
                <FiAlertCircle /> {saveError}
              </motion.p>
            )}

            {/* Track statements */}
            {isHardwareTrack && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400 font-['Space_Grotesk']">
                  {available.length} Official Statement{available.length === 1 ? "" : "s"} for your track — select one
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {available.map((problem) => {
                    const isCurrent = selected?.problemId === problem.id;
                    return (
                      <div
                        key={problem.id}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                            : "bg-white/5 border-white/10 hover:border-amber-500/40 hover:bg-white/10"
                        }`}
                        onClick={() => !isCurrent && handleSelect(problem)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono font-bold text-[11px] text-amber-300">{problem.id}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <FiCheckCircle size={10} /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white mt-1.5 leading-snug">{problem.title}</p>
                        {!isCurrent && (
                          <p className="text-[11px] text-amber-300/80 font-semibold mt-2 flex items-center gap-1">
                            <FiArrowRight size={11} />
                            {savingId === problem.id ? "Saving..." : "Select this statement"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
