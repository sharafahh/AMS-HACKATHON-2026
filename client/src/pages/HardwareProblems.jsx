import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiLock,
  FiClock,
  FiArrowLeft,
  FiZap,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle,
  FiCode,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";

function HardwareProblems() {
  // Release date for Hardware Problem Statements: 19 August 2026 09:00 AM IST (3 days prior to Aug 22)
  const releaseDate = new Date("2026-08-19T09:00:00").getTime();
  const [isReleased, setIsReleased] = useState(new Date().getTime() >= releaseDate);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = releaseDate - now;

      if (difference <= 0) {
        setIsReleased(true);
        clearInterval(timer);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d < 10 ? `0${d}` : `${d}`,
          hours: h < 10 ? `0${h}` : `${h}`,
          minutes: m < 10 ? `0${m}` : `${m}`,
          seconds: s < 10 ? `0${s}` : `${s}`,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 space-y-8">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white transition-all"
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

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] inline-flex items-center gap-1.5">
            <FiCpu /> Hardware Problem Statement Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Problem Statement <span className="text-gradient-gold">Release Portal</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
            Hardware track problem statements are released <strong>3 days prior to the event</strong> to allow component preparation. Software track problem statements are given <strong>on-spot</strong>.
          </p>
        </div>

        {/* Two Domain Info Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Software Tracks Info */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-3 relative overflow-hidden bg-cyan-500/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <FiCode size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  Software Track Domains
                </h3>
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
                  AI, Web3, FinTech, Cyber Security, Cloud
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-xs font-light leading-relaxed">
              Problem statements for all software domains are revealed <strong className="text-cyan-300">On-Spot</strong> during the opening ceremony on <strong>22 August 2026 at 9:00 AM IST</strong>.
            </p>
          </div>

          {/* Hardware Track Info */}
          <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-3 relative overflow-hidden bg-amber-500/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                <FiCpu size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  Hardware & Embedded Track
                </h3>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Robotics, Microcontrollers, IoT Sensors
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-xs font-light leading-relaxed">
              Problem statements are released <strong className="text-amber-300">3 Days Prior to Event</strong> on <strong>19 August 2026</strong> so teams can prepare hardware components.
            </p>
          </div>
        </div>

        {/* Main Status & Countdown Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 rounded-3xl border border-amber-500/40 text-center space-y-8 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0a0d24] via-[#050816] to-[#0d0920]"
        >
          {isReleased ? (
            /* Released View */
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FiCheckCircle size={44} />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold font-['Space_Grotesk'] text-xs tracking-wider uppercase">
                  🟢 Hardware Problem Statements Now Live!
                </span>
                <h2 className="text-3xl font-extrabold font-['Space_Grotesk'] text-white pt-2">
                  Official Hardware Challenge Statements
                </h2>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <h4 className="text-sm font-bold text-cyan-300">PS-HW-01: Smart Agricultural Drone & Soil Sensor Telemetry</h4>
                  <p className="text-xs text-gray-300 mt-1">Design an embedded ESP32/Arduino sensor payload capable of acquiring NPK soil data and broadcasting via LoraWAN telemetry to a central dashboard.</p>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-bold text-purple-300">PS-HW-02: Autonomous Indoor Obstacle Navigation Rover</h4>
                  <p className="text-xs text-gray-300 mt-1">Construct a 4-wheel drive rover using LiDAR or Ultrasonic sensors to navigate dynamic maze corridors and perform emergency stop signals.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Not Yet Available View with Countdown */
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <FiLock size={40} className="animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold font-['Space_Grotesk'] text-xs tracking-wider uppercase inline-flex items-center gap-1.5">
                  <FiAlertCircle /> Hardware PS Not Yet Available
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white pt-2">
                  Releasing 3 Days Prior to Hackathon
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
                  Hardware component problem statements are scheduled to unlock on <strong className="text-amber-400 font-semibold">19 August 2026 at 09:00 AM IST</strong>.
                </p>
              </div>

              {/* Release Countdown Clock */}
              <div className="pt-2">
                <p className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-4 font-['Space_Grotesk'] flex items-center justify-center gap-2">
                  <FiClock className="animate-spin-slow text-amber-400" />
                  Countdown to Hardware PS Release (19 Aug 9:00 AM)
                </p>
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                  {[
                    { label: "DAYS", value: timeLeft.days },
                    { label: "HOURS", value: timeLeft.hours },
                    { label: "MINUTES", value: timeLeft.minutes },
                    { label: "SECONDS", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-3.5 rounded-2xl border border-amber-500/30 text-center relative overflow-hidden bg-amber-500/5"
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                        {item.value}
                      </span>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-wider mt-1">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-400 max-w-md mx-auto">
                💡 Registered hardware teams will receive an email notification as soon as the problem statements unlock here!
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default HardwareProblems;
