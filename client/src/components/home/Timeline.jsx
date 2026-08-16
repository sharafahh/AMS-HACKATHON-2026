import { motion } from "framer-motion";
import {
  FiUserCheck,
  FiCheckSquare,
  FiUsers,
  FiCode,
  FiStar,
  FiMonitor,
  FiAward,
} from "react-icons/fi";

const timelineEvents = [
  {
    phase: "Phase 01",
    title: "Offline Registration",
    date: "22 August 2026",
    time: "09:00 AM - 10:00 AM",
    icon: FiUserCheck,
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30 hover:border-cyan-400",
    description: "In-person check-in at the venue. Mark your attendance to secure your team's participation.",
  },
  {
    phase: "Phase 02",
    title: "Instructions & Selection",
    date: "22 August 2026",
    time: "10:30 AM",
    icon: FiCheckSquare,
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30 hover:border-purple-400",
    description: "Detailed hackathon instructions and final problem statement selection for the teams.",
  },
  {
    phase: "Phase 03",
    title: "Round 1 Evaluation",
    date: "22 August 2026",
    time: "12:00 PM - 01:00 PM",
    icon: FiUsers,
    gradient: "from-emerald-400 to-teal-600",
    border: "border-emerald-500/30 hover:border-emerald-400",
    description: "First evaluation round by Infosys Springboard, external experts, and internal jury.",
  },
  {
    phase: "Phase 04",
    title: "Round 2 Improvements",
    date: "22 August 2026",
    time: "03:00 PM - 06:00 PM",
    icon: FiCode,
    gradient: "from-amber-400 to-yellow-600",
    border: "border-amber-500/30 hover:border-amber-400",
    description: "Dedicated time for project improvements, incorporating feedback from the first round.",
  },
  {
    phase: "Phase 05",
    title: "Round 3 Qualifying",
    date: "22 August 2026",
    time: "09:00 PM - 11:00 PM",
    icon: FiStar,
    gradient: "from-rose-500 to-pink-600",
    border: "border-rose-500/30 hover:border-rose-400",
    description: "Crucial late-night qualifying round to evaluate progress and shortlist top teams.",
  },
  {
    phase: "Phase 06",
    title: "Final Round",
    date: "23 August 2026",
    time: "02:00 AM - 05:00 AM",
    icon: FiMonitor,
    gradient: "from-blue-400 to-cyan-500",
    border: "border-blue-500/30 hover:border-blue-400",
    description: "The ultimate coding sprint. Finalize prototypes and deploy solutions for the finale.",
  },
  {
    phase: "Phase 07",
    title: "Winner Announcement",
    date: "23 August 2026",
    time: "09:00 AM",
    icon: FiAward,
    gradient: "from-yellow-400 to-amber-500",
    border: "border-yellow-500/30 hover:border-yellow-400",
    description: "Grand Valedictory Ceremony. Winners will be announced and prizes distributed.",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="py-24 relative bg-[#050816] overflow-hidden">
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full origin-top bg-gradient-to-b from-cyan-400 via-purple-500 to-amber-400"
            />
          </div>

          <ol className="relative space-y-10 md:space-y-16">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isLeft = index % 2 === 0;

              return (
                <li key={event.phase} className="relative md:grid md:grid-cols-2 md:gap-16">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                    className="absolute left-6 md:left-1/2 top-6 z-20 -translate-x-1/2"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${event.gradient} text-white shadow-lg ring-4 ring-[#050816]`}
                    >
                      <Icon size={20} />
                    </span>
                    <span
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${event.gradient} blur-md opacity-50 -z-10`}
                    />
                  </motion.div>

                  <motion.article
                    initial={{ opacity: 0, x: isLeft ? -56 : 56, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    className={`glass-card relative ml-16 md:ml-0 p-5 sm:p-6 rounded-3xl border ${event.border} group overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 ${
                      isLeft ? "md:col-start-1" : "md:col-start-2"
                    }`}
                  >
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${event.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                    />
                    <div
                      className={`absolute top-0 ${isLeft ? "md:right-0 md:left-auto" : "left-0"} w-full h-1 bg-gradient-to-r ${event.gradient} opacity-80 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                    />

                    <div className={`flex items-center justify-between gap-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                      <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
                        {event.phase}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 group-hover:text-cyan-300 transition-colors">
                        Step {String(index + 1).padStart(2, "0")} of {String(timelineEvents.length).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <span className="text-[11px] font-bold text-amber-400 block">⏱️ {event.time}</span>
                      <h3 className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                        📅 {event.date}
                      </p>
                      <p className="text-gray-300 text-sm font-light leading-relaxed group-hover:text-white transition-colors">
                        {event.description}
                      </p>
                    </div>
                  </motion.article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
