import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiEye,
  FiCompass,
  FiZap,
  FiTrendingUp,
  FiCpu,
  FiCheckCircle,
} from "react-icons/fi";

const aboutPillars = [
  {
    id: "mission",
    title: "Our Mission",
    icon: FiTarget,
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30",
    description:
      "To foster a culture of rapid innovation, creative problem solving, and interdisciplinary collaboration among engineering students nationwide. HACKVERSE 2026 bridges academia and industry through hands-on technical creation.",
    points: [
      "Empower students with real-world problem statements inspired by Smart India Hackathon.",
      "Promote hardware-software synthesis to solve pressing national issues.",
      "Cultivate entrepreneurial mindsets and prototype readiness.",
    ],
  },
  {
    id: "vision",
    title: "Our Vision",
    icon: FiEye,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30",
    description:
      "To establish Aalim Muhammed Salegh College of Engineering as a premier epicenter for tech talent, where futuristic ideas evolve into impactful enterprise solutions and social innovations.",
    points: [
      "Building a sustainable national network of student developers and mentors.",
      "Recognizing breakthrough innovations in AI, IoT, FinTech, and Green Tech.",
      "Directing student projects toward incubation and patent assistance.",
    ],
  },
  {
    id: "objectives",
    title: "Core Objectives",
    icon: FiCompass,
    gradient: "from-amber-500 to-orange-600",
    border: "border-amber-500/30",
    description:
      "Provide a high-intensity 24-hour hackathon environment featuring expert guidance, industry evaluation, and state-of-the-art infrastructure for participant success.",
    points: [
      "24 hours of uninterrupted build sprint with 100% power and high-speed Wi-Fi.",
      "1-on-1 expert mentor round tables from leading tech industries.",
      "Fair and rigorous evaluation by experienced academic and corporate juries.",
    ],
  },
  {
    id: "why",
    title: "Why Participate?",
    icon: FiZap,
    gradient: "from-emerald-400 to-teal-600",
    border: "border-emerald-500/30",
    description:
      "HACKVERSE 2026 is more than a contest; it is a launchpad. Connect with like-minded coders, test your limits under pressure, and take home attractive cash rewards.",
    points: [
      "Win from a total prize pool of ₹25,500 + certificates.",
      "Gain direct visibility with potential employers and incubator programs.",
      "Complimentary meals, refreshments, energy drinks, and hardware lab access.",
    ],
  },
  {
    id: "impact",
    title: "National Impact",
    icon: FiTrendingUp,
    gradient: "from-pink-500 to-rose-600",
    border: "border-pink-500/30",
    description:
      "Focusing on themes critical to Smart Mobility, Healthcare, Disaster Management, and Space Technology to create tangible solutions for society.",
    points: [
      "Directly addresses United Nations Sustainable Development Goals.",
      "Helps bridge urban-rural digital divides through smart automation.",
      "Encourages open source contributions and patent-worthy intellectual property.",
    ],
  },
  {
    id: "innovation",
    title: "Cutting-Edge Innovation",
    icon: FiCpu,
    gradient: "from-cyan-400 to-emerald-500",
    border: "border-cyan-400/30",
    description:
      "Whether developing LLM agents, cyber defense platforms, or embedded IoT systems, HACKVERSE provides the ultimate canvas for your technological mastery.",
    points: [
      "Dedicated hardware track for robotics, microcontrollers, and sensor kits.",
      "Software track for web3, AI/ML, cloud-native apps, and mobile tech.",
      "Open track for out-of-the-box revolutionary inventions.",
    ],
  },
];

function About() {
  const [activePillar, setActivePillar] = useState(aboutPillars[0]);

  return (
    <section id="about" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
          >
            About Hackverse 2026
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            Where Next-Gen Innovators <span className="text-gradient-cyan-purple">Collide</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light leading-relaxed"
          >
            Organized by Aalim Muhammed Salegh College of Engineering, HACKVERSE 2026 is designed to push the boundaries of technical problem solving over 24 relentless hours.
          </motion.p>
        </div>

        {/* Pillars Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {aboutPillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar.id === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 border-2 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105"
                    : "glass-card text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-r ${pillar.gradient} text-white shadow-md`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold font-['Space_Grotesk'] tracking-wide">
                  {pillar.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Card Feature */}
        <motion.div
          key={activePillar.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`glass-card p-8 sm:p-12 rounded-3xl border ${activePillar.border} relative overflow-hidden shadow-2xl`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${activePillar.gradient} text-white shadow-xl`}
                >
                  {<activePillar.icon size={32} />}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                    {activePillar.title}
                  </h3>
                  <span className="text-xs text-cyan-400 font-medium tracking-wider uppercase">
                    HACKVERSE Pillar Overview
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed">
                {activePillar.description}
              </p>

              <div className="space-y-3 pt-2">
                {activePillar.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" size={18} />
                    <span className="text-gray-300 text-sm sm:text-base">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <FiZap className="text-amber-400" />
                Hackathon Highlights
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Event Format</span>
                  <span className="font-semibold text-white">24-Hour Non-Stop</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Eligibility</span>
                  <span className="font-semibold text-white">College Students Nationwide</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Team Size</span>
                  <span className="font-semibold text-white">3 to 6 Members</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Tracks Available</span>
                  <span className="font-semibold text-cyan-400">12 Specialized Tracks</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Prize Pool</span>
                  <span className="font-bold text-amber-400">₹25,500 Cash + Certificates</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
