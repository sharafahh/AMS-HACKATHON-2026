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
import heroCampus from "../../assets/images/hero-campus.jpg.jpg";
import HeroThreeScene from "./HeroThreeScene";

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
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: FiAward,
      title: "₹25,500",
      subtitle: "Cash Prize Pool",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: FiGlobe,
      title: "Internal Level",
      subtitle: "B.E. & B.Tech Hackers",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: FiCpu,
      title: "Software + Hardware",
      subtitle: "Dual Track Format",
      color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    },
    {
      icon: FiCheckCircle,
      title: "External Jury",
      subtitle: "Corporate Industry Evaluation",
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-24 overflow-hidden flex flex-col justify-center bg-[#07121F] bg-lab-mesh"
    >
      {/* Full Cinematic Campus Background Layer with Depth Fog */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <img
          src={heroCampus}
          alt="AMS Campus Background"
          className="w-full h-full object-cover object-center filter brightness-75 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07121F]/90 via-[#07121F]/80 to-[#07121F]" />
      </div>

      {/* Layered Soft Ambient Light Beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        {/* Organizer Header Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#10263B]/90 border border-white/10 shadow-xl backdrop-blur-md">
            <img
              src={collegeLogo}
              alt="Aalim Muhammed Salegh College of Engineering"
              className="h-5 w-auto object-contain bg-white/10 p-0.5 rounded"
            />
            <span className="text-slate-200 text-xs sm:text-sm font-semibold tracking-wider font-['Space_Grotesk'] uppercase">
              Aalim Muhammed Salegh College of Engineering
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase font-['Space_Grotesk']">
            <FiZap className="text-blue-400" />
            Presents
          </div>
        </motion.div>

        {/* Grid Container: Content + 3D Core Scene */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-center lg:text-left">
          
          {/* Main Hero Content (Left 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 tracking-wider uppercase font-['Space_Grotesk']">
                Internal 24-Hour Sprint
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 tracking-wider font-['Space_Grotesk']">
                B.E. & B.Tech Hackers
              </span>
            </div>

            {/* Confident Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight font-['Space_Grotesk'] text-white">
                AMS HACKATHON <span className="text-gradient-tech-blue">2026</span>
              </h1>

              <p className="text-xl sm:text-3xl font-extrabold tracking-wide font-['Space_Grotesk'] text-slate-200">
                24 Hours. <span className="text-gradient-gold">Infinite Possibilities.</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Future Innovation Lab: 24 continuous hours of non-stop software and hardware engineering, industry jury mentorship, and cash rewards at Aalim Muhammed Salegh CoE.
            </p>

            {/* Countdown Cards */}
            <div className="pt-2 max-w-lg mx-auto lg:mx-0">
              <p className="text-xs uppercase font-bold tracking-widest text-teal-400 mb-3 flex items-center justify-center lg:justify-start gap-2 font-['Space_Grotesk']">
                <FiClock className="text-teal-400" />
                Hackathon Launch Countdown (22 Aug 2026 9:00 AM)
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HOURS", value: timeLeft.hours },
                  { label: "MINUTES", value: timeLeft.minutes },
                  { label: "SECONDS", value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#13273F]/90 border border-white/10 text-center shadow-lg"
                  >
                    <span className="block text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                      {item.value}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-extrabold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                Register Now
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/portal"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#13273F] border border-white/10 hover:border-teal-400/40 text-white font-bold font-['Space_Grotesk'] text-sm tracking-wider hover:bg-[#10263B] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Student Portal
              </Link>

              <a
                href="#tracks"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold font-['Space_Grotesk'] text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiLayers className="text-teal-400" />
                Tracks
              </a>
            </div>
          </motion.div>

          {/* Right 3D Innovation Core Scene (Right 5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <div className="w-full max-w-md relative">
              <HeroThreeScene />
              <div className="text-center mt-2">
                <span className="text-[11px] font-medium text-slate-400 tracking-wider font-['Space_Grotesk']">
                  Interactive 3D Innovation Core
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Quick Stats Grid Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#13273F]/90 border border-white/10 hover:border-blue-500/30 flex flex-col items-start space-y-3 shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
              >
                <div className={`p-2.5 rounded-xl border ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-bold text-base font-['Space_Grotesk'] group-hover:text-blue-400 transition-colors">
                    {stat.title}
                  </h4>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{stat.subtitle}</p>
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
