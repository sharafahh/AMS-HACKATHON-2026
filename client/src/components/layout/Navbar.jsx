import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "#hero" },
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

  const handleNavLinkClick = (event, href) => {
    event.preventDefault();
    const sectionId = href.replace("#", "");
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
      setIsOpen(false);
      return;
    }

    const topOffset = window.innerWidth < 640 ? 80 : 95;
    const top =
      targetSection.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sectionIds = navLinks.map((link) => link.href.replace("#", ""));
      const scrollPosition = window.scrollY + 150;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1929]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo - Top Left */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#07121F] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-blue-400 text-sm tracking-tighter">⚡</span>
              </div>
            </div>
            <span className="text-xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white group-hover:text-blue-400 transition-colors">
              AMS <span className="text-gradient-tech-blue">HACKS</span>
            </span>
          </Link>

          {/* Desktop Navigation Links Pill */}
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#10263B]/80 border border-white/10 backdrop-blur-md shadow-lg">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-md shadow-blue-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/portal"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-teal-400/40 text-xs font-bold text-slate-300 hover:text-white transition-all duration-200"
            >
              Student Portal
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
            >
              Register Team
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A1929]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-semibold text-slate-200 hover:text-white hover:border-blue-500/30 transition-all"
                >
                  <span>{link.name}</span>
                  <FiChevronRight className="text-slate-500" />
                </a>
              ))}

              <div className="pt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/portal"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-center rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200"
                >
                  Student Portal
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-extrabold uppercase"
                >
                  Register
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