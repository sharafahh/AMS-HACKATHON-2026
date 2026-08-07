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
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    description: "Online team registration begins. Submit team details, select track, and reserve slot.",
  },
  {
    phase: "Phase 02",
    title: "Registration Closes",
    date: "12 August 2026",
    time: "11:59 PM IST",
    icon: FiUserCheck,
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    description: "Strict deadline for online registration and fee payment completion.",
  },
  {
    phase: "Phase 03",
    title: "Hackathon Starts",
    date: "22 August 2026",
    time: "09:00 AM IST",
    icon: FiPlay,
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    description: "Opening Ceremony at campus. 24-hour non-stop countdown clock starts!",
  },
  {
    phase: "Phase 04",
    title: "Mentoring",
    date: "22 August 2026",
    time: "04:00 PM IST",
    icon: FiUsers,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    description: "Industry experts and professors review prototypes and refine pitches.",
  },
  {
    phase: "Phase 05",
    title: "Evaluation",
    date: "23 August 2026",
    time: "08:00 AM IST",
    icon: FiCheckSquare,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    description: "24-hour sprint ends. Teams present live software/hardware demos to jury.",
  },
  {
    phase: "Phase 06",
    title: "Winner Announcement",
    date: "23 August 2026",
    time: "11:00 AM IST",
    icon: FiAward,
    accent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    description: "Grand Valedictory Ceremony. Distribution of ₹25,500 prizes & trophies.",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="py-24 relative bg-[#07121F] bg-lab-mesh overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
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
            24-Hour <span className="text-gradient-tech-blue">Execution Schedule</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg font-light"
          >
            Key milestones from registration launch to the valedictory award ceremony.
          </motion.p>
        </div>

        {/* Horizontal Timeline Container */}
        <div className="relative pt-6">
          {/* Horizontal Connection Bar (Desktop) */}
          <div className="hidden xl:block absolute top-[2.2rem] left-12 right-12 h-0.5 bg-gradient-to-r from-blue-500 via-teal-400 via-indigo-500 to-amber-400 rounded-full z-0 opacity-60" />

          {/* 6-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 relative z-10">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-5 rounded-2xl bg-[#13273F]/90 border border-white/10 flex flex-col justify-between relative group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:border-blue-500/40 cursor-pointer"
                >
                  <div className="space-y-4 relative z-10">
                    {/* Header Node Icon */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${event.accent} group-hover:scale-105 transition-transform duration-300`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-extrabold tracking-widest text-blue-400 uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-['Space_Grotesk']">
                        {event.phase}
                      </span>
                    </div>

                    {/* Time & Title */}
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 block mb-1">
                        ⏱️ {event.time}
                      </span>
                      <h3 className="text-base font-bold font-['Space_Grotesk'] text-white group-hover:text-blue-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        📅 {event.date}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Step Connector Indicator */}
                  <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-teal-400 transition-colors relative z-10">
                    <span>Step 0{index + 1} of 06</span>
                    <span className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 transition-transform" />
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
