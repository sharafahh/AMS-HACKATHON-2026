import { Link } from "react-router-dom";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-10 rounded-3xl border border-white/10 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <FiAlertTriangle size={36} />
        </div>

        <h1 className="text-6xl font-black font-['Space_Grotesk'] text-gradient-cyan-purple">
          404
        </h1>

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Page Lost in Cyberspace
          </h2>
          <p className="text-gray-400 text-xs font-light">
            The page or route you requested does not exist in HACKVERSE 2026.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
        >
          <FiHome /> Back to HACKVERSE
        </Link>
      </div>
    </div>
  );
}

export default NotFound;