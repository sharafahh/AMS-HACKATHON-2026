import { FiUsers, FiUser, FiMail, FiPhone, FiCpu, FiLayers } from "react-icons/fi";

const rolesList = [
  "Lead Developer",
  "Frontend / UI/UX Developer",
  "Backend & API Engineer",
  "Hardware & Embedded Systems Tech",
  "AI / Machine Learning Engineer",
  "Cyber Security Specialist",
  "Cloud & DevOps Engineer",
];

function StepMemberDetails({ register, errors, watch }) {
  const teamSize = Number(watch("teamSize") || 4);

  // Generate array of member indices (0 to teamSize - 1)
  const memberIndices = Array.from({ length: teamSize }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
            <FiUsers className="text-cyan-400" />
            Step 2: Team Member Details ({teamSize} Members Selected)
          </h2>
          <p className="text-gray-400 text-xs font-light mt-1">
            Provide member names and departments. Full contact details are collected for the Team Leader (Member 1).
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold font-['Space_Grotesk']">
          {teamSize} Members Configured
        </span>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {memberIndices.map((idx) => {
          const memberNum = idx + 1;
          const isLeader = memberNum === 1;

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl glass-card border transition-all ${
                isLeader
                  ? "border-cyan-500/50 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-['Space_Grotesk'] ${
                      isLeader
                        ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    M{memberNum}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                      Member {memberNum} {isLeader && <span className="text-cyan-400 font-normal text-xs">(Team Leader)</span>}
                    </h3>
                    <p className="text-gray-400 text-[11px]">
                      {isLeader ? "Primary contact for hackathon communication" : `Team Member #${memberNum}`}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                  {isLeader ? "Full Leader Info" : "Name & Dept"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Member Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <FiUser className="text-cyan-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder={`Member ${memberNum} Full Name`}
                    {...register(`members.${idx}.name`, {
                      required: `Member ${memberNum} name is required`,
                      minLength: { value: 2, message: "Minimum 2 characters" },
                    })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none transition-colors ${
                      errors.members?.[idx]?.name ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
                    }`}
                  />
                  {errors.members?.[idx]?.name && (
                    <p className="text-rose-400 text-[11px] font-medium mt-0.5">
                      {errors.members[idx].name.message}
                    </p>
                  )}
                </div>

                {/* Member Department (Dept) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <FiLayers className="text-cyan-400" /> Department (Dept) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSE, AIDS, ECE, IT, MECH"
                    {...register(`members.${idx}.department`, {
                      required: `Member ${memberNum} department is required`,
                    })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none transition-colors ${
                      errors.members?.[idx]?.department ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
                    }`}
                  />
                  {errors.members?.[idx]?.department && (
                    <p className="text-rose-400 text-[11px] font-medium mt-0.5">
                      {errors.members[idx].department.message}
                    </p>
                  )}
                </div>

                {/* Member 1 (Leader) ONLY: Email */}
                {isLeader && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                      <FiMail className="text-cyan-400" /> Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="leader@college.edu"
                      {...register(`members.0.email`, {
                        required: "Leader email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format",
                        },
                      })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none transition-colors ${
                        errors.members?.[0]?.email ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
                      }`}
                    />
                    {errors.members?.[0]?.email && (
                      <p className="text-rose-400 text-[11px] font-medium mt-0.5">
                        {errors.members[0].email.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Member 1 (Leader) ONLY: Phone */}
                {isLeader && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                      <FiPhone className="text-cyan-400" /> Phone Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      {...register(`members.0.phone`, {
                        required: "Leader phone is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Valid 10-digit mobile required",
                        },
                      })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none transition-colors ${
                        errors.members?.[0]?.phone ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
                      }`}
                    />
                    {errors.members?.[0]?.phone && (
                      <p className="text-rose-400 text-[11px] font-medium mt-0.5">
                        {errors.members[0].phone.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Member Specialty / Role */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                    <FiCpu className="text-amber-400" /> Primary Role / Specialty *
                  </label>
                  <select
                    {...register(`members.${idx}.role`, {
                      required: `Member ${memberNum} role is required`,
                    })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepMemberDetails;
