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
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  {
    icon: FiWifi,
    title: "High-Speed Wi-Fi",
    description: "High-bandwidth dedicated gigabit Wi-Fi network ensuring fast package downloads, API calls, and deployment.",
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
  },
  {
    icon: FiHome,
    title: "In-Campus Accommodation",
    description: "Safe, secure, and comfortable accommodation will be provided inside the college campus for all registered participants during the entire 24-hour hackathon.",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    icon: FiCoffee,
    title: "Refreshments (Tea & Snacks)",
    description: "Refreshments (tea and snacks) will be provided for all participants during the hackathon.",
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/30",
  },
  {
    icon: FiZap,
    title: "Extension Box",
    description: "Important: Teams must bring their own extension boxes / power strips for their laptop setups.",
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/30",
  },
  {
    icon: FiUsers,
    title: "Industry Mentors",
    description: "1-on-1 access to senior developers, cloud architects, and hardware engineers during building sprints.",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    icon: FiCheckCircle,
    title: "Internal & External Jury",
    description: "Both internal faculty experts and external industry leaders will be evaluating all projects and prototypes.",
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  },
  {
    icon: FiAward,
    title: "Participation Certificate",
    description: "Only physical certificates will be provided for participants on spot upon evaluation.",
    accent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  },
];

function Facilities() {
  return (
    <section id="facilities" className="py-24 relative bg-[#07121F] bg-lab-mesh overflow-hidden">
      {/* Ambient Lights */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
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
            OUR <span className="text-gradient-tech-blue">Hackathon Facilities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg font-light"
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
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 flex flex-col justify-between relative group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:border-blue-500/40 cursor-pointer"
              >
                <div className="space-y-4 relative z-10">
                  <div className={`p-3 w-fit rounded-xl border ${item.accent} group-hover:scale-105 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>

                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-400 font-semibold group-hover:text-teal-400 transition-colors relative z-10">
                  <span>Included / Guideline</span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 transition-transform" />
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
