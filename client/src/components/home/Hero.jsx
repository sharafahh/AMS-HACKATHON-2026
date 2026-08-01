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
import hackverseLogo from "../../assets/logos/hackverse-logo.png";
import heroCampus from "../../assets/images/hero-campus.jpg";

function Hero() {
  // Target date set for Hackverse 2026 launch (22 August 2026 9:00 AM IST)
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
      subtitle: "Non-stop Coding",
      color: "from-cyan-500 to-blue-600",
      border: "border-cyan-500/30",
    },
    {
      icon: FiAward,
      title: "₹25,500",
      subtitle: "Prize Pool",
      color: "from-amber-400 to-yellow-600",
      border: "border-amber-500/30",
    },
    {
      icon: FiGlobe,
      title: "National Level",
      subtitle: "Pan-India Hackers",
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-500/30",
    },
    {
      icon: FiCpu,
      title: "Software + Hardware",
      subtitle: "Dual Track Format",
      color: "from-emerald-400 to-teal-600",
      border: "border-emerald-500/30",
    },
    {
      icon: FiCheckCircle,
      title: "Certificates",
      subtitle: "For All Participants",
      color: "from-pink-500 to-rose-600",
      border: "border-pink-500/30",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 overflow-hidden flex flex-col justify-center bg-[#050816] bg-cyber-grid"
    >
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Organizer Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border border-white/10 shadow-lg">
            <img
              src={collegeLogo}
              alt="Aalim Muhammed Salegh College of Engineering"
              className="h-7 w-auto object-contain"
            />
            <span className="text-gray-300 text-xs sm:text-sm font-medium tracking-wide">
              AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <FiZap className="animate-bounce" />
            Presents
          </div>
        </motion.div>

        {/* Hero Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 tracking-wide uppercase">
                National Level Hackathon
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-wide">
                Inspired by Smart India Hackathon Themes
              </span>
            </div>

            {/* Hackverse Logo + Title */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={hackverseLogo}
                  alt="Hackverse Logo"
                  className="h-16 sm:h-20 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                />
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-['Space_Grotesk'] text-white">
                  HACKVERSE <span className="text-gradient-cyan-purple">2026</span>
                </h1>
              </div>

              {/* Tagline */}
              <p className="text-2xl sm:text-3xl font-semibold tracking-wide font-['Space_Grotesk'] text-cyan-300">
                24 Hours. <span className="text-gradient-gold">Infinite Possibilities.</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Join India’s top student innovators, developers, and hardware architects at Aalim Muhammed Salegh College of Engineering for 24 continuous hours of intense creation, breakthrough technology, and cash rewards!
            </p>

            {/* Countdown Timer */}
            <div className="pt-2">
              <p className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-3 flex items-center justify-center lg:justify-start gap-2 font-['Space_Grotesk']">
                <FiClock className="animate-spin-slow text-amber-400" />
                Hackathon Launch Countdown
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0">
                {[
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HOURS", value: timeLeft.hours },
                  { label: "MINUTES", value: timeLeft.minutes },
                  { label: "SECONDS", value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-3 rounded-2xl border border-cyan-500/20 text-center relative overflow-hidden group hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5" />
                    <span className="relative text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
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
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-base tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                Register Now
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <a
                href="#tracks"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-gray-200 hover:text-white font-semibold font-['Space_Grotesk'] text-base tracking-wider border border-white/15 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FiLayers className="text-cyan-400" />
                Explore Tracks
              </a>
            </div>
          </motion.div>

          {/* Image Showcase Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-600 to-amber-500 opacity-40 blur-xl animate-pulse-glow" />

              <div className="relative rounded-3xl overflow-hidden glass-card p-3 border border-white/20 shadow-2xl">
                <img
                  src={heroCampus}
                  alt="Aalim Muhammed Salegh College Campus"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/20 backdrop-blur-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm font-['Space_Grotesk']">
                      Aalim Muhammed Salegh CoE
                    </h4>
                    <p className="text-gray-300 text-xs font-light">
                      Avadi-IAF, Chennai, Tamil Nadu
                    </p>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Information Cards Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`glass-card glass-card-hover p-5 rounded-2xl border ${stat.border} flex flex-col items-start space-y-3 relative overflow-hidden group`}
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors">
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
