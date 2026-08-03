import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import collegeLogo from "../../assets/logos/college-logo.png";
import amsHackathonLogo from "../../assets/logos/ams-hackathon-logo.png";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Stats", href: "#stats" },
  { name: "Tracks", href: "#tracks" },
  { name: "Prizes", href: "#prizes" },
  { name: "Timeline", href: "#timeline" },
  { name: "Facilities", href: "#facilities" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navLinks.map((l) => l.href.replace("#", ""));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          const height = sectionEl.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav py-3.5 shadow-2xl shadow-blue-950/30"
          : "bg-gradient-to-b from-[#030712]/95 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logos & Brand */}
        <a href="#hero" className="flex items-center gap-3.5 group">
          <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white/5 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
            <img
              src={collegeLogo}
              alt="AMS College Logo"
              className="h-9 w-auto object-contain filter drop-shadow-md"
            />
            <div className="h-6 w-[1px] bg-white/20" />
            <img
              src={amsHackathonLogo}
              alt="AMS HACKATHON 2026 Logo"
              className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] transform group-hover:scale-110 transition-transform"
            />
          </div>

          <div className="hidden sm:block text-left">
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold font-['Space_Grotesk'] text-base tracking-wider">
                AMS HACKATHON 2026
              </span>
              <span className="bg-blue-600 text-[10px] font-extrabold text-white px-2 py-0.5 rounded uppercase tracking-wider">
                2026
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tight truncate max-w-[200px]">
              Aalim Muhammed Salegh CoE
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-500/20 shadow-lg">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white font-bold"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-blue-600 border border-blue-400/60 rounded-full shadow-md shadow-blue-600/40"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Buttons & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/hardware-problems"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-500/80 text-xs font-bold font-['Space_Grotesk'] transition-all shadow-md"
          >
            Hardware PS
          </Link>

          <Link
            to="/register"
            className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 rounded-full animate-pulse-glow" />
            <span className="relative inline-flex items-center gap-2 px-5.5 py-2 rounded-full bg-[#030712] text-white text-xs font-bold font-['Space_Grotesk'] tracking-wider group-hover:bg-transparent group-hover:text-white transition-all duration-300 shadow-xl">
              Register Now
              <FiChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-white/5 border border-blue-500/20 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden glass-nav border-b border-blue-500/20 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-2 max-w-7xl mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-200 hover:text-white hover:bg-blue-600/20 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/hardware-problems"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase"
                >
                  Hardware PS Portal
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;