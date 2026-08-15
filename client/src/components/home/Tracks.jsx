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
  FiZap,
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
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30 hover:border-cyan-400",
    description: "Build deep learning, NLP, computer vision models, or autonomous AI agents solving high-impact problems.",
    details: "Focus on LLM applications, predictive analytics, intelligent visual inspection, multi-modal synthesis, and edge AI deployment.",
  },
  {
    id: 2,
    title: "Cyber Security",
    icon: FiShield,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30 hover:border-purple-400",
    description: "Architect zero-trust solutions, threat intelligence systems, blockchain security, and cryptographic safeguards.",
    details: "Build automated penetration testing tools, malware analysis engines, decentralized identity protocols, and secure enclave systems.",
  },
  {
    id: 3,
    title: "Healthcare",
    icon: FiActivity,
    gradient: "from-rose-500 to-pink-600",
    border: "border-rose-500/30 hover:border-rose-400",
    description: "Develop smart diagnostics, telemedicine platforms, medical IoT devices, and patient care monitoring systems.",
    details: "Innovate in early disease detection, genomic data processing, remote patient telemetry, and hospital workflow automation.",
  },
  {
    id: 4,
    title: "Agriculture",
    icon: FiSun,
    gradient: "from-emerald-400 to-green-600",
    border: "border-emerald-500/30 hover:border-emerald-400",
    description: "Design precision farming tools, crop health analytics, automated irrigation, and farm-to-table supply chains.",
    details: "Create IoT soil sensors, drone-based imagery analysis, yield forecasting algorithms, and direct farmer marketplace platforms.",
  },
  {
    id: 5,
    title: "Smart Education",
    icon: FiBookOpen,
    gradient: "from-amber-400 to-yellow-600",
    border: "border-amber-500/30 hover:border-amber-400",
    description: "Revolutionize learning with adaptive AI tutors, gamified STEM platforms, and inclusive accessibility tech.",
    details: "Build personalized learning pathways, automated grading systems, VR/AR lab simulators, and multilingual learning tools.",
  },
  {
    id: 6,
    title: "Smart Mobility",
    icon: FiTruck,
    gradient: "from-blue-500 to-teal-500",
    border: "border-blue-500/30 hover:border-blue-400",
    description: "Pioneer EV battery telemetry, intelligent traffic management, autonomous logistics, and transit routing.",
    details: "Target urban congestion algorithms, smart parking networks, fleet tracking dashboards, and EV charging station aggregators.",
  },
  {
    id: 7,
    title: "Smart Automation",
    icon: FiSettings,
    gradient: "from-violet-500 to-purple-600",
    border: "border-violet-500/30 hover:border-violet-400",
    description: "Create industrial robotics controls, smart home IoT hubs, micro-controller firmware, and automated workflows.",
    details: "Combine hardware sensor arrays with real-time SCADA dashboards, predictive maintenance, and robotic process automation.",
  },
  {
    id: 8,
    title: "FinTech",
    icon: FiDollarSign,
    gradient: "from-yellow-400 to-amber-600",
    border: "border-yellow-500/30 hover:border-yellow-400",
    description: "Build micro-finance platforms, fraud detection neural networks, decentralized finance, and smart billing.",
    details: "Innovate in algorithmic credit scoring, cross-border payment gateways, automated bookkeeping for SMEs, and anti-money laundering tools.",
  },
  {
    id: 9,
    title: "Sustainability",
    icon: FiGlobe,
    gradient: "from-teal-400 to-emerald-600",
    border: "border-teal-500/30 hover:border-teal-400",
    description: "Innovate carbon footprint tracking, renewable energy grid optimization, and smart waste management systems.",
    details: "Focus on circular economy platforms, plastic recycling tracking, smart water conservation networks, and green building telemetry.",
  },
  {
    id: 10,
    title: "Disaster Management",
    icon: FiAlertTriangle,
    gradient: "from-red-500 to-amber-600",
    border: "border-red-500/30 hover:border-red-400",
    description: "Develop early warning systems, emergency response mesh networks, and flood/fire evacuation mapping tools.",
    details: "Build satellite imagery damage assessors, offline emergency mesh communication nodes, and community relief coordination apps.",
  },
    {
    id: 11,
    title: "Quantum Computing",
    icon: FiZap,
    gradient: "from-indigo-500 to-cyan-500",
    border: "border-indigo-500/30 hover:border-indigo-400",
    description: "Build quantum algorithms, Qiskit/Cirq circuit simulators, post-quantum cryptography, and hybrid quantum-classical solvers.",
    details: "Develop variational quantum eigensolvers (VQE), quantum key distribution (QKD) simulators, QAOA optimization for logistics, and quantum machine learning (QML) models.",
  },
  {
    id: 12,
    title: "Open Innovation",
    icon: FiFolderPlus,
    gradient: "from-fuchsia-500 to-purple-600",
    border: "border-fuchsia-500/30 hover:border-fuchsia-400",
    description: "Unleash wild, unconventional ideas combining software and hardware that don't fit traditional boundaries.",
    details: "Anything groundbreaking! Web3, Quantum computing simulators, metaverse tools, creative arts tech, or multi-disciplinary inventions.",
  },
];

function Tracks() {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <section id="tracks" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
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
            Choose Your <span className="text-gradient-cyan-purple">Battleground</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light"
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => setSelectedTrack(track)}
                className={`glass-card p-6 rounded-3xl border ${track.border} flex flex-col justify-between cursor-pointer relative group transition-all duration-300 shadow-xl hover:shadow-2xl`}
              >
                {/* Dynamic Ambient Hover Glow behind card */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${track.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                />

                {/* Top Glowing Accent Line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${track.gradient} opacity-80 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${track.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-cyan-300 tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-500/40 transition-colors">
                      Track #{track.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light line-clamp-3 group-hover:text-gray-200 transition-colors">
                    {track.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors relative z-10">
                  <span>View Details & Specs</span>
                  <FiArrowRight className="text-cyan-400 group-hover:translate-x-2 group-hover:text-white transition-all duration-300 text-sm" />
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
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`glass-card max-w-xl w-full p-8 rounded-3xl border ${selectedTrack.border} relative overflow-hidden shadow-2xl space-y-6`}
              >
                <button
                  onClick={() => setSelectedTrack(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>

                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${selectedTrack.gradient} text-white shadow-xl`}
                  >
                    {<selectedTrack.icon size={32} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                      Track #{selectedTrack.id}
                    </span>
                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                      {selectedTrack.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/10 pt-4">
                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">
                    Overview
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedTrack.description}
                  </p>

                  <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider pt-2">
                    Key Focus Areas & Hardware/Software Scope
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedTrack.details}
                  </p>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-xs text-gray-300">
                    <FiCheckCircle className="text-cyan-400 text-lg flex-shrink-0" />
                    <span>Eligible for Software & Hardware submissions. Winners in this track qualify for trophy + cash rewards.</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedTrack(null)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                  >
                    Close Track Spec
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
