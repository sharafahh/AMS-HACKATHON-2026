import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiClock, FiLayers, FiAward, FiUsers, FiFileText } from "react-icons/fi";

const statsData = [
  {
    icon: FiClock,
    target: 24,
    prefix: "",
    suffix: " Hours",
    label: "Non-Stop Hackathon",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: FiLayers,
    target: 12,
    prefix: "",
    suffix: " Tracks",
    label: "Innovation Domains",
    accent: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: FiAward,
    target: 25500,
    prefix: "₹",
    suffix: "",
    label: "Total Prize Pool",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: FiUsers,
    target: 4,
    prefix: "",
    suffix: " Podium",
    label: "Winning Teams",
    accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: FiFileText,
    target: 100,
    prefix: "",
    suffix: "%",
    label: "Participation Certificate",
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
];

function CounterItem({ stat }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const increment = Math.ceil(stat.target / (duration / 30));
    const timer = setInterval(() => {
      start += increment;
      if (start >= stat.target) {
        setCount(stat.target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isInView, stat.target]);

  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 text-center relative overflow-hidden group shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-center mb-4">
        <div className={`p-3.5 rounded-xl border ${stat.accent} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-2">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </div>

      <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  );
}

function Stats() {
  return (
    <section id="stats" className="py-20 relative bg-[#07121F] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']">
            Hackathon Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white mt-3">
            AMS HACKATHON 2026 By The <span className="text-gradient-tech-blue">Numbers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsData.map((stat, idx) => (
            <CounterItem key={idx} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
