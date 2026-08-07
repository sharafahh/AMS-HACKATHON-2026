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
    description: "Online team registration begins. Submit team details, select track, and reserve slot.",
  },
  {
    phase: "Phase 02",
    title: "Registration Closes",
    date: "12 August 2026",
    time: "11:59 PM IST",
    icon: FiUserCheck,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30 hover:border-purple-400",
    description: "Strict deadline for online registration and fee payment completion.",
  },
  {
    phase: "Phase 03",
    title: "Hackathon Starts",
    date: "22 August 2026",
    time: "09:00 AM IST",
    icon: FiPlay,
    gradient: "from-emerald-400 to-teal-600",
    border: "border-emerald-500/30 hover:border-emerald-400",
    description: "Opening Ceremony at campus. 24-hour non-stop countdown clock starts!",
  },
  {
    phase: "Phase 04",
    title: "Mentoring",
    date: "22 August 2026",
    time: "04:00 PM IST",
    icon: FiUsers,
    gradient: "from-amber-400 to-yellow-600",
    border: "border-amber-500/30 hover:border-amber-400",
    description: "Industry experts and professors review prototypes and refine pitches.",
  },
  {
    phase: "Phase 05",
    title: "Evaluation",
    date: "23 August 2026",
    time: "08:00 AM IST",
    icon: FiCheckSquare,
    gradient: "from-rose-500 to-pink-600",
    border: "border-rose-500/30 hover:border-rose-400",
    description: "24-hour sprint ends. Teams present live software/hardware demos to jury.",
  },
  {
    phase: "Phase 06",
    title: "Winner Announcement",
    date: "23 August 2026",
    time: "11:00 AM IST",
    icon: FiAward,
    gradient: "from-yellow-400 to-amber-500",
    border: "border-yellow-500/30 hover:border-yellow-400",
    description: "Grand Valedictory Ceremony. Distribution of ₹25,500 prizes & trophies.",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

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

        {/* Horizontal Timeline Container */}
        <div className="relative pt-6">
          {/* Horizontal Glowing Connection Bar (Desktop) */}
          <div className="hidden xl:block absolute top-[2.2rem] left-12 right-12 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 via-emerald-500 via-amber-500 to-yellow-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] z-0" />

          {/* 6-Column Grid for Desktop / Flex for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`glass-card p-5 rounded-3xl border ${event.border} flex flex-col justify-between relative group overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer`}
                >
                  {/* Dynamic Ambient Hover Glow behind card */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${event.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                  />

                  {/* Top Glowing Accent Line */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${event.gradient} opacity-80 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                  />

                  <div className="space-y-4 relative z-10">
                    {/* Header Node Icon */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${event.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                        {event.phase}
                      </span>
                    </div>

                    {/* Time & Title */}
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">
                        ⏱️ {event.time}
                      </span>
                      <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1 group-hover:text-gray-300 transition-colors">
                        📅 {event.date}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs font-light leading-relaxed group-hover:text-white transition-colors">
                      {event.description}
                    </p>
                  </div>

                  {/* Step Connector Indicator */}
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-semibold text-gray-400 group-hover:text-cyan-300 transition-colors relative z-10">
                    <span>Step 0{index + 1} of 06</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 animate-pulse transition-transform" />
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
