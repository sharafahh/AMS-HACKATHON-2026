import { motion } from "framer-motion";
import collegeLogo from "../../assets/logos/college-logo.png";
import amsHackathonLogo from "../../assets/logos/ams-hackathon-logo.png";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-[#050816] flex flex-col items-center justify-center p-4">
      {/* Background ambient glow */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center space-y-6 text-center"
      >
        {/* Logos Branding */}
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
          <img src={collegeLogo} alt="College Logo" className="h-10 w-auto object-contain" />
          <div className="h-6 w-[1px] bg-white/20" />
          <img src={amsHackathonLogo} alt="AMS HACKATHON 2026 Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Spinner Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/40 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-wide">
            AMS HACKATHON <span className="text-cyan-400">2026</span>
          </h2>
          <p className="text-xs text-gray-400 font-light tracking-wider uppercase">
            Loading Cyber Experience...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;
