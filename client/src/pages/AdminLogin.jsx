import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiUser, FiArrowLeft, FiShield, FiAlertCircle } from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";
import { adminLoginAPI } from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await adminLoginAPI(username, password);
      if (data.success && data.token) {
        localStorage.setItem("ams_hackathon_2026_admin_token", data.token);
        localStorage.setItem("ams_hackathon_2026_admin_user", JSON.stringify(data.admin));
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Failed to authenticate with server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        {/* Navigation Link */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white transition-all"
          >
            <FiArrowLeft size={16} /> Return to AMS HACKATHON 2026
          </Link>
        </div>

        {/* Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={collegeLogo} alt="College Logo" className="h-9 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-white/20" />
            <img src={amsHackathonLogo} alt="AMS HACKATHON 2026 Logo" className="h-9 w-auto object-contain" />
          </div>

          <div className="space-y-1">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] inline-flex items-center gap-1.5">
              <FiShield /> Protected Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white pt-2">
              Organizer Admin Login
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Enter admin credentials to access live registration data and management console.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <FiUser className="text-cyan-400" /> Admin Username *
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <FiLock className="text-cyan-400" /> Password *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Login To Dashboard"}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/10 text-[11px] text-gray-400">
            Demo Credentials: <strong className="text-cyan-400">admin</strong> / <strong className="text-cyan-400">amshackathon2026</strong>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLogin;
