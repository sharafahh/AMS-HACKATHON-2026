import { FiLayers, FiZap, FiInfo } from "react-icons/fi";

const tracksList = [
  "AI & Machine Learning",
  "Cyber Security",
  "Healthcare",
  "Agriculture",
  "Smart Education",
  "Smart Mobility",
  "Smart Automation",
  "FinTech",
  "Sustainability",
  "Disaster Management",
  "Quantum Computing",
  "Open Innovation",
];

function StepProjectDetails({ register, errors }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
          <FiLayers className="text-cyan-400" />
          Step 3: Select Innovation Track
        </h2>
        <p className="text-gray-400 text-xs font-light mt-1">
          Choose your target innovation domain. Official problem statements will be released on-spot at the start of the 24-hour hackathon!
        </p>
      </div>

      <div className="space-y-6">
        {/* Hackathon Track Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiZap className="text-amber-400" /> Select Innovation Domain Track *
          </label>
          <select
            {...register("track", { required: "Please select an innovation track" })}
            className={`w-full px-4 py-3.5 rounded-2xl bg-[#0b1329] border text-white text-sm focus:outline-none transition-colors ${
              errors.track ? "border-rose-500/80" : "border-white/10 focus:border-cyan-500"
            }`}
          >
            <option value="">-- Select Track Domain --</option>
            {tracksList.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
          {errors.track && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.track.message}</p>
          )}
        </div>

        {/* On-Spot Problem Statements Info Banner */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/30 bg-cyan-500/5 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <FiInfo size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Problem Statements Provided On-Spot!
              </h3>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                24-Hour Live Challenge
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
            Detailed problem statements and technical challenges for your chosen track domain will be officially announced on-spot during the opening ceremony on <strong>22 August 2026 at 9:00 AM IST</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StepProjectDetails;
