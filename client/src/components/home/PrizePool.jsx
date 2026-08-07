import { motion } from "framer-motion";
import { FiAward, FiCheckCircle, FiStar, FiGift, FiShield, FiCoffee } from "react-icons/fi";

const prizes = [
  {
    rank: "1st Place",
    title: "First Prize",
    amount: "₹10,000",
    badge: "Champion Trophy + Certificate",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: "🥇",
  },
  {
    rank: "2nd Place",
    title: "Second Prize",
    amount: "₹7,500",
    badge: "Runner-Up Trophy + Certificate",
    accent: "text-slate-300 border-slate-400/30 bg-slate-400/10",
    icon: "🥈",
  },
  {
    rank: "3rd Place",
    title: "Third Prize",
    amount: "₹5,000",
    badge: "Second Runner-Up + Certificate",
    accent: "text-amber-600 border-amber-700/30 bg-amber-700/10",
    icon: "🥉",
  },
  {
    rank: "4th Place",
    title: "Fourth Prize",
    amount: "₹3,000",
    badge: "Special Mention + Certificate",
    accent: "text-teal-400 border-teal-500/30 bg-teal-500/10",
    icon: "🏅",
  },
];

const perksList = [
  {
    title: "Physical Participation Certificate",
    desc: "Every registered participant will receive an official Physical Participation Certificate, distributed at the venue after evaluation.",
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
    <section id="prizes" className="py-24 relative bg-[#07121F] overflow-hidden">
      {/* Soft Ambient Radial Background Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider font-['Space_Grotesk'] shadow-sm"
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
            className="text-slate-400 text-base sm:text-lg font-light"
          >
            Compete for cash prizes, trophies, internal recognition, and career-boosting certificates.
          </motion.p>
        </div>

        {/* Grand Total Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-14 p-8 sm:p-10 rounded-2xl bg-[#13273F] border border-amber-500/30 relative overflow-hidden text-center shadow-xl group cursor-pointer"
        >
          <div className="relative z-10 space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 flex items-center justify-center gap-2">
              🏆 Total Hackathon Cash Pool
            </span>
            <div className="text-5xl sm:text-7xl font-black font-['Space_Grotesk'] text-gradient-gold drop-shadow-md">
              ₹25,500
            </div>
            <p className="text-slate-300 text-sm sm:text-base font-light max-w-xl mx-auto">
              Distributed among top 4 winning teams alongside hardware innovation commendations and trophies.
            </p>
          </div>
        </motion.div>

        {/* 4 Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {prizes.map((prize, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-6 rounded-2xl bg-[#13273F]/90 border border-white/10 ${prize.accent.split(' ')[1]} relative flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl group transition-all duration-300 cursor-pointer`}
            >
              <div className="space-y-4 text-center relative z-10">
                <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{prize.icon}</div>
                
                <span className={`inline-block text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${prize.accent}`}>
                  {prize.rank}
                </span>

                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  {prize.title}
                </h3>

                <div className={`text-4xl font-extrabold font-['Space_Grotesk'] ${prize.textColor || "text-white"}`}>
                  {prize.amount}
                </div>

                <p className="text-slate-300 text-xs font-medium border-t border-white/10 pt-3">
                  {prize.badge}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-slate-400 group-hover:text-teal-400 transition-colors relative z-10">
                <FiCheckCircle className="text-teal-400" />
                <span>Certificate Included</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Perks Checklist */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#10263B] border border-white/10 relative overflow-hidden">
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
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm font-['Space_Grotesk'] mb-1">
                      {perk.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
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
