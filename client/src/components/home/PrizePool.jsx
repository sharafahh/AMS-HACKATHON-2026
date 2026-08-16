import { motion } from "framer-motion";
import {
  FiAward,
  FiCheckCircle,
  FiCode,
  FiGlobe,
  FiMic,
  FiPenTool,
  FiZap,
} from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import renderLogo from "../../assets/logos/render_nobg.png";
import xyzLogo from "../../assets/logos/xyz_nobg.png";
import codecrafterLogo from "../../assets/logos/codecrafters_nobg.png";

const prizes = [
  {
    rank: "1st Place",
    title: "Champion",
    amount: "₹10,000",
    badge: "Champion Trophy + Certificate",
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    glow: "border-amber-400/60 shadow-amber-500/25",
    bgAccent: "bg-amber-500/10",
    textColor: "text-amber-400",
    icon: "🥇",
    featured: true,
  },
  {
    rank: "2nd Place",
    title: "Runner-Up",
    amount: "₹7,500",
    badge: "Runner-Up Trophy + Certificate",
    gradient: "from-slate-200 via-gray-400 to-slate-500",
    glow: "border-slate-400/40 hover:border-slate-300",
    bgAccent: "bg-slate-400/10",
    textColor: "text-slate-300",
    icon: "🥈",
  },
  {
    rank: "3rd Place",
    title: "Second Runner-Up",
    amount: "₹5,000",
    badge: "Second Runner-Up + Certificate",
    gradient: "from-amber-700 via-orange-600 to-amber-800",
    glow: "border-amber-700/40 hover:border-amber-500",
    bgAccent: "bg-amber-700/10",
    textColor: "text-amber-500",
    icon: "🥉",
  },
  {
    rank: "4th Place",
    title: "Special Mention",
    amount: "₹3,000",
    badge: "Special Mention + Certificate",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "border-cyan-500/40 hover:border-cyan-400",
    bgAccent: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    icon: "🏅",
  },
];

const skillSignals = [
  { label: "Innovation", mark: "💡" },
  { label: "Pitching", mark: "🎤" },
  { label: "Coding", mark: "💻" },
  { label: "Design", mark: "🎨" },
  { label: "Execution", mark: "🚀" },
];

const recognition = [
  { title: "Most Innovative Solution", mark: "💡", icon: HiOutlineLightBulb, accent: "from-amber-400 to-orange-500" },
  { title: "Best Pitch", mark: "🎤", icon: FiMic, accent: "from-fuchsia-400 to-purple-500" },
  { title: "Best Technical Implementation", mark: "💻", icon: FiCode, accent: "from-cyan-400 to-blue-500" },
  { title: "Best UI/UX", mark: "🎨", icon: FiPenTool, accent: "from-pink-400 to-rose-500" },
  { title: "Best Execution", mark: "🚀", icon: FiZap, accent: "from-indigo-400 to-cyan-400" },
  { title: "Social Impact", mark: "🌍", icon: FiGlobe, accent: "from-emerald-400 to-teal-500" },
];

