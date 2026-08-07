import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu,
  FiShield,
  FiActivity,
  FiSun,
  FiBookOpen,
  FiTruck,
  FiSettings,
  FiDollarSign,
  FiGlobe,
  FiAlertTriangle,
  FiNavigation,
  FiFolderPlus,
  FiX,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const tracksData = [
  {
    id: 1,
    title: "AI & Machine Learning",
    icon: FiCpu,
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    description: "Build deep learning, NLP, computer vision models, or autonomous AI agents solving high-impact problems.",
    details: "Focus on LLM applications, predictive analytics, intelligent visual inspection, multi-modal synthesis, and edge AI deployment.",
  },
  {
    id: 2,
    title: "Cyber Security",
    icon: FiShield,
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    description: "Architect zero-trust solutions, threat intelligence systems, blockchain security, and cryptographic safeguards.",
    details: "Build automated penetration testing tools, malware analysis engines, decentralized identity protocols, and secure enclave systems.",
  },
  {
    id: 3,
    title: "Healthcare",
    icon: FiActivity,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    description: "Develop smart diagnostics, telemedicine platforms, medical IoT devices, and patient care monitoring systems.",
    details: "Innovate in early disease detection, genomic data processing, remote patient telemetry, and hospital workflow automation.",
  },
  {
    id: 4,
    title: "Agriculture",
    icon: FiSun,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    description: "Design precision farming tools, crop health analytics, automated irrigation, and farm-to-table supply chains.",
    details: "Create IoT soil sensors, drone-based imagery analysis, yield forecasting algorithms, and direct farmer marketplace platforms.",
  },
  {
    id: 5,
    title: "Smart Education",
    icon: FiBookOpen,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    description: "Revolutionize learning with adaptive AI tutors, gamified STEM platforms, and inclusive accessibility tech.",
    details: "Build personalized learning pathways, automated grading systems, VR/AR lab simulators, and multilingual learning tools.",
  },
  {
    id: 6,
    title: "Smart Mobility",
    icon: FiTruck,
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    description: "Pioneer EV battery telemetry, intelligent traffic management, autonomous logistics, and transit routing.",
    details: "Target urban congestion algorithms, smart parking networks, fleet tracking dashboards, and EV charging station aggregators.",
  },
  {
    id: 7,
    title: "Smart Automation",
    icon: FiSettings,
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    description: "Create industrial robotics controls, smart home IoT hubs, micro-controller firmware, and automated workflows.",
    details: "Combine hardware sensor arrays with real-time SCADA dashboards, predictive maintenance, and robotic process automation.",
  },
  {
    id: 8,
    title: "FinTech",
    icon: FiDollarSign,
    accent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    description: "Build micro-finance platforms, fraud detection neural networks, decentralized finance, and smart billing.",
    details: "Innovate in algorithmic credit scoring, cross-border payment gateways, automated bookkeeping for SMEs, and anti-money laundering tools.",
  },
  {
    id: 9,
    title: "Sustainability",
    icon: FiGlobe,
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    description: "Innovate carbon footprint tracking, renewable energy grid optimization, and smart waste management systems.",
    details: "Focus on circular economy platforms, plastic recycling tracking, smart water conservation networks, and green building telemetry.",
  },
  {
    id: 10,
    title: "Disaster Management",
    icon: FiAlertTriangle,
    accent: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    description: "Develop early warning systems, emergency response mesh networks, and flood/fire evacuation mapping tools.",
    details: "Build satellite imagery damage assessors, offline emergency mesh communication nodes, and community relief coordination apps.",
  },
  {
    id: 11,
    title: "Space Technology",
    icon: FiNavigation,
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    description: "Explore satellite data processing, CubeSat telemetry simulators, space debris tracking, and astrophysics tools.",
    details: "Create orbit determination models, atmospheric payload sensors, ground station control software, and astronomical data visualization.",
  },
  {
    id: 12,
    title: "Open Innovation",
    icon: FiFolderPlus,
    accent: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
    description: "Unleash wild, unconventional ideas combining software and hardware that don't fit traditional boundaries.",
    details: "Anything groundbreaking! Web3, Quantum computing simulators, metaverse tools, creative arts tech, or multi-disciplinary inventions.",
  },
];

function Tracks() {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <section id="tracks" className="py-24 relative bg-[#07121F] bg-lab-mesh overflow-hidden">
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
          >
            12 Innovation Domains
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            Choose Your <span className="text-gradient-tech-blue">Battleground</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg font-light"
          >
            Inspired by Smart India Hackathon problem statements. Select a track that aligns with your passion and build revolutionary solutions.
          </motion.p>
        </div>

        {/* 12 Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracksData.map((track, index) => {
            const Icon = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => setSelectedTrack(track)}
                className="p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 flex flex-col justify-between cursor-pointer relative group transition-all duration-300 shadow-lg hover:shadow-xl hover:border-blue-500/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl border ${track.accent} group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      Track #{track.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-blue-400 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
                    {track.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-teal-400 transition-colors">
                  <span>View Specs</span>
                  <FiArrowRight className="group-hover:translate-x-1.5 transition-transform text-sm" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Track Specs */}
        <AnimatePresence>
          {selectedTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrack(null)}
              className="fixed inset-0 z-50 bg-[#07121F]/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-xl w-full p-8 rounded-2xl bg-[#10263B] border border-white/10 relative overflow-hidden shadow-2xl space-y-6"
              >
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>

                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl border ${selectedTrack.accent}`}>
                    {<selectedTrack.icon size={28} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 tracking-wider uppercase font-['Space_Grotesk']">
                      Track #{selectedTrack.id}
                    </span>
                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                      {selectedTrack.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-['Space_Grotesk']">
                    Overview
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {selectedTrack.description}
                  </p>

                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-['Space_Grotesk'] pt-2">
                    Key Focus Areas & Hardware/Software Scope
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    {selectedTrack.details}
                  </p>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 text-xs text-slate-300">
                    <FiCheckCircle className="text-teal-400 text-lg flex-shrink-0" />
                    <span>Eligible for Software & Hardware submissions. Winners qualify for trophies + cash rewards.</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedTrack(null)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                  >
                    Close Specs
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Tracks;
