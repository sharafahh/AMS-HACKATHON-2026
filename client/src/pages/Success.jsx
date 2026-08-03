import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { REGISTRATION_FEE_PER_PERSON } from "../constants/fee";
import {
  FiCheckCircle,
  FiDownload,
  FiExternalLink,
  FiHome,
  FiTag,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
  FiBookOpen,
  FiCpu,
  FiPrinter,
  FiUsers,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const registrationId = state.registrationId || "HV26-9A82F";
  const paymentId = state.paymentId || "pay_N928174A2";
  const teamName = state.teamName || "CyberKnights";
  const teamData = state.teamData || {};
  const amountPaid = state.amountPaid || (teamData?.teamSize || 4) * REGISTRATION_FEE_PER_PERSON;
  const paymentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleGoToPortal = () => {
    navigate(`/portal?id=${registrationId}`);
  };

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center print:bg-white print:text-black">
      {/* Background glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none print:hidden" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none print:hidden" />

      <div className="max-w-3xl w-full relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3 print:hidden">
          <div className="flex items-center justify-center gap-3">
            <img src={collegeLogo} alt="College Logo" className="h-10 w-auto object-contain" />
            <div className="h-6 w-[1px] bg-white/20" />
            <img src={amsHackathonLogo} alt="AMS HACKATHON 2026 Logo" className="h-10 w-auto object-contain" />
          </div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk']">
            Aalim Muhammed Salegh College of Engineering
          </span>
        </div>

        {/* Main Success & Receipt Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6 sm:p-10 rounded-3xl border border-cyan-500/30 space-y-8 shadow-2xl relative overflow-hidden print:border-black print:shadow-none print:bg-white"
        >
          {/* Top Banner Status */}
          <div className="text-center space-y-3 border-b border-white/10 pb-6 print:border-gray-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 print:hidden">
              <FiCheckCircle size={36} />
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white print:text-black">
              Registration & Payment Confirmed!
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm font-light print:text-gray-700">
              Welcome to AMS HACKATHON 2026. Your team details and Razorpay payment receipt have been saved.
            </p>
          </div>

          {/* Badges Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between print:border-gray-300">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase print:text-black">
                  Registration ID
                </span>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white print:text-black">
                  {registrationId}
                </h3>
              </div>
              <FiTag className="text-cyan-400" size={24} />
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between print:border-gray-300">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase print:text-black">
                  Razorpay Payment ID
                </span>
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white print:text-black truncate max-w-[180px]">
                  {paymentId}
                </h3>
              </div>
              <FiCreditCard className="text-amber-400" size={24} />
            </div>
          </div>

          {/* Team Overview Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold font-['Space_Grotesk'] uppercase tracking-wider text-cyan-400 print:text-black">
              Registered Team Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 print:text-black">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 print:border-gray-200">
                <FiUsers className="text-cyan-400" />
                <span>Team Name: <strong className="text-white print:text-black">{teamName}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 print:border-gray-200">
                <FiCalendar className="text-amber-400" />
                <span>Event Date: <strong className="text-white print:text-black">August 22–23, 2026</strong></span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 print:border-gray-200">
                <FiMapPin className="text-emerald-400" />
                <span>Venue: <strong className="text-white print:text-black">Aalim Muhammed Salegh CoE</strong></span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 print:border-gray-200">
                <FiCheckCircle className="text-cyan-400" />
                <span>Status: <strong className="text-emerald-400 print:text-black">CONFIRMED (PAID)</strong></span>
              </div>
            </div>
          </div>

          {/* Itemized Payment Receipt */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold font-['Space_Grotesk'] uppercase tracking-wider text-amber-400 print:text-black flex items-center justify-between">
              <span>Official Payment Receipt</span>
              <span className="text-[10px] text-gray-400 font-normal">Date: {paymentDate}</span>
            </h3>

            <div className="rounded-2xl overflow-hidden border border-white/10 print:border-gray-300 text-xs">
              <table className="w-full text-left">
                <thead className="bg-white/10 text-white print:bg-gray-100 print:text-black font-['Space_Grotesk']">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 print:divide-gray-200 print:text-black">
                  <tr>
                    <td className="p-3 font-medium">AMS HACKATHON 2026 Registration Fee</td>
                    <td className="p-3 text-center">{(teamData?.teamSize || Math.round(amountPaid / REGISTRATION_FEE_PER_PERSON) || 4)} Members</td>
                    <td className="p-3 text-right">₹{REGISTRATION_FEE_PER_PERSON}</td>
                    <td className="p-3 text-right font-bold text-white print:text-black">₹{amountPaid}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-white/5 font-bold text-white print:bg-gray-50 print:text-black">
                  <tr>
                    <td colSpan="3" className="p-3 text-right">Total Amount Paid:</td>
                    <td className="p-3 text-right text-amber-400 print:text-black text-sm">₹{amountPaid} INR</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-card text-gray-300 hover:text-white font-semibold text-xs tracking-wider border border-white/15 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <FiHome size={16} /> Return to Home
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl glass-card text-cyan-400 hover:text-white font-semibold text-xs tracking-wider border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <FiPrinter size={16} /> Download Receipt
              </button>

              <button
                onClick={handleGoToPortal}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-xs tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Go To Portal <FiExternalLink size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Success;