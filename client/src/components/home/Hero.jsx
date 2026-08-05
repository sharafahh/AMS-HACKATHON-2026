import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiAward,
  FiGlobe,
  FiCpu,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import collegeLogo from "../../assets/logos/college-logo.png";
import heroCampus from "../../assets/images/hero-campus.jpg";

function Hero() {
  // Target date set for AMS HACKATHON 2026 launch (22 August 2026 9:00 AM IST)
  const targetDate = new Date("2026-08-22T09:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
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
  }, [targetDate]);

  const quickStats = [
    {
      icon: FiClock,
      title: "24 Hours",
      subtitle: "Non-Stop Build Sprint",
      color: "from-blue-600 to-blue-800",
      border: "border-blue-500/40",
    },
    {
      icon: FiAward,
      title: "₹25,500",
      subtitle: "Cash Prize Pool",
      color: "from-amber-400 to-yellow-600",
      border: "border-amber-500/40",
    },
    {
      icon: FiGlobe,
      title: "Internal Level",
      subtitle: "B.E. & B.Tech Hackers",
      color: "from-blue-500 to-indigo-700",
      border: "border-blue-500/40",
    },
    {
      icon: FiCpu,
      title: "Software + Hardware",
      subtitle: "Dual Track Format",
      color: "from-emerald-500 to-teal-700",
      border: "border-emerald-500/40",
    },
    {
      icon: FiCheckCircle,
      title: "External Jury",
      subtitle: "Corporate Industry Evaluation",
      color: "from-blue-400 to-blue-600",
      border: "border-blue-400/40",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-24 overflow-hidden flex flex-col justify-center bg-[#030712]"
    >
      {/* Full Cinematic Campus Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={heroCampus}
          alt="AMS Campus Background"
          className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-[1.2] scale-105"
        />
        {/* Deep Dual Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/80 to-[#030712]" />
        <div className="absolute inset-0 bg-cyber-grid opacity-50" />
      </div>

      {/* Ambient Electric Blue Glowing 3D Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/20 rounded-full blur-[170px] pointer-events-none animate-pulse-glow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-glow z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Organizer Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass-3d-card border border-blue-500/30 shadow-2xl">
            <img
              src={collegeLogo}
              alt="Aalim Muhammed Salegh College of Engineering"
              className="h-6 w-auto object-contain bg-white/10 p-0.5 rounded"
            />
            <span className="text-white text-xs sm:text-sm font-bold tracking-wider font-['Space_Grotesk'] uppercase">
              Aalim Muhammed Salegh College of Engineering
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/40 text-blue-300 text-xs font-extrabold tracking-wider uppercase font-['Space_Grotesk'] shadow-lg">
            <FiZap className="animate-bounce text-blue-400" />
            Presents
          </div>
        </motion.div>

        {/* Centered Main 3D Title & Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-blue-600/25 text-blue-300 border border-blue-500/40 tracking-wider uppercase font-['Space_Grotesk'] shadow-lg">
              Internal Level 24-Hour Hackathon
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 tracking-wider font-['Space_Grotesk']">
              B.E. & B.Tech Engineering Students
            </span>
          </div>

          {/* Main Title with Metallic Tech Gradient */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight font-['Space_Grotesk'] text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              AMS HACKATHON <span className="text-gradient-tech-blue">2026</span>
            </h1>

            {/* Tagline */}
            <p className="text-2xl sm:text-4xl font-extrabold tracking-wide font-['Space_Grotesk'] text-white">
              24 Hours. <span className="text-gradient-gold">Infinite Possibilities.</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-xl max-w-3xl font-light leading-relaxed mx-auto">
            Join India’s top student engineering innovators at Aalim Muhammed Salegh College of Engineering for 24 continuous hours of intense creation, hardware-software breakthrough, and cash rewards!
          </p>

          {/* 3D Glass Countdown Timer */}
          <div className="pt-4 max-w-xl mx-auto">
            <p className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-4 flex items-center justify-center gap-2 font-['Space_Grotesk']">
              <FiClock className="animate-spin-slow text-amber-400" />
              Hackathon Launch Countdown (22 August 2026 9:00 AM)
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-5 perspective-1000">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HOURS", value: timeLeft.hours },
                { label: "MINUTES", value: timeLeft.minutes },
                { label: "SECONDS", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card-3d glass-3d-card p-4 rounded-2xl border border-blue-500/30 text-center relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white drop-shadow-md">
                    {item.value}
                  </span>
                  <span className="relative block text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-extrabold font-['Space_Grotesk'] text-base tracking-wider shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              Register Now
              <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              to="/portal"
              className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-['Space_Grotesk'] text-base tracking-wider shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Student Portal
            </Link>

            <a
              href="#tracks"
              className="w-full sm:w-auto px-9 py-4.5 rounded-2xl glass-3d-card text-white font-bold font-['Space_Grotesk'] text-base tracking-wider border border-white/20 hover:border-blue-400/60 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
            >
              <FiLayers className="text-cyan-400" />
              Explore Tracks
            </a>
          </div>
        </motion.div>

        {/* Floating 3D Information Cards Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 perspective-1000"
        >
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`card-3d glass-3d-card p-5 rounded-2xl border ${stat.border} flex flex-col items-start space-y-3 relative overflow-hidden group shadow-xl`}
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg font-['Space_Grotesk'] group-hover:text-blue-300 transition-colors">
                    {stat.title}
                  </h4>
                  <p className="text-gray-400 text-xs font-medium">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
