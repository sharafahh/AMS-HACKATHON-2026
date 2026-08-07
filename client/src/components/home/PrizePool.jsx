import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiStar, FiGift, FiShield, FiCoffee } from "react-icons/fi";

const prizes = [
  {
    rank: "1st Place",
    title: "First Prize",
    amount: "₹10,000",
    badge: "Champion Trophy + Certificate",
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    glow: "shadow-amber-500/30 border-amber-500/50 hover:border-amber-400",
    bgAccent: "bg-amber-500/10",
    textColor: "text-amber-400",
    icon: "🥇",
  },
  {
    rank: "2nd Place",
    title: "Second Prize",
    amount: "₹7,500",
    badge: "Runner-Up Trophy + Certificate",
    gradient: "from-slate-300 via-gray-400 to-slate-500",
    glow: "shadow-slate-400/30 border-slate-400/50 hover:border-slate-300",
    bgAccent: "bg-slate-400/10",
    textColor: "text-slate-300",
    icon: "🥈",
  },
  {
    rank: "3rd Place",
    title: "Third Prize",
    amount: "₹5,000",
    badge: "Second Runner-Up + Certificate",
    gradient: "from-amber-700 via-orange-600 to-amber-800",
    glow: "shadow-amber-700/30 border-amber-700/50 hover:border-amber-500",
    bgAccent: "bg-amber-700/10",
    textColor: "text-amber-600",
    icon: "🥉",
  },
  {
    rank: "4th Place",
    title: "Fourth Prize",
    amount: "₹3,000",
    badge: "Special Mention + Certificate",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "shadow-cyan-500/30 border-cyan-500/50 hover:border-cyan-400",
    bgAccent: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    icon: "🏅",
  },
];

const perksList = [
  {
    title: "Physical Participation Certificate",
    desc: "Every registered participant will receive an official Physical Participation Certificate, distributed at the venue after the successful completion of the hackathon.",
    icon: FiAward,
  },
  {
    title: "Refreshments (Tea & Snacks)",
    desc: "Refreshments (tea and snacks) will be provided to all participants at scheduled intervals throughout the 24-hour hackathon.",
    icon: FiCoffee,
  },
  {
    title: "1-on-1 Expert Mentorship",
    desc: "Dedicated guidance from senior engineers and domain experts during coding sprints.",
    icon: FiStar,
  },
  {
    title: "Campus & Internal Networking",
    desc: "Connect with student developers, hiring partners, and academic innovators across India.",
    icon: FiShield,
  },
];

function PrizePool() {
  return (
    <section id="prizes" className="py-24 relative bg-[#030611] overflow-hidden perspective-1000">
      {/* 3D Animated Background Layer (Exclusive for Prize Page) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* 3D Revolving Golden Ring */}
        <motion.div
          animate={{ rotate: 360, rotateX: [20, -20, 20], rotateY: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.15)] opacity-60"
        />

        <motion.div
          animate={{ rotate: -360, rotateX: [-15, 15, -15] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-dashed border-yellow-400/25 opacity-50"
        />

        {/* 3D Floating Gold & Cyan Spheres */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-15, 15, -15],
            rotate: [0, 180, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-12 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent blur-2xl"
        />

        <motion.div
          animate={{
            y: [25, -25, 25],
            x: [20, -20, 20],
            rotate: [360, 180, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-transparent blur-3xl"
        />

        {/* Dynamic Sweeping 3D Laser Light Beam */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-0 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm transform -rotate-12"
        />

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[170px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk'] shadow-lg"
          >
            <FiGift /> Rewards & Incentives
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white"
          >
            Prize Pool of <span className="text-gradient-gold">₹25,500</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg font-light"
          >
            Compete for cash prizes, trophies, internal recognition, and career-boosting certificates.
          </motion.p>
        </div>

        {/* Grand Total Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-14 p-8 sm:p-10 rounded-3xl glass-card border border-amber-500/40 relative overflow-hidden text-center shadow-2xl shadow-amber-500/15 group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-cyan-500/15 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 flex items-center justify-center gap-2">
              🏆 Total Hackathon Cash Pool
            </span>
            <div className="text-5xl sm:text-7xl font-black font-['Space_Grotesk'] text-gradient-gold drop-shadow-xl group-hover:scale-105 transition-transform duration-300">
              ₹25,500
            </div>
            <p className="text-gray-300 text-sm sm:text-base font-light max-w-xl mx-auto">
              Distributed among top 4 winning teams alongside hardware innovation commendations and trophies.
            </p>
          </div>
        </motion.div>

        {/* 4 Prize Cards Grid with 3D Hover & Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`glass-card p-6 rounded-3xl border ${prize.glow} relative flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl group transition-all duration-300 cursor-pointer`}
            >
              {/* Dynamic Ambient Hover Glow behind card */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${prize.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-35 transition-opacity duration-500 -z-10`}
              />

              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${prize.gradient} group-hover:h-2 transition-all duration-300`} />

              <div className="space-y-4 text-center relative z-10">
                <div className="text-4xl mb-1 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">{prize.icon}</div>
                
                <span className={`inline-block text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${prize.bgAccent} ${prize.textColor}`}>
                  {prize.rank}
                </span>

                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white group-hover:text-amber-300 transition-colors">
                  {prize.title}
                </h3>

                <div className={`text-4xl font-extrabold font-['Space_Grotesk'] ${prize.textColor} group-hover:scale-105 transition-transform duration-300`}>
                  {prize.amount}
                </div>

                <p className="text-gray-300 text-xs font-medium border-t border-white/10 pt-3 group-hover:text-white transition-colors">
                  {prize.badge}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-gray-400 group-hover:text-cyan-300 transition-colors relative z-10">
                <FiCheckCircle className={prize.textColor} />
                <span>Certificate Included</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Perks Checklist */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white text-center mb-8 flex items-center justify-center gap-2">
            <FiStar className="text-amber-400" />
            Every Participant Receives
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perksList.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/40 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm font-['Space_Grotesk'] mb-1">
                      {perk.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrizePool;
