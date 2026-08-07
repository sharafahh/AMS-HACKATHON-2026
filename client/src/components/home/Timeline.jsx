import { motion } from "framer-motion";
import {
  FiCalendar,
  FiUserCheck,
  FiPlay,
  FiUsers,
  FiCheckSquare,
  FiAward,
} from "react-icons/fi";

const timelineEvents = [
  {
    phase: "Phase 01",
    title: "Registration Opens",
    date: "1 August 2026",
    time: "09:00 AM IST",
    icon: FiCalendar,
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30 hover:border-cyan-400",
    status: "Active",
    description: "Online team registration begins. Submit team details, select innovation track, and reserve your slot.",
  },
  {
    phase: "Phase 02",
    title: "Registration Closes",
    date: "12 August 2026",
    time: "11:59 PM IST",
    icon: FiUserCheck,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30 hover:border-purple-400",
    status: "Upcoming",
    description: "Strict deadline for online registration and payment completion.",
  },
  {
    phase: "Phase 03",
    title: "Hackathon Starts",
    date: "22 August 2026",
    time: "09:00 AM IST",
    icon: FiPlay,
    gradient: "from-emerald-400 to-teal-600",
    border: "border-emerald-500/30 hover:border-emerald-400",
    status: "Highlight",
    description: "Opening Ceremony at Aalim Muhammed Salegh CoE campus. 24-hour non-stop countdown clock starts!",
  },
  {
    phase: "Phase 04",
    title: "Mentoring",
    date: "22 August 2026",
    time: "04:00 PM IST",
    icon: FiUsers,
    gradient: "from-amber-400 to-yellow-600",
    border: "border-amber-500/30 hover:border-amber-400",
    status: "Upcoming",
    description: "Industry experts and professors review prototype progress, provide architectural feedback, and refine pitches.",
  },
  {
    phase: "Phase 05",
    title: "Evaluation",
    date: "23 August 2026",
    time: "08:00 AM IST",
    icon: FiCheckSquare,
    gradient: "from-rose-500 to-pink-600",
    border: "border-rose-500/30 hover:border-rose-400",
    status: "Upcoming",
    description: "24-hour coding sprint ends. Teams present live hardware/software demonstrations to jury panels.",
  },
  {
    phase: "Phase 06",
    title: "Winner Announcement",
    date: "23 August 2026",
    time: "11:00 AM IST",
    icon: FiAward,
    gradient: "from-yellow-400 to-amber-500",
    border: "border-yellow-500/30 hover:border-yellow-400",
    status: "Upcoming",
    description: "Grand Valedictory Ceremony. Distribution of ₹25,500 prize money, trophies, and participation certificates.",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
          >
            Event Roadmap
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            24-Hour <span className="text-gradient-cyan-purple">Execution Schedule</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light"
          >
            Key milestones from registration launch to the valedictory award ceremony.
          </motion.p>
        </div>

        {/* Compact Vertical Connected Timeline (max-w-2xl) */}
        <div className="relative max-w-2xl mx-auto">
          {/* Central Glowing Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500 -translate-x-1/2 shadow-[0_0_12px_rgba(6,182,212,0.5)]" />

          <div className="space-y-10 relative">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  } gap-6 relative group`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-0 z-20 flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${event.gradient} text-white flex items-center justify-center shadow-lg border-4 border-[#050816] group-hover:scale-125 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  {/* Compact Content Card */}
                  <div className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${isEven ? "sm:text-right" : "sm:text-left"}`}>
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`glass-card p-5 rounded-3xl border ${event.border} relative overflow-hidden space-y-2.5 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                    >
                      {/* Dynamic Ambient Hover Glow behind card */}
                      <div
                        className={`absolute -inset-1 bg-gradient-to-r ${event.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                      />

                      {/* Top Glowing Accent Line */}
                      <div
                        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${event.gradient} opacity-80 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                      />

                      <div className={`flex items-center gap-2 ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                        <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                          {event.phase}
                        </span>
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          {event.time}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                        📅 {event.date}
                      </p>

                      <p className="text-gray-300 text-xs font-light leading-relaxed group-hover:text-white transition-colors">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
