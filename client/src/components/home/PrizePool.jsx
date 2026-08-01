import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiStar, FiGift, FiShield, FiCoffee } from "react-icons/fi";

const prizes = [
  {
    rank: "1st Place",
    title: "First Prize",
    amount: "₹10,000",
    badge: "Champion Trophy + Certificate",
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    glow: "shadow-amber-500/30 border-amber-500/50",
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
    glow: "shadow-slate-400/30 border-slate-400/50",
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
    glow: "shadow-amber-700/30 border-amber-700/50",
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
    glow: "shadow-cyan-500/30 border-cyan-500/50",
    bgAccent: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    icon: "🏅",
  },
];

const perksList = [
  {
    title: "Digital Participation Certificate",
    desc: "Instantly verifiable digital credentials issued for all team members.",
    icon: FiCheckCircle,
  },
  {
    title: "Physical Certificate from College",
    desc: "Official printed certificate available at Aalim Muhammed Salegh College of Engineering.",
    icon: FiAward,
  },
  {
    title: "Complimentary Refreshments & Food",
    desc: "Full meals, snacks, and continuous beverages provided throughout the 24 hours.",
    icon: FiCoffee,
  },
  {
    title: "1-on-1 Expert Mentorship",
    desc: "Dedicated guidance from senior engineers and domain experts during coding sprints.",
    icon: FiStar,
  },
  {
    title: "National Networking",
    desc: "Connect with student developers, hiring partners, and academic innovators across India.",
    icon: FiShield,
  },
];

function PrizePool() {
  return (
    <section id="prizes" className="py-24 relative bg-[#050816] bg-cyber-grid overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk']"
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
            Compete for cash prizes, trophies, national recognition, and career-boosting certificates.
          </motion.p>
        </div>

        {/* Grand Total Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-14 p-8 sm:p-10 rounded-3xl glass-card border border-amber-500/40 relative overflow-hidden text-center shadow-2xl shadow-amber-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-cyan-500/10" />
          <div className="relative z-10 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              🏆 Total Hackathon Cash Pool
            </span>
            <div className="text-5xl sm:text-7xl font-black font-['Space_Grotesk'] text-gradient-gold drop-shadow-lg">
              ₹25,500
            </div>
            <p className="text-gray-300 text-sm sm:text-base font-light max-w-xl mx-auto">
              Distributed among top 4 winning teams alongside hardware innovation commendations and trophies.
            </p>
          </div>
        </motion.div>

        {/* 4 Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-card glass-card-hover p-6 rounded-3xl border ${prize.glow} relative flex flex-col justify-between overflow-hidden shadow-xl group`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${prize.gradient}`} />

              <div className="space-y-4 text-center">
                <div className="text-4xl mb-1">{prize.icon}</div>
                
                <span className={`inline-block text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${prize.bgAccent} ${prize.textColor}`}>
                  {prize.rank}
                </span>

                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  {prize.title}
                </h3>

                <div className={`text-4xl font-extrabold font-['Space_Grotesk'] ${prize.textColor}`}>
                  {prize.amount}
                </div>

                <p className="text-gray-300 text-xs font-medium border-t border-white/10 pt-3">
                  {prize.badge}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
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
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors"
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
