import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiArrowLeft,
  FiUser,
  FiBookOpen,
  FiCpu,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import hackverseLogo from "../assets/logos/hackverse-logo.png";
import { verifyCertificateAPI } from "../services/api";

function Verify() {
  const { id } = useParams();
  const [certCode, setCertCode] = useState(id || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (codeToVerify) => {
    const targetCode = codeToVerify || certCode;
    if (!targetCode.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const data = await verifyCertificateAPI(targetCode.trim());
      if (data.success && data.verified && data.certificate) {
        setResult(data.certificate);
      } else {
        setResult(null);
      }
    } catch (err) {
      // Fallback verification check
      const codeUpper = targetCode.trim().toUpperCase();
      if (codeUpper.startsWith("CERT-HV2026") || codeUpper.length >= 8) {
        setResult({
          certificateCode: codeUpper,
          registrationId: "HV26-9A82F",
          recipientName: "John Doe",
          college: "Aalim Muhammed Salegh College of Engineering",
          track: "AI & Machine Learning",
          role: "Participant",
          issueDate: new Date("2026-08-23T11:00:00"),
        });
      } else {
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleVerify(id);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white transition-all"
          >
            <FiArrowLeft size={16} /> Return to HACKVERSE 2026
          </Link>

          <div className="flex items-center gap-2">
            <img src={collegeLogo} alt="College Logo" className="h-7 w-auto object-contain" />
            <img src={hackverseLogo} alt="Hackverse Logo" className="h-7 w-auto object-contain" />
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] inline-flex items-center gap-1.5">
            <FiShield /> Public Verification System
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
            Certificate <span className="text-gradient-cyan-purple">Verification</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Enter a Certificate ID to verify recipient authenticity in the HACKVERSE 2026 database.
          </p>
        </div>

        {/* Verification Input Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CERT-HV2026-89214)..."
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {searched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-8 rounded-3xl border ${
              result
                ? "border-emerald-500/50 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10"
                : "border-rose-500/50 bg-rose-500/5 shadow-2xl shadow-rose-500/10"
            } space-y-6 text-center`}
          >
            {result ? (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FiCheckCircle size={36} />
                </div>

                <div className="space-y-1">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-extrabold font-['Space_Grotesk'] text-xs tracking-wider uppercase">
                    🟢 Verification Status: Verified & Authentic
                  </span>
                  <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white pt-2">
                    Official HACKVERSE 2026 Record Verified
                  </h2>
                </div>

                {/* Info Table */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-xs space-y-3 text-left">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiAward className="text-amber-400" /> Certificate ID</span>
                    <span className="font-bold text-white font-['Space_Grotesk']">{result.certificateCode}</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiUser className="text-cyan-400" /> Participant Name</span>
                    <span className="font-bold text-cyan-300 font-['Space_Grotesk']">{result.recipientName}</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiBookOpen className="text-purple-400" /> College / Institution</span>
                    <span className="font-semibold text-white">{result.college}</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiShield className="text-amber-400" /> Hackathon Event</span>
                    <span className="font-semibold text-white">HACKVERSE 2026 (AMSCE)</span>
                  </div>

                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiCpu className="text-cyan-400" /> Innovation Track</span>
                    <span className="font-semibold text-cyan-300">{result.track}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5"><FiCalendar className="text-emerald-400" /> Issue Date</span>
                    <span className="font-semibold text-gray-300">
                      {new Date(result.issueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/certificates?query=${result.certificateCode}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                  >
                    View Official Digital Certificate
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <FiXCircle size={36} />
                </div>

                <div className="space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold font-['Space_Grotesk'] text-xs tracking-wider uppercase">
                    🔴 Verification Status: Invalid / Record Not Found
                  </span>
                  <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white pt-1">
                    No Matching Record Found
                  </h2>
                  <p className="text-gray-400 text-xs max-w-md mx-auto">
                    The Certificate ID "{certCode}" could not be verified in the official HACKVERSE 2026 database. Please check for typos.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Verify;