const builderPerks = [
  {
    name: "Render",
    logo: renderLogo,
    tag: "Hosting Partner",
    link: "https://render.com/",
    cardClass: "bg-white hover:shadow-[0_8px_30px_rgba(239,68,68,0.18)]",
    titleClass: "text-gray-900",
    tagClass: "text-red-500/80",
  },
  {
    name: "xyz.gen",
    logo: xyzLogo,
    tag: "Domain Partner",
    link: "https://gen.xyz/",
    cardClass: "bg-[#0b1120] border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(34,211,238,0.16)]",
    titleClass: "text-cyan-300",
    tagClass: "text-blue-400/80",
  },
  {
    name: "CodeCrafters",
    logo: codecrafterLogo,
    tag: "Developer Tooling",
    link: "https://codecrafters.io/",
    cardClass: "bg-white hover:shadow-[0_8px_30px_rgba(239,68,68,0.18)]",
    titleClass: "text-gray-900",
    tagClass: "text-red-500/80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function PrizePool() {
  return (
    <section id="prizes" className="py-24 relative bg-[#030611] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-24 left-8 w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[320px] h-[320px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-[0.18em] font-['Space_Grotesk']"
          >
            Rewards & Opportunities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white leading-tight"
          >
            Rewards That Go{" "}
            <span className="text-gradient-cyan-purple">Beyond the Podium</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-base sm:text-lg font-semibold tracking-wide text-amber-300/90"
          >
            ₹25,500+ in Cash Prizes & Career Opportunities
          </motion.p>
        </div>

        {/* Career Accelerator */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-20 rounded-[2rem] overflow-hidden glass-card border border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.12)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-indigo-600/10 to-purple-600/20" />
          <motion.div
            animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl"
          />
          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.25], x: [0, 18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl"
          />

          <div className="relative z-10 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                🚀 Career Accelerator
              </span>
              <div className="mt-5 flex items-end gap-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 }}
                  className="text-7xl sm:text-8xl lg:text-9xl font-black font-['Space_Grotesk'] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                >
                  10
                </motion.span>
                <div className="pb-2 sm:pb-3">
                  <p className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white leading-tight">
                    Internship
                    <br />
                    Opportunities
                  </p>
                </div>
              </div>
              <p className="mt-4 inline-flex w-fit text-[11px] uppercase tracking-widest font-semibold text-cyan-200/80 border border-cyan-400/20 rounded-full px-3 py-1 bg-cyan-500/10">
                Not limited to cash-prize winners
              </p>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <p className="text-gray-200 text-sm sm:text-base font-light leading-relaxed">
                Exceptional performers beyond the winning teams will be considered for internship
                opportunities through Infosys Springboard and participating sponsors.
              </p>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold mb-3">
                  Skill recognition
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillSignals.map((skill, i) => (
                    <motion.span
                      key={skill.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.06 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-100 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-colors"
                    >
                      <span aria-hidden="true">{skill.mark}</span>
                      {skill.label}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cash Champions */}
        <div className="mb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-amber-400 font-bold mb-2">
                Cash Champions
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                The podium purse
              </h3>
            </div>
            <p className="text-sm text-gray-400">
              Total cash prize pool{" "}
              <span className="text-amber-300 font-semibold">₹25,500</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:items-stretch">
            {prizes.map((prize, idx) => (
              <motion.article
                key={prize.rank}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: prize.featured ? 1.03 : 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`glass-card relative flex flex-col rounded-3xl border ${prize.glow} overflow-hidden group ${
                  prize.featured
                    ? "p-7 sm:p-8 xl:-mt-4 xl:mb-[-1rem] shadow-[0_20px_50px_rgba(245,158,11,0.18)]"
                    : "p-6 shadow-xl"
                }`}
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${prize.gradient} rounded-3xl blur-xl ${
                    prize.featured ? "opacity-25 group-hover:opacity-45" : "opacity-0 group-hover:opacity-30"
                  } transition-opacity duration-500 -z-10`}
                />
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${prize.gradient}`} />

                <div className="text-center space-y-3 relative z-10 flex-1">
                  <div
                    className={`mx-auto ${prize.featured ? "text-5xl" : "text-4xl"} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {prize.icon}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${prize.bgAccent} ${prize.textColor}`}
                  >
                    {prize.rank}
                  </span>
                  <h4 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                    {prize.title}
                  </h4>
                  <p
                    className={`font-black font-['Space_Grotesk'] ${prize.textColor} ${
                      prize.featured ? "text-5xl" : "text-3xl"
                    }`}
                  >
                    {prize.amount}
                  </p>
                  <p className="text-gray-400 text-xs pt-3 border-t border-white/10">{prize.badge}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-gray-400 group-hover:text-cyan-300 transition-colors relative z-10">
                  <FiCheckCircle className={prize.textColor} />
                  <span>Certificate Included</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Beyond the Podium */}
        <div className="mb-20">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10 space-y-3"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple-300 font-bold">
              Recognition
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
              Beyond the Podium
            </h3>
            <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed">
              Not every winner stands on the podium. Exceptional talent will be recognized for the
              skills that make great builders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recognition.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="glass-card group relative rounded-2xl border border-white/10 hover:border-cyan-400/30 p-5 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-400`}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-[11px] text-gray-500 mb-0.5" aria-hidden="true">
                        {item.mark}
                      </p>
                      <h4 className="text-white font-semibold font-['Space_Grotesk'] text-sm leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Builder Perks */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-400 font-bold mb-2">
                Developer Ecosystem
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk'] text-white flex items-center gap-2">
                <FiAward className="text-cyan-400" />
                Builder Perks
              </h3>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Infrastructure and tooling partners supporting the hackathon ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {builderPerks.map((partner, i) => (
              <motion.a
                key={partner.name}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group flex items-center gap-5 rounded-2xl p-5 border border-white/10 transition-shadow ${partner.cardClass}`}
              >
                <div className="h-14 w-28 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-12 max-w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className={`font-bold font-['Space_Grotesk'] ${partner.titleClass}`}>{partner.name}</h4>
                  <p className={`text-[11px] uppercase tracking-wider font-semibold mt-1 ${partner.tagClass}`}>
                    {partner.tag}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PrizePool;
