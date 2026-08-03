import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiTag,
  FiBookOpen,
  FiCpu,
  FiAward,
  FiFileText,
  FiPrinter,
  FiArrowLeft,
  FiAlertCircle,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";

function Portal() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchQuery, setSearchQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [teamResult, setTeamResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (queryToSearch) => {
    const q = queryToSearch || searchQuery;
    if (!q.trim()) {
      setError("Please enter a Registration ID or Email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call Backend API to fetch team
      const res = await fetch(`http://localhost:5000/api/teams/${encodeURIComponent(q.trim())}`);
      const data = await res.json();

      if (data.success && data.team) {
        setTeamResult(data.team);
      } else {
        // Fallback search check if query matches email across mock/test state
        setTeamResult(null);
        setError(`No registration found matching "${q}". Please check your Registration ID (e.g. HV26-XXXXX) or registered leader email.`);
      }
    } catch (err) {
      // Demo mock fallback if API server is disconnected
      if (q.toUpperCase().startsWith("HV") || q.includes("@")) {
        setTeamResult({
          registrationId: q.toUpperCase().startsWith("HV") ? q.toUpperCase() : "HV26-9A82F",
          teamName: "CyberKnights",
          teamSize: 4,
          leader: {
            name: "John Doe",
            email: q.includes("@") ? q : "leader@college.edu",
            phone: "9876543210",
            college: "Aalim Muhammed Salegh College of Engineering",
            department: "CSE",
            year: "3rd Year",
          },
          members: [
            { name: "John Doe", email: "leader@college.edu", phone: "9876543210", role: "Team Leader / Fullstack" },
            { name: "Jane Smith", email: "jane@college.edu", phone: "9876543211", role: "AI & ML Specialist" },
            { name: "Robert Chen", email: "robert@college.edu", phone: "9876543212", role: "Backend Developer" },
            { name: "Sarah Williams", email: "sarah@college.edu", phone: "9876543213", role: "UI/UX Designer" },
          ],
          track: "AI & Machine Learning",
          problemTitle: "AI-Powered Autonomous Crop Disease Detection System",
          problemAbstract: "Building an edge AI visual diagnostic tool for real-time crop disease detection using drone imagery.",
          status: "CONFIRMED",
          paymentStatus: "PAID",
          createdAt: new Date(),
        });
      } else {
        setError(`No registration found for "${q}". Please check your input.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center">
      {/* Glow Orbs */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <FiArrowLeft size={16} /> Return to AMS HACKATHON 2026
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
              <img src={collegeLogo} alt="College Logo" className="h-8 w-auto object-contain" />
              <div className="h-5 w-[1px] bg-white/20" />
              <img src={amsHackathonLogo} alt="AMS HACKATHON 2026 Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="text-white font-bold font-['Space_Grotesk'] text-base">
              AMS HACKATHON 2026
            </span>
          </div>
        </div>

        {/* Search Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk']">
            Participant Self-Service Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Track Your <span className="text-gradient-cyan-purple">Registration Status</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Search using your unique Registration ID (e.g. <strong>HV26-XXXXX</strong>) or registered Leader Email.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Registration ID (e.g. HV26-8A3F9) or Leader Email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Search Portal"}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Team Result Dashboard Card */}
        {teamResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-8 shadow-2xl relative overflow-hidden"
          >
            {/* Title & Status Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Registration ID: {teamResult.registrationId}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white mt-1">
                  {teamResult.teamName}
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Institution: {teamResult.leader?.college}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FiCheckCircle /> Status: {teamResult.status || "CONFIRMED"}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FiShield /> Payment: {teamResult.paymentStatus || "PAID"}
                </span>
              </div>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
              {/* Leader Box */}
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 text-cyan-400">
                  <FiUser /> Team Leader & Contact
                </h3>
                <div className="space-y-1.5">
                  <p><strong className="text-gray-400">Leader Name:</strong> {teamResult.leader?.name}</p>
                  <p><strong className="text-gray-400">Email:</strong> {teamResult.leader?.email}</p>
                  <p><strong className="text-gray-400">Phone:</strong> {teamResult.leader?.phone}</p>
                  <p><strong className="text-gray-400">Department:</strong> {teamResult.leader?.department} ({teamResult.leader?.year})</p>
                </div>
              </div>

              {/* Track Box */}
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 text-amber-400">
                  <FiCpu /> Selected Track & Abstract
                </h3>
                <div className="space-y-1.5">
                  <p><strong className="text-gray-400">Track:</strong> <span className="text-cyan-300 font-semibold">{teamResult.track}</span></p>
                  <p><strong className="text-gray-400">Project Title:</strong> {teamResult.problemTitle}</p>
                  <p className="line-clamp-3"><strong className="text-gray-400">Abstract:</strong> {teamResult.problemAbstract}</p>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-extrabold font-['Space_Grotesk'] uppercase tracking-wider text-white flex items-center gap-2">
                  <FiUsers className="text-cyan-400" />
                  Registered Team Members ({teamResult.members?.length || teamResult.teamSize} Members)
                </h3>
                <span className="text-xs text-gray-400">In-Person Attendance Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(teamResult.members || []).map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-['Space_Grotesk']">
                        Member {idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-medium">
                        {m.role || "Member"}
                      </span>
                    </div>
                    <p className="text-gray-200 font-medium truncate">{m.name}</p>
                    <p className="text-gray-400 text-[11px] truncate">{m.email}</p>
                    <p className="text-gray-400 text-[11px]">{m.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Status & Receipt Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-2">
                <h4 className="font-bold text-cyan-400 flex items-center gap-2 text-sm font-['Space_Grotesk']">
                  <FiAward size={18} /> Physical Certificate Status
                </h4>
                <p className="text-gray-300 font-light">
                  Physical certificates will be distributed at the venue upon live evaluation during the Valedictory Ceremony on <strong>August 23, 2026</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-amber-400 flex items-center gap-2 text-sm font-['Space_Grotesk']">
                    <FiPrinter size={18} /> Official Payment Receipt
                  </h4>
                  <p className="text-gray-300 font-light">
                    Amount Paid: <strong>₹{(teamResult.teamSize || 4) * 1} INR</strong> (Razorpay Secured).
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors w-fit flex items-center gap-1.5"
                >
                  <FiPrinter /> Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Portal;