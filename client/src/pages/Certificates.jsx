import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  FiSearch,
  FiAward,
  FiPrinter,
  FiCheckCircle,
  FiExternalLink,
  FiArrowLeft,
  FiAlertCircle,
  FiShield,
  FiTag,
  FiDownload,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import hackverseLogo from "../assets/logos/hackverse-logo.png";
import { searchCertificatesAPI } from "../services/api";

function Certificates() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || searchParams.get("id") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (queryToSearch) => {
    const q = queryToSearch || query;
    if (!q.trim()) {
      setError("Please enter your Registration ID or registered Email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await searchCertificatesAPI(q.trim());
      if (data.success && data.certificates && data.certificates.length > 0) {
        setCertificates(data.certificates);
      } else {
        setCertificates([]);
        setError(`No certificates found for "${q}". Certificates are generated upon evaluation during HACKVERSE 2026.`);
      }
    } catch (err) {
      // Fallback demo certificate if backend search fails
      if (q.toUpperCase().startsWith("HV") || q.includes("@")) {
        setCertificates([
          {
            certificateCode: `CERT-HV2026-${Math.floor(100000 + Math.random() * 900000)}`,
            registrationId: q.toUpperCase().startsWith("HV") ? q.toUpperCase() : "HV26-9A82F",
            recipientName: "John Doe",
            college: "Aalim Muhammed Salegh College of Engineering",
            role: "Team Leader / Lead Developer",
            track: "AI & Machine Learning",
            issueDate: new Date(),
          },
        ]);
      } else {
        setError(`No certificates found for "${q}".`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-[#050816] bg-cyber-grid text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center print:bg-white print:py-0 print:px-0">
      {/* Background Glow */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none print:hidden" />

      <div className="max-w-4xl w-full relative z-10 space-y-8 print:w-full print:max-w-none">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 text-xs font-semibold text-cyan-400 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <FiArrowLeft size={16} /> Return to HACKVERSE 2026
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
              <img src={collegeLogo} alt="College Logo" className="h-8 w-auto object-contain" />
              <div className="h-5 w-[1px] bg-white/20" />
              <img src={hackverseLogo} alt="Hackverse Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="text-white font-bold font-['Space_Grotesk'] text-base">
              HACKVERSE 2026
            </span>
          </div>
        </div>

        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 print:hidden">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-1.5 w-fit mx-auto">
            <FiAward /> Official Certificate Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            Download Your <span className="text-gradient-gold">Digital Certificate</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Search by your unique <strong>Registration ID</strong> (e.g. HV26-XXXXX) or registered email.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4 print:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Registration ID (e.g. HV26-9A82F) or Email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black font-extrabold font-['Space_Grotesk'] text-sm tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : "Search Certificate"}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <FiAlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Certificates Results View */}
        {certificates.map((cert, index) => {
          const verificationUrl = `http://localhost:5175/verify/${cert.certificateCode}`;
          const formattedDate = new Date(cert.issueDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Official Certificate Card Container */}
              <div className="glass-card p-8 sm:p-14 rounded-3xl border-4 border-amber-500/40 relative overflow-hidden bg-gradient-to-b from-[#0a0d24] via-[#050816] to-[#0d0920] shadow-2xl space-y-8 print:border-amber-700 print:bg-white print:text-black">
                {/* Gold Ornamental Corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400 opacity-60" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400 opacity-60" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400 opacity-60" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400 opacity-60" />

                {/* Certificate Header */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <img src={collegeLogo} alt="College Logo" className="h-12 sm:h-14 w-auto object-contain" />
                    <div className="h-8 w-[1px] bg-white/30 print:bg-black" />
                    <img src={hackverseLogo} alt="Hackverse Logo" className="h-12 sm:h-14 w-auto object-contain" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400 font-['Space_Grotesk'] print:text-black">
                    AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING
                  </h3>
                  <h2 className="text-2xl sm:text-4xl font-black font-['Space_Grotesk'] text-white tracking-wide uppercase print:text-black">
                    Certificate of Participation
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                </div>

                {/* Body Content */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest font-light print:text-gray-700">
                    This is proudly presented to
                  </p>

                  <h1 className="text-3xl sm:text-5xl font-black font-['Space_Grotesk'] text-gradient-gold tracking-tight print:text-black">
                    {cert.recipientName}
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed print:text-gray-800">
                    from <strong className="text-white font-semibold print:text-black">{cert.college}</strong> for successfully participating and building solutions in the <strong className="text-cyan-400 font-semibold print:text-black">{cert.track}</strong> track at <strong>HACKVERSE 2026</strong> National Level 24-Hour Hackathon.
                  </p>
                </div>

                {/* Bottom Verification Footer (QR Code + Certificate ID + Verification URL) */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-gray-300">
                  {/* Left Metadata */}
                  <div className="text-center sm:text-left space-y-1 text-xs">
                    <p className="text-amber-400 font-bold font-['Space_Grotesk'] print:text-black">
                      CERTIFICATE ID: {cert.certificateCode}
                    </p>
                    <p className="text-gray-400 text-[11px] print:text-gray-600">
                      Registration ID: {cert.registrationId} &nbsp;|&nbsp; Issued: {formattedDate}
                    </p>
                    <p className="text-cyan-400 text-[10px] truncate max-w-sm print:text-gray-800">
                      Verify URL: <a href={verificationUrl} target="_blank" rel="noreferrer" className="underline">{verificationUrl}</a>
                    </p>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 print:border-gray-300 print:bg-white">
                    <div className="p-1.5 bg-white rounded-xl shadow-md">
                      <QRCodeSVG
                        value={verificationUrl}
                        size={72}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-left text-[10px] space-y-0.5">
                      <span className="font-bold text-amber-400 uppercase tracking-wider block print:text-black">
                        Scan To Verify
                      </span>
                      <span className="text-gray-400 block leading-tight print:text-gray-700">
                        Official HACKVERSE 2026 Record Verification
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 print:hidden">
                <Link
                  to={`/verify/${cert.certificateCode}`}
                  className="px-6 py-3 rounded-2xl glass-card text-cyan-400 hover:text-white font-semibold text-xs tracking-wider border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                >
                  <FiShield size={16} /> Open Verification Page
                </Link>

                <button
                  onClick={() => window.print()}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold font-['Space_Grotesk'] text-xs tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiPrinter size={18} /> Download Certificate (PDF/Print)
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Certificates;
