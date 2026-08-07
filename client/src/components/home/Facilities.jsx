import { motion } from "framer-motion";
import {
  FiClock,
  FiWifi,
  FiCoffee,
  FiZap,
  FiUsers,
  FiAward,
  FiHome,
  FiCheckCircle,
} from "react-icons/fi";

const facilities = [
  {
    icon: FiClock,
    title: "24-Hour Coding Facility",
    description: "Air-conditioned labs, ergonomic seating, and uninterrupted 24-hour campus access for night-long coding.",
    gradient: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/30 hover:border-cyan-400",
  },
  {
    icon: FiWifi,
    title: "High-Speed Wi-Fi",
    description: "High-bandwidth dedicated gigabit Wi-Fi network ensuring fast package downloads, API calls, and deployment.",
    gradient: "from-purple-500 to-indigo-600",
    border: "border-purple-500/30 hover:border-purple-400",
  },
  {
    icon: FiHome,
    title: "In-Campus Accommodation",
    description: "Safe, secure, and comfortable accommodation will be provided inside the college campus for all registered participants during the entire 24-hour hackathon. Participants will remain within the college campus for the entire duration of the event.",
    gradient: "from-amber-400 to-orange-500",
    border: "border-amber-500/30 hover:border-amber-400",
  },
  {
    icon: FiCoffee,
    title: "Refreshments (Tea & Snacks)",
    description: "Refreshments (tea and snacks) will be provided for all participants during the hackathon.",
    gradient: "from-emerald-400 to-teal-600",
    border: "border-emerald-500/30 hover:border-emerald-400",
  },
  {
    icon: FiZap,
    title: "Extension Box",
    description: "Important: Teams must bring their own extension boxes / power strips for their laptop setups.",
    gradient: "from-rose-500 to-pink-600",
    border: "border-rose-500/30 hover:border-rose-400",
  },
  {
    icon: FiUsers,
    title: "Industry Mentors",
    description: "1-on-1 access to senior developers, cloud architects, and hardware engineers during building sprints.",
    gradient: "from-violet-500 to-purple-600",
    border: "border-violet-500/30 hover:border-violet-400",
  },
  {
    icon: FiCheckCircle,
    title: "Internal & External Jury",
    description: "Both internal faculty experts and external industry leaders will be evaluating all projects and prototypes.",
    gradient: "from-blue-400 to-cyan-500",
    border: "border-blue-500/30 hover:border-blue-400",
  },
  {
    icon: FiAward,
    title: "Participation Certificate",
    description: "Only physical certificates will be provided for participants on spot upon evaluation.",
    gradient: "from-yellow-400 to-amber-500",
    border: "border-yellow-500/30 hover:border-yellow-400",
  },
];

function Facilities() {
  return (
    <section id="facilities" className="py-24 relative bg-[#050816] bg-cyber-grid overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
          >
            Campus Infrastructure & Guidelines
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            OUR <span className="text-gradient-cyan-purple">Hackathon Facilities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light"
          >
            Essential guidelines: In-campus accommodation provided, refreshments (tea and snacks) provided. Bring your own extension boxes!
          </motion.p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className={`glass-card p-6 rounded-3xl border ${item.border} flex flex-col justify-between relative group overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer`}
              >
                {/* Dynamic Ambient Hover Glow behind card */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
                />

                {/* Top Glowing Accent Line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient} opacity-80 group-hover:h-1.5 group-hover:opacity-100 transition-all duration-300`}
                />

                <div className="space-y-4 relative z-10">
                  <div
                    className={`p-3.5 w-fit rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed group-hover:text-gray-200 transition-colors">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors relative z-10">
                  <span>Included / Guideline</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Facilities;
