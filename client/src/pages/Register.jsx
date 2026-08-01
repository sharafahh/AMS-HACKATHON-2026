import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import hackverseLogo from "../assets/logos/hackverse-logo.png";
import RegisterForm from "../components/register/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <FiArrowLeft size={16} /> Return to HACKVERSE 2026
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
              <img src={collegeLogo} alt="College Logo" className="h-8 w-auto object-contain" />
              <div className="h-5 w-[1px] bg-white/20" />
              <img src={hackverseLogo} alt="Hackverse Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="text-white font-bold font-['Space_Grotesk'] text-base">
              HACKVERSE 2026
            </span>
          </div>
        </div>

        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk']">
            Official Team Registration
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Join The <span className="text-gradient-cyan-purple">24-Hour Sprint</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Aalim Muhammed Salegh College of Engineering — National Level Hackathon. Complete all 4 steps below to register your team (3 to 6 members).
          </p>
        </div>

        {/* Stepper Register Form */}
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;