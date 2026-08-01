import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import collegeLogo from "../../assets/logos/college-logo.png";
import hackverseLogo from "../../assets/logos/hackverse-logo.png";

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

      const sections = navLinks.map((link) => link.href.replace("#", ""));
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
          ? "glass-nav py-3 shadow-2xl shadow-cyan-950/20"
          : "bg-gradient-to-b from-[#050816]/90 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logos & Brand */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition-all duration-300">
            <img
              src={collegeLogo}
              alt="Aalim Muhammed Salegh College of Engineering"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="h-6 w-[1px] bg-white/20" />
            <img
              src={hackverseLogo}
              alt="Hackverse 2026 Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-wider text-base font-['Space_Grotesk'] group-hover:text-cyan-400 transition-colors">
                HACKVERSE
              </span>
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-[10px] font-bold text-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                2026
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-tight font-medium uppercase truncate max-w-[200px]">
              Aalim Muhammed Salegh CoE
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/40 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Action Button & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/hardware-problems"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-500/60 text-xs font-semibold font-['Space_Grotesk'] transition-all"
          >
            Hardware PS
          </Link>

          <Link
            to="/register"
            className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 rounded-full animate-pulse-glow" />
            <span className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#050816] text-white text-xs font-semibold font-['Space_Grotesk'] tracking-wide group-hover:bg-transparent group-hover:text-white transition-all duration-300">
              Register Now
              <FiChevronRight className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden border-b border-white/10 bg-[#050816]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const sectionId = link.href.replace("#", "");
                  const isActive = activeSection === sectionId;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{link.name}</span>
                      {isActive && <FiCheckCircle className="text-cyan-400 text-xs" />}
                    </a>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/25"
                >
                  Register For Hackverse
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