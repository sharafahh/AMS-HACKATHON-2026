import { FiUsers, FiUser, FiMail, FiPhone, FiBookOpen, FiAward, FiTag } from "react-icons/fi";

const academicYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const teamSizeOptions = [3, 4, 5, 6];

function StepTeamDetails({ register, errors, watch, setValue }) {
  const currentTeamSize = watch("teamSize") || 4;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
          <FiUsers className="text-cyan-400" />
          Step 1: Team & Leader Details
        </h2>
        <p className="text-gray-400 text-xs font-light mt-1">
          Provide basic information about your team, team leader, institution, and team size (3 to 6 members).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Team Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiUsers className="text-cyan-400" /> Team Name *
          </label>
          <input
            type="text"
            placeholder="e.g. CyberKnights"
            {...register("teamName", {
              required: "Team name is required",
              minLength: { value: 3, message: "Team name must be at least 3 characters" },
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.teamName ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.teamName && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.teamName.message}</p>
          )}
        </div>

        {/* Team Size Choice (3 to 6) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiAward className="text-amber-400" /> Team Size (3 to 6 Members) *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {teamSizeOptions.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setValue("teamSize", size, { shouldValidate: true })}
                className={`py-2.5 rounded-xl text-xs font-bold font-['Space_Grotesk'] transition-all ${
                  Number(currentTeamSize) === size
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400 scale-105"
                    : "glass-card text-gray-300 hover:text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                {size} Members
              </button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("teamSize", {
              required: "Please select team size",
              min: { value: 3, message: "Minimum 3 members required" },
              max: { value: 6, message: "Maximum 6 members allowed" },
            })}
          />
          {errors.teamSize && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.teamSize.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
        {/* Leader Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiUser className="text-cyan-400" /> Team Leader Full Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            {...register("leaderName", {
              required: "Leader name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.leaderName ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.leaderName && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.leaderName.message}</p>
          )}
        </div>

        {/* Leader Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiMail className="text-cyan-400" /> Leader Email Address *
          </label>
          <input
            type="email"
            placeholder="leader@college.edu"
            {...register("leaderEmail", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.leaderEmail ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.leaderEmail && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.leaderEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Leader Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiPhone className="text-cyan-400" /> Leader Phone Number (10 digits) *
          </label>
          <input
            type="tel"
            placeholder="9876543210"
            {...register("leaderPhone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit mobile number",
              },
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.leaderPhone ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.leaderPhone && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.leaderPhone.message}</p>
          )}
        </div>

        {/* College Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiBookOpen className="text-cyan-400" /> College / Institution *
          </label>
          <input
            type="text"
            placeholder="Aalim Muhammed Salegh CoE"
            {...register("college", {
              required: "College name is required",
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.college ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.college && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.college.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Department */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Department *
          </label>
          <input
            type="text"
            placeholder="e.g. CSE / IT / ECE"
            {...register("department", {
              required: "Department is required",
            })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${
              errors.department ? "border-rose-500/80 bg-rose-500/5" : "border-white/10 focus:border-cyan-500"
            }`}
          />
          {errors.department && (
            <p className="text-rose-400 text-xs font-medium mt-1">{errors.department.message}</p>
          )}
        </div>

        {/* Academic Year */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Academic Year *
          </label>
          <select
            {...register("year", { required: "Year is required" })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            {academicYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Referral Code */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <FiTag className="text-amber-400" /> Referral Code (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. AMSCE2026"
            {...register("referralCode")}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase"
          />
        </div>
      </div>
    </div>
  );
}

export default StepTeamDetails;
