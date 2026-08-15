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
    gradient: "from-cyan-400 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: FiLayers,
    target: 11,
    prefix: "",
    suffix: " Tracks",
    label: "Innovation Domains",
    gradient: "from-purple-400 to-indigo-600",
    glow: "shadow-purple-500/20",
  },
  {
    icon: FiAward,
    target: 25500,
    prefix: "₹",
    suffix: "",
    label: "Total Prize Pool",
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-amber-500/20",
  },
  {
    icon: FiUsers,
    target: 4,
    prefix: "",
    suffix: " Podium",
    label: "Winning Teams",
    gradient: "from-emerald-400 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: FiFileText,
    target: 100,
    prefix: "",
    suffix: "%",
    label: "Participation Certificate",
    gradient: "from-pink-400 to-rose-600",
    glow: "shadow-pink-500/20",
  },
];

function CounterItem({ stat }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // ms
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`glass-card glass-card-hover p-6 rounded-3xl border border-white/10 text-center relative overflow-hidden group shadow-xl ${stat.glow}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:w-full transition-all duration-500" />
      
      <div className="flex justify-center mb-4">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={26} />
        </div>
      </div>

      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-2">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </div>

      <p className="text-gray-400 text-sm font-medium tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  );
}

function Stats() {
  return (
    <section id="stats" className="py-20 relative bg-[#050816] bg-cyber-grid border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']">
            Hackathon Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white mt-3">
            AMS HACKATHON 2026 By The <span className="text-gradient-cyan-purple">Numbers</span>
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
