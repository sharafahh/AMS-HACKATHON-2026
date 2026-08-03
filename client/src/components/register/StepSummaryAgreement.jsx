import { FiCheckCircle, FiShield, FiUsers, FiCpu, FiCreditCard, FiZap } from "react-icons/fi";
import { REGISTRATION_FEE_PER_PERSON } from "../../constants/fee";

function StepSummaryAgreement({ register, errors, watch }) {
  const formValues = watch();
  const teamSize = Number(formValues.teamSize || 4);
  const members = formValues.members || [];
  const feePerPerson = REGISTRATION_FEE_PER_PERSON;
  const totalFeeINR = teamSize * feePerPerson;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
          <FiShield className="text-cyan-400" />
          Step 4: Registration Summary & Mandatory Payment
        </h2>
        <p className="text-gray-400 text-xs font-light mt-1">
          Review your registration details. Registration is strictly saved to the database <strong>ONLY AFTER</strong> successful Razorpay payment verification.
        </p>
      </div>

      {/* Mandatory Payment Breakdown Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-purple-500/15 border border-amber-500/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <FiCreditCard size={28} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              Mandatory Registration Fee (₹{REGISTRATION_FEE_PER_PERSON} / Person)
            </span>
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              ₹{totalFeeINR} INR ({teamSize} Team Members × ₹{REGISTRATION_FEE_PER_PERSON})
            </h3>
            <p className="text-gray-300 text-xs font-light">
              Secures lab space, refreshments, mentorship, and participation certificates.
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
          <span className="text-2xl font-black font-['Space_Grotesk'] text-gradient-gold">
            ₹{totalFeeINR}
          </span>
          <p className="text-[10px] text-gray-400">Razorpay Secured</p>
        </div>
      </div>

      {/* Summary Card Container */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 bg-cyan-500/5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">
              Team Overview
            </span>
            <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
              {formValues.teamName || "Unnamed Team"}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-['Space_Grotesk']">
            {teamSize} Members Configured
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-cyan-400">
              <FiUsers /> Team Leader & Institution
            </h4>
            <div className="space-y-1">
              <p><strong className="text-gray-400">Leader Name:</strong> {formValues.leaderName}</p>
              <p><strong className="text-gray-400">Email:</strong> {formValues.leaderEmail}</p>
              <p><strong className="text-gray-400">Phone:</strong> {formValues.leaderPhone}</p>
              <p><strong className="text-gray-400">College:</strong> {formValues.college}</p>
              <p><strong className="text-gray-400">Dept & Year:</strong> {formValues.department} ({formValues.year})</p>
              {formValues.referralCode && (
                <p><strong className="text-amber-400">Referral Code:</strong> {formValues.referralCode}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-400">
              <FiZap /> Innovation Domain & Problem Statement
            </h4>
            <div className="space-y-1">
              <p><strong className="text-gray-400">Selected Track:</strong> <span className="text-cyan-300 font-semibold">{formValues.track || "Not Selected"}</span></p>
              <p><strong className="text-gray-400">Problem Statement:</strong> <span className="text-amber-400 font-medium">To Be Announced On-Spot (22 Aug 9:00 AM)</span></p>
            </div>
          </div>
        </div>

        {/* Member Details Summary Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-300">
            Registered Members ({teamSize} Members)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: teamSize }, (_, i) => i).map((idx) => {
              const m = members[idx] || {};
              const memberNum = idx + 1;
              const isLeader = memberNum === 1;

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Member {memberNum} {isLeader && "(Leader)"}</span>
                    <span className="text-[10px] text-cyan-400 font-medium">{m.role || "Member"}</span>
                  </div>
                  <p className="text-gray-200 font-semibold truncate">{m.name || "N/A"}</p>
                  {isLeader && <p className="text-gray-400 truncate">{m.email}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="p-5 rounded-2xl glass-card border border-white/10 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("agreement", {
              required: "You must agree to the Code of Conduct and Mandatory Fee to proceed",
            })}
            className="mt-1 w-4 h-4 rounded border-white/20 text-cyan-500 focus:ring-cyan-500 bg-white/5"
          />
          <span className="text-xs text-gray-300 font-light leading-relaxed">
            I confirm that all team details are accurate, agree to pay the mandatory fee of ₹{totalFeeINR} (₹{REGISTRATION_FEE_PER_PERSON} × {teamSize} members), and abide by the official <strong className="text-cyan-400">AMS HACKATHON 2026 Code of Conduct & Rules</strong>.
          </span>
        </label>
        {errors.agreement && (
          <p className="text-rose-400 text-xs font-medium pl-7">{errors.agreement.message}</p>
        )}
      </div>
    </div>
  );
}

export default StepSummaryAgreement;
