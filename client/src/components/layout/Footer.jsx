import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiTwitter,
  FiHeart,
  FiArrowUp,
  FiShield,
  FiFileText,
} from "react-icons/fi";
import collegeLogo from "../../assets/logos/college-logo.png";
import amsHackathonLogo from "../../assets/logos/ams-hackathon-logo.png";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#03050d] border-t border-white/10 relative overflow-hidden text-gray-400 text-sm">
      {/* Glow ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Organizer info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
                <img
                  src={collegeLogo}
                  alt="College Logo"
                  className="h-8 w-auto object-contain"
                />
                <div className="h-5 w-[1px] bg-white/20" />
                <img
                  src={amsHackathonLogo}
                  alt="AMS HACKATHON 2026 Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <span className="text-white font-bold tracking-wider text-lg font-['Space_Grotesk']">
                AMS HACKATHON 2026
              </span>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-md">
              Internal Level 24-Hour Hackathon organized by AALIM MUHAMMED SALEGH COLLEGE OF ENGINEERING. Empowering student coders and hardware creators to build the future.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: FiGithub, href: "https://github.com", label: "GitHub" },
                { icon: FiLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
                { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-cyan-400 transition-colors">
                  Statistics
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-cyan-400 transition-colors">
                  Innovation Tracks
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-cyan-400 transition-colors">
                  Prize Pool
                </a>
              </li>
            </ul>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
              Event Info
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#timeline" className="hover:text-cyan-400 transition-colors">
                  Event Timeline
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-cyan-400 transition-colors">
                  Campus Facilities
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition-colors">
                  FAQ & Guidelines
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">
                  Contact Organizers
                </a>
              </li>
              <li>
                <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                  Team Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Organizer Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm font-['Space_Grotesk'] uppercase tracking-wider">
              Institution
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Aalim Muhammed Salegh College of Engineering
              <br />
              Avadi-IAF, Muthapudupet,
              <br />
              Chennai, Tamil Nadu 600055
            </p>
            <p className="text-xs text-cyan-400 font-medium">
              Affiliated to Anna University & Approved by AICTE
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Designed with</span>
            <FiHeart className="text-rose-500 fill-rose-500 animate-pulse" />
            <span>by <strong className="text-white">Team AMS HACKATHON 2026</strong></span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-gray-400">
              © 2026 AMS HACKATHON 2026. All rights reserved.
            </span>
            <a href="#faq" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
              <FiShield size={12} /> Privacy & Terms
            </a>
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 transition-all duration-300"
          >
            <FiArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